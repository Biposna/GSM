from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone

import stripe

from catalog import get_item, GAMES as LOCAL_GAMES, ACCESSORIES as LOCAL_ACCESSORIES
import baselinker as bl


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

stripe.api_key = os.environ["STRIPE_API_KEY"]
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
CURRENCY = os.environ.get("STORE_CURRENCY", "pln")

app = FastAPI(title="As Game & GSM API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------- Models ----------
class BookingCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=30)
    device: str = Field(min_length=2, max_length=80)
    service: str = Field(min_length=2, max_length=80)
    issue: str = Field(min_length=5, max_length=1000)
    preferred_date: Optional[str] = None


class Booking(BookingCreate):
    id: str
    status: str = "pending"
    created_at: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: Optional[str] = Field(default=None, max_length=120)
    message: str = Field(min_length=5, max_length=2000)


class Contact(ContactCreate):
    id: str
    created_at: str


class CartItem(BaseModel):
    id: str
    qty: int = Field(ge=1, le=20)


class CheckoutRequest(BaseModel):
    items: List[CartItem]
    origin_url: str
    customer_email: Optional[EmailStr] = None


class CheckoutCreated(BaseModel):
    session_id: str
    url: str


class CheckoutStatusOut(BaseModel):
    session_id: str
    status: str
    payment_status: str
    amount_total: float
    currency: str
    items: List[Dict[str, Any]]


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"service": "As Game & GSM API", "status": "online"}


@api_router.get("/health")
async def health():
    return {"ok": True, "time": now_iso()}


# Bookings
@api_router.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "pending"
    doc["created_at"] = now_iso()
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    return Booking(**doc)


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings():
    items = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Booking(**i) for i in items]


# Contact
@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now_iso()
    await db.contacts.insert_one(doc)
    doc.pop("_id", None)
    return Contact(**doc)


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    items = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Contact(**i) for i in items]


# ---------- Products / Stock (BaseLinker if configured, else local) ----------
@api_router.get("/products")
async def list_products():
    if bl.is_configured():
        try:
            return {"source": "baselinker", "items": await bl.get_catalog()}
        except bl.BaseLinkerError as e:
            logging.warning("BaseLinker get_catalog failed, falling back: %s", e)
    items = [{**g, "stock": None, "kind": "game"} for g in LOCAL_GAMES] + \
            [{**a, "stock": None, "kind": "accessory"} for a in LOCAL_ACCESSORIES]
    return {"source": "local", "items": items}


class StockCheckIn(BaseModel):
    items: List[CartItem]


@api_router.post("/checkout/validate-stock")
async def validate_stock(payload: StockCheckIn):
    if not bl.is_configured():
        return {"source": "local", "results": [
            {"id": i.id, "qty_requested": i.qty, "qty_available": None, "ok": True}
            for i in payload.items
        ]}
    try:
        stock_map = await bl.get_stock([str(i.id) for i in payload.items])
    except bl.BaseLinkerError as e:
        raise HTTPException(503, f"Stock check unavailable: {e}")
    results = []
    for it in payload.items:
        avail = int(stock_map.get(str(it.id), 0))
        results.append({
            "id": it.id,
            "qty_requested": it.qty,
            "qty_available": avail,
            "ok": avail >= it.qty,
        })
    return {"source": "baselinker", "results": results}


# ---------- Stripe Checkout (official SDK) ----------
@api_router.post("/checkout/session", response_model=CheckoutCreated)
async def create_checkout_session(payload: CheckoutRequest):
    if not payload.items:
        raise HTTPException(400, "Cart is empty")

    # Server-side price lookup — never trust the client.
    resolved = []
    line_items = []
    total = 0.0
    for c in payload.items:
        item = get_item(c.id)
        if not item:
            raise HTTPException(400, f"Unknown product id: {c.id}")
        line_total = round(item["price"] * c.qty, 2)
        total = round(total + line_total, 2)
        resolved.append({
            "id": item["id"],
            "title": item["title"],
            "platform": item["platform"],
            "price": item["price"],
            "qty": c.qty,
            "line_total": line_total,
        })
        line_items.append({
            "price_data": {
                "currency": CURRENCY,
                "product_data": {
                    "name": item["title"],
                    "description": item.get("platform", ""),
                },
                "unit_amount": int(round(item["price"] * 100)),
            },
            "quantity": c.qty,
        })

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/checkout/cancel"

    metadata = {
        "source": "asgame_gsm_store",
        "item_count": str(sum(c.qty for c in payload.items)),
    }
    if payload.customer_email:
        metadata["customer_email"] = payload.customer_email

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            success_url=success_url,
            cancel_url=cancel_url,
            customer_email=payload.customer_email,
            metadata=metadata,
        )
    except stripe.error.StripeError as e:
        logging.exception("Stripe session creation failed")
        raise HTTPException(502, f"Payment provider error: {e.user_message or str(e)}")

    order_doc = {
        "id": str(uuid.uuid4()),
        "session_id": session.id,
        "items": resolved,
        "amount_total": total,
        "currency": CURRENCY,
        "customer_email": payload.customer_email,
        "status": "initiated",
        "payment_status": "pending",
        "metadata": metadata,
        "created_at": now_iso(),
        "updated_at": now_iso(),
    }
    await db.payment_transactions.insert_one(order_doc)

    return CheckoutCreated(session_id=session.id, url=session.url)


@api_router.get("/checkout/status/{session_id}", response_model=CheckoutStatusOut)
async def get_checkout_status(session_id: str):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(404, "Order not found")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        new_status = session.status or "initiated"
        new_payment_status = session.payment_status or "pending"
        amount_total = float(session.amount_total or int(tx["amount_total"] * 100)) / 100.0
        currency = (session.currency or tx.get("currency", CURRENCY)).lower()

        if (
            tx.get("payment_status") != new_payment_status
            or tx.get("status") != new_status
        ):
            await db.payment_transactions.update_one(
                {"session_id": session_id},
                {"$set": {
                    "status": new_status,
                    "payment_status": new_payment_status,
                    "amount_total": amount_total,
                    "currency": currency,
                    "updated_at": now_iso(),
                }},
            )
            tx["payment_status"] = new_payment_status
            tx["status"] = new_status
    except stripe.error.StripeError as e:
        logging.warning("Stripe status retrieve failed for %s: %s", session_id, e)
        new_payment_status = tx.get("payment_status", "pending")
        new_status = tx.get("status", "initiated")
        amount_total = float(tx.get("amount_total", 0.0))
        currency = tx.get("currency", CURRENCY)

    if (
        new_payment_status == "paid"
        and bl.is_configured()
        and not tx.get("baselinker_order_id")
    ):
        await _push_to_baselinker(session_id, tx)

    return CheckoutStatusOut(
        session_id=session_id,
        status=new_status,
        payment_status=new_payment_status,
        amount_total=amount_total,
        currency=currency,
        items=tx.get("items", []),
    )


async def _push_to_baselinker(session_id: str, tx: Dict[str, Any]) -> None:
    """Push a paid order into BaseLinker. Idempotent: stores returned id."""
    try:
        bl_order_id = await bl.add_order(
            items=tx.get("items", []),
            email=tx.get("customer_email") or "",
            name=(tx.get("customer_email") or "Stripe customer").split("@")[0] or "Customer",
            total=float(tx.get("amount_total", 0.0)),
            currency=str(tx.get("currency", CURRENCY)).upper(),
            custom_id=session_id,
            paid=True,
            payment_method="Stripe",
        )
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "baselinker_order_id": bl_order_id,
                "baselinker_pushed_at": now_iso(),
            }},
        )
    except bl.BaseLinkerError as e:
        logging.error("BaseLinker push failed for %s: %s", session_id, e)
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "baselinker_last_error": str(e),
                "baselinker_last_error_at": now_iso(),
            }},
        )


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("Stripe-Signature", "")

    if not STRIPE_WEBHOOK_SECRET:
        raise HTTPException(500, "Webhook secret not configured")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_WEBHOOK_SECRET)
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        raise HTTPException(400, f"Webhook signature error: {e}")

    if event["type"] in ("checkout.session.completed", "checkout.session.async_payment_succeeded"):
        session = event["data"]["object"]
        await db.payment_transactions.update_one(
            {"session_id": session["id"]},
            {"$set": {
                "status": session.get("status", "complete"),
                "payment_status": session.get("payment_status", "paid"),
                "updated_at": now_iso(),
                "last_webhook_event": event["type"],
            }},
        )
    elif event["type"] == "checkout.session.async_payment_failed":
        session = event["data"]["object"]
        await db.payment_transactions.update_one(
            {"session_id": session["id"]},
            {"$set": {
                "payment_status": "failed",
                "updated_at": now_iso(),
                "last_webhook_event": event["type"],
            }},
        )

    return {"received": True}


# ---------- App wiring ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
