"""Server-side source of truth for product prices.

Prices MUST live on the server; we never trust amounts sent by the client
(see Stripe integration playbook). Frontend catalog is a display mirror only.
"""

# Currency is PLN (zł). Prices are in zł (floats).

GAMES = [
    {"id": "g-1", "title": "Cyber Runner 2099", "platform": "PS5", "price": 249.99},
    {"id": "g-2", "title": "Neon Drift Legacy", "platform": "Xbox Series X", "price": 199.99},
    {"id": "g-3", "title": "Pixel Warriors Remix", "platform": "Nintendo Switch", "price": 159.99},
    {"id": "g-4", "title": "Shadow Protocol VII", "platform": "PS5", "price": 279.99},
    {"id": "g-5", "title": "Arcade Infinity", "platform": "PS4", "price": 99.99},
    {"id": "g-6", "title": "Orbital Siege", "platform": "Xbox Series S", "price": 139.99},
    {"id": "g-7", "title": "Dreamfall: Awaken", "platform": "Nintendo Switch", "price": 179.99},
    {"id": "g-8", "title": "Helix Prime", "platform": "PS5", "price": 229.99},
]

ACCESSORIES = [
    {"id": "a-1", "title": "DualSense Wireless Controller", "platform": "PS5", "price": 299.99},
    {"id": "a-2", "title": "Xbox Wireless Controller — Carbon Black", "platform": "Xbox", "price": 259.99},
    {"id": "a-3", "title": "Pro Gaming Headset 7.1", "platform": "Multi", "price": 449.00},
    {"id": "a-4", "title": "iPhone USB-C 30W Fast Charger", "platform": "iPhone", "price": 129.00},
    {"id": "a-5", "title": "Braided USB-C Cable 2m", "platform": "Multi", "price": 49.00},
    {"id": "a-6", "title": "Switch OLED Carry Case", "platform": "Switch", "price": 89.00},
    {"id": "a-7", "title": "Samsung Galaxy Tempered Glass", "platform": "Samsung", "price": 39.00},
    {"id": "a-8", "title": "PS5 HD Camera", "platform": "PS5", "price": 269.00},
    {"id": "a-9", "title": "MagSafe Wireless Charger 15W", "platform": "iPhone", "price": 199.00},
    {"id": "a-10", "title": "20000 mAh Fast Power Bank", "platform": "Multi", "price": 159.00},
    {"id": "a-11", "title": "iPhone 15 Silicone Case (MagSafe)", "platform": "iPhone", "price": 89.00},
    {"id": "a-12", "title": "USB-C to Lightning Cable 1m", "platform": "iPhone", "price": 69.00},
    {"id": "a-13", "title": "Magnetic Car Mount", "platform": "Multi", "price": 79.00},
    {"id": "a-14", "title": "Wireless Earbuds Pro ANC", "platform": "Multi", "price": 299.00},
]

CATALOG = {item["id"]: item for item in [*GAMES, *ACCESSORIES]}


def get_item(item_id: str):
    return CATALOG.get(item_id)
