import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X, ShoppingCart, Plus, Minus, Trash, ArrowRight } from "@phosphor-icons/react";
import { useCart } from "@/cart/CartContext";
import { useLang } from "@/i18n/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function CartDrawer() {
  const { open, setOpen, detailed, total, count, setQty, remove, clear } = useCart();
  const { pick, fmtPrice } = useLang();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const checkout = async () => {
    if (detailed.length === 0) return;
    setLoading(true);
    try {
      const body = {
        items: detailed.map((i) => ({ id: i.id, qty: i.qty })),
        origin_url: window.location.origin,
      };
      if (email.trim()) body.customer_email = email.trim();
      const { data } = await axios.post(`${API}/checkout/session`, body);
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      toast.error(pick("Could not start checkout. Try again.", "Nie udało się rozpocząć płatności. Spróbuj ponownie."));
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      data-testid="cart-drawer"
      className="fixed inset-0 z-[70] flex justify-end"
      role="dialog"
      aria-modal="true"
    >
      <button
        aria-label="Close cart overlay"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <aside className="relative w-full sm:max-w-md h-full bg-[#0d0d14] border-l border-white/10 flex flex-col">
        <header className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingCart weight="bold" size={18} className="text-cyan-300" />
            <h3 className="font-display font-bold text-white text-lg">
              {pick("Your cart", "Twój koszyk")}
            </h3>
            <span className="ml-1 px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[11px] font-bold">
              {count}
            </span>
          </div>
          <button
            data-testid="cart-close-btn"
            onClick={() => setOpen(false)}
            className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition"
          >
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3" data-testid="cart-items">
          {detailed.length === 0 ? (
            <div data-testid="cart-empty" className="py-16 text-center text-white/60">
              <ShoppingCart size={36} className="mx-auto mb-4 text-white/30" />
              <p>{pick("Your cart is empty.", "Twój koszyk jest pusty.")}</p>
            </div>
          ) : (
            detailed.map((it) => {
              const title = typeof it.product.title === "string"
                ? it.product.title
                : pick(it.product.title.en, it.product.title.pl);
              return (
                <div
                  key={it.id}
                  data-testid={`cart-row-${it.id}`}
                  className="flex gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02]"
                >
                  <img
                    src={it.product.image}
                    alt={title}
                    className="w-16 h-20 rounded-lg object-cover border border-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white line-clamp-2">{title}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">
                      {it.product.platform}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-white/10 overflow-hidden">
                        <button
                          data-testid={`cart-dec-${it.id}`}
                          onClick={() => setQty(it.id, it.qty - 1)}
                          className="w-7 h-7 grid place-items-center text-white/70 hover:bg-white/10"
                          aria-label="decrease"
                        >
                          <Minus size={12} weight="bold" />
                        </button>
                        <span className="px-3 text-sm text-white tabular-nums">{it.qty}</span>
                        <button
                          data-testid={`cart-inc-${it.id}`}
                          onClick={() => setQty(it.id, it.qty + 1)}
                          className="w-7 h-7 grid place-items-center text-white/70 hover:bg-white/10"
                          aria-label="increase"
                        >
                          <Plus size={12} weight="bold" />
                        </button>
                      </div>
                      <div className="font-display font-black text-cyan-300 text-sm">
                        {fmtPrice(it.product.price * it.qty)}
                      </div>
                    </div>
                  </div>
                  <button
                    data-testid={`cart-remove-${it.id}`}
                    onClick={() => remove(it.id)}
                    className="self-start text-white/40 hover:text-rose-300 transition"
                    aria-label="remove"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {detailed.length > 0 && (
          <footer className="p-5 border-t border-white/10 space-y-4">
            <input
              data-testid="cart-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={pick("Email for receipt (optional)", "E-mail do potwierdzenia (opcjonalnie)")}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition"
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.22em] text-white/50 font-bold">
                {pick("Total", "Razem")}
              </span>
              <span data-testid="cart-total" className="font-display font-black text-2xl text-white">
                {fmtPrice(total)}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                data-testid="cart-clear-btn"
                onClick={clear}
                className="px-4 py-3 rounded-full border border-white/10 text-white/70 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/5 transition"
              >
                {pick("Clear", "Wyczyść")}
              </button>
              <button
                data-testid="cart-checkout-btn"
                onClick={checkout}
                disabled={loading}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed glow-cyan"
              >
                {loading ? pick("Starting...", "Chwila...") : pick("Checkout", "Do kasy")}
                <ArrowRight size={14} weight="bold" />
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center">
              {pick(
                "Secure checkout powered by Stripe. You pay in PLN.",
                "Bezpieczna płatność przez Stripe. Płacisz w PLN."
              )}
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}
