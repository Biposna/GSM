import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GAMES, ACCESSORIES } from "@/data/content";

const CartContext = createContext(null);
const STORAGE_KEY = "asgamegsm.cart";

// Build a lookup so the drawer can render rich info from just {id, qty}.
const CATALOG = [...GAMES, ...ACCESSORIES].reduce((acc, it) => {
  acc[it.id] = it;
  return acc;
}, {});

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{id, qty}]
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      if (Array.isArray(saved)) setItems(saved);
    } catch (err) {
      console.warn("CartContext: cannot read saved cart", err);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const add = useCallback((id, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((x) => x.id === id);
      if (existing) {
        return prev.map((x) =>
          x.id === id ? { ...x, qty: Math.min(20, x.qty + qty) } : x
        );
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const setQty = useCallback((id, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((x) => x.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.min(20, qty) } : x))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const detailed = useMemo(
    () =>
      items
        .map((it) => {
          const p = CATALOG[it.id];
          return p ? { ...it, product: p } : null;
        })
        .filter(Boolean),
    [items]
  );

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(
    () => detailed.reduce((s, i) => s + i.product.price * i.qty, 0),
    [detailed]
  );

  return (
    <CartContext.Provider
      value={{ items, detailed, count, total, add, remove, setQty, clear, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
