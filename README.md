# As Game & GSM

A production-ready dark / neon gaming-aesthetic website for a phone, console,
tablet and controller repair shop with an integrated game & accessories store.

**Stack**: React 19 (CRA + Tailwind + shadcn/ui), FastAPI, MongoDB, Stripe Checkout.

## Features
- Marketing landing page (Hero, Services, About, Testimonials, Contact + map).
- Booking form for repair requests (`POST /api/bookings`).
- Contact form (`POST /api/contact`).
- Game store with category tabs (**Games** / **Accessories**), platform & type
  filters, live search, persistent cart (localStorage).
- **Stripe Checkout** in PLN (configurable). Server-side price lookup —
  client-sent prices are ignored.
- EN / PL i18n with localStorage-persisted preference.
- Responsive (mobile-first) with sticky nav, hamburger menu and a floating
  "Book a Repair" CTA.

## Project structure
```
.
├── backend/               # FastAPI + Motor + Stripe
│   ├── server.py
│   ├── catalog.py         # Server-side product catalog (source of truth)
│   ├── requirements.txt
│   └── .env.example
└── frontend/              # React 19
    ├── public/
    ├── src/
    │   ├── App.js
    │   ├── pages/         # HomePage, CheckoutSuccess, CheckoutCancel
    │   ├── components/    # Navbar, Hero, Services, GameStore, ...
    │   ├── cart/          # CartContext + CartDrawer
    │   ├── i18n/          # LanguageContext
    │   └── data/content.js
    ├── package.json
    └── .env.example
```

## Quick start (local)

### Prerequisites
- Python 3.10+
- Node.js 18+ and Yarn (`npm i -g yarn`)
- MongoDB Community running on `mongodb://localhost:27017`
- A Stripe **test** secret key from https://dashboard.stripe.com/test/apikeys

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate         # on Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env and put your real Stripe key in STRIPE_API_KEY

uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Verify: open <http://localhost:8001/api/health> — should return `{"ok": true, ...}`.

### 2. Frontend
```bash
cd frontend
yarn install

cp .env.example .env

yarn start
```

Opens at <http://localhost:3000>.

### 3. Test the checkout
- Add a game / accessory to the cart.
- Click **Checkout** — you'll be redirected to Stripe.
- Use Stripe's test card: `4242 4242 4242 4242`, any future date, any CVC,
  any postcode.

### 4. (Optional) Stripe webhooks for production
Stripe → Developers → Webhooks → add endpoint
`https://<your-domain>/api/webhook/stripe`. Subscribe to:
- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Copy the signing secret to `STRIPE_WEBHOOK_SECRET` in `backend/.env`.

## Updating the catalog
You have two options.

### Option A — Static (default)
Edit **two** files (the prices on the backend are the source of truth):
- `backend/catalog.py` — server-side prices (used by Stripe).
- `frontend/src/data/content.js` — items shown to the user (titles, images, EN/PL).
The IDs must match (`g-1`, `a-1`, …).

### Option B — Live BaseLinker integration (optional)
The backend ships with a complete **BaseLinker** integration. When the
following three variables are set in `backend/.env`, every successful
Stripe order is pushed to BaseLinker, the catalog can be pulled from
BaseLinker, and stock is validated in real time:

```env
BASELINKER_TOKEN=your_token
BASELINKER_INVENTORY_ID=123
BASELINKER_ORDER_SOURCE_ID=456
```

Get them from BaseLinker:

| Variable | Where in BaseLinker |
|---|---|
| `BASELINKER_TOKEN` | Account → My Account → API |
| `BASELINKER_INVENTORY_ID` | Catalogs → your catalog (the id is in the URL) |
| `BASELINKER_ORDER_SOURCE_ID` | Manage orders → Order sources → create one for the website |

When set, three new endpoints kick in:

| Endpoint | What it does |
|---|---|
| `GET /api/products` | Returns the live BaseLinker catalog (with stock). Falls back to `catalog.py` if BL not configured. |
| `POST /api/checkout/validate-stock` | `{items:[{id,qty}]}` → `{results:[{id,qty_requested,qty_available,ok}]}` |
| (auto) push on paid | When Stripe `payment_status` becomes `paid`, the backend calls BaseLinker `addOrder`. Stored idempotently in `payment_transactions.baselinker_order_id`. |

Leave the variables empty to disable. Everything else keeps working
unchanged — local catalog is used and orders just live in MongoDB.

## Notes / Customization
- **Currency**: change `STORE_CURRENCY` in `backend/.env` (default `pln`).
- **Map**: the Contact section embeds an OpenStreetMap iframe. Replace the
  `bbox` query in `frontend/src/components/Contact.jsx` with your own coords.
- **Branding**: logo text is in `frontend/src/components/Navbar.jsx` and
  `Footer.jsx`. The colour palette lives in `frontend/src/index.css`.
- **Contact info**: phone / email / address are hard-coded in
  `Contact.jsx` and `Footer.jsx`. Search for `+48 ` and `sklep@` to find them.

## License
[MIT](./LICENSE) — feel free to use, modify and resell.

Third-party libraries (React, FastAPI, Tailwind, shadcn/ui, Phosphor Icons,
Stripe SDK) keep their own licenses; check each project for details.
