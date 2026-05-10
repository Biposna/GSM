import { useNavigate } from "react-router-dom";
import { XCircle, ArrowRight } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

export default function CheckoutCancel() {
  const navigate = useNavigate();
  const { pick } = useLang();
  return (
    <main
      data-testid="checkout-cancel-page"
      className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-lg w-full text-center p-8 rounded-3xl border border-white/10 bg-[#0d0d14]">
        <span className="w-16 h-16 mx-auto grid place-items-center rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-300">
          <XCircle weight="duotone" size={32} />
        </span>
        <h1 className="mt-6 font-display font-black text-2xl sm:text-3xl tracking-tight">
          {pick("Checkout cancelled.", "Płatność anulowana.")}
        </h1>
        <p className="mt-3 text-white/70">
          {pick(
            "No worries — your cart is still saved. Try again when you're ready.",
            "Spokojnie — Twój koszyk jest zapisany. Spróbuj ponownie, gdy będziesz gotowy."
          )}
        </p>
        <button
          data-testid="checkout-cancel-back-btn"
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition"
        >
          {pick("Back to shop", "Powrót do sklepu")}
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>
    </main>
  );
}
