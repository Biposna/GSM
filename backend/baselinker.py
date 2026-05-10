"""BaseLinker integration — optional.

If BASELINKER_TOKEN, BASELINKER_INVENTORY_ID and BASELINKER_ORDER_SOURCE_ID
are set in the environment, every successful Stripe order is pushed to
BaseLinker, the catalog can be pulled from BaseLinker, and stock can be
validated in real time.

If any of those env vars are missing, this module is a no-op — the rest of
the app keeps using the local catalog (`catalog.py`).

Set the values in `backend/.env`:

    BASELINKER_TOKEN=your_token_here
    BASELINKER_INVENTORY_ID=123
    BASELINKER_ORDER_SOURCE_ID=456

Get the token from:  Account → My Account → API
Inventory ID:         Catalogs → (your catalog) → URL contains the id
Order source ID:      Manage orders → Order sources → create one for the website
"""

from __future__ import annotations

import json
import logging
import os
import time
from typing import Any, Dict, List, Optional

import httpx

logger = logging.getLogger("baselinker")

API_URL = "https://api.baselinker.com/connector.php"
TIMEOUT = httpx.Timeout(30.0)


class BaseLinkerError(Exception):
    """Raised on any BaseLinker API failure or misconfiguration."""


def _token() -> Optional[str]:
    v = os.environ.get("BASELINKER_TOKEN", "").strip()
    return v or None


def _inventory_id() -> Optional[int]:
    v = os.environ.get("BASELINKER_INVENTORY_ID", "").strip()
    return int(v) if v.isdigit() else None


def _order_source_id() -> Optional[int]:
    v = os.environ.get("BASELINKER_ORDER_SOURCE_ID", "").strip()
    return int(v) if v.isdigit() else None


def is_configured() -> bool:
    return bool(_token() and _inventory_id() and _order_source_id())


async def _call(method: str, parameters: Dict[str, Any]) -> Dict[str, Any]:
    token = _token()
    if not token:
        raise BaseLinkerError("BaseLinker not configured (BASELINKER_TOKEN missing)")

    payload = {"method": method, "parameters": json.dumps(parameters)}
    headers = {
        "X-BLToken": token,
        "Content-Type": "application/x-www-form-urlencoded",
    }

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(API_URL, data=payload, headers=headers)
            r.raise_for_status()
            data = r.json()
    except httpx.RequestError as e:
        logger.error("BaseLinker network error: %s", e)
        raise BaseLinkerError(f"Network error talking to BaseLinker: {e}") from e

    if data.get("status") == "ERROR":
        msg = data.get("error_message", "Unknown error")
        logger.error("BaseLinker API error on %s: %s", method, msg)
        raise BaseLinkerError(msg)
    return data


async def get_stock(product_ids: List[str]) -> Dict[str, int]:
    if not product_ids:
        return {}
    inv_id = _inventory_id()
    data = await _call(
        "getInventoryProductsStock",
        {"inventory_id": inv_id, "products": product_ids},
    )
    out: Dict[str, int] = {}
    for pid in product_ids:
        v = data.get("products", {}).get(str(pid), 0)
        if isinstance(v, dict):
            v = sum(int(x or 0) for x in v.values())
        out[str(pid)] = int(v or 0)
    return out


async def get_catalog() -> List[Dict[str, Any]]:
    inv_id = _inventory_id()
    listing = await _call("getInventoryProductsList", {"inventory_id": inv_id})
    products = listing.get("products") or {}
    if not products:
        return []
    ids = [str(pid) for pid in products.keys()]
    detail = await _call(
        "getInventoryProductsData",
        {"inventory_id": inv_id, "products": ids},
    )
    details = detail.get("products") or {}
    stock_map = await get_stock(ids)

    out: List[Dict[str, Any]] = []
    for pid, info in details.items():
        text_fields = info.get("text_fields") or {}
        prices = info.get("prices") or {}
        price = prices.get(str(inv_id)) or info.get("price_brutto") or 0
        images = info.get("images") or []
        out.append({
            "id": str(pid),
            "title": info.get("name") or text_fields.get("name") or "",
            "description": (info.get("description") or text_fields.get("description") or "").strip(),
            "price": float(price or 0),
            "stock": stock_map.get(str(pid), 0),
            "image": images[0] if images else None,
            "sku": info.get("sku") or "",
            "category_id": info.get("category_id"),
        })
    return out


async def add_order(
    *,
    items: List[Dict[str, Any]],
    email: str,
    name: str,
    phone: str = "",
    total: float,
    currency: str = "PLN",
    custom_id: str = "",
    paid: bool = True,
    payment_method: str = "Stripe",
) -> int:
    inv_id = _inventory_id()
    src_id = _order_source_id()

    bl_products = []
    for it in items:
        bl_products.append({
            "storage": "db",
            "storage_id": str(inv_id),
            "product_id": str(it.get("id", "")),
            "name": it["title"],
            "sku": it.get("sku") or str(it.get("id", "")),
            "price_brutto": float(it["price"]),
            "tax_rate": 23,
            "quantity": int(it["qty"]),
        })

    params: Dict[str, Any] = {
        "order_source_id": src_id,
        "date_add": int(time.time()),
        "currency": currency,
        "payment_method": payment_method,
        "payment_method_cod": "0",
        "paid": 1 if paid else 0,
        "user_comments": "",
        "admin_comments": f"Stripe session: {custom_id}" if custom_id else "",
        "email": email,
        "phone": phone,
        "user_login": "",
        "delivery_method": "Standard",
        "delivery_price": 0,
        "delivery_fullname": name,
        "delivery_company": "",
        "delivery_address": "",
        "delivery_postcode": "",
        "delivery_city": "",
        "delivery_country_code": "PL",
        "invoice_fullname": name,
        "invoice_company": "",
        "invoice_nip": "",
        "invoice_address": "",
        "invoice_postcode": "",
        "invoice_city": "",
        "invoice_country_code": "PL",
        "want_invoice": 0,
        "products": bl_products,
        "custom_source_id": custom_id,
    }

    data = await _call("addOrder", params)
    order_id = data.get("order_id")
    if not order_id:
        raise BaseLinkerError(f"addOrder returned no order_id: {data}")
    logger.info("BaseLinker order created: %s (custom=%s, total=%s %s)", order_id, custom_id, total, currency)
    return int(order_id)
