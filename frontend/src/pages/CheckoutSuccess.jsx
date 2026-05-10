import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Spinner, XCircle, ArrowRight } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";
import { useCart } from "@/cart/CartContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const MAX_ATTEMPTS = 8;
const POLL_MS = 2000;

export default function CheckoutSuccess() {
  const { pick, fmtPrice } = useLang();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = params.get("session_id");

  const [state, setState] = useState("checking"); // checking | paid | pending_timeout | failed | expired | error
  const [details, setDetails] = useState(null);
  const attemptsRef = useRef(0);
  const clearedRef = useRef(false);
  const { clear } = useCart();

  useEffect(() => {
    let timer;
    const poll = async () => {
      if (!sessionId) {
        setState("error");
        return;
      }
      try {
        const { data } = await axios.get(`${API}/checkout/status/${sessionId}`);
        setDetails(data);
        if (data.payment_status === "paid") {
          setState("paid");
          if (!clearedRef.current) {
            clearedRef.current = true;
            clear();
          }
          return;
        }
        if (data.status === "expired") {
          setState("expired");
          return;
        }
        attemptsRef.current += 1;
        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setState("pending_timeout");
          return;
        }
        timer = setTimeout(poll, POLL_MS);
      } catch (err) {
        console.error(err);
        setState("error");
      }
    };
    poll();
    return () => timer && clearTimeout(timer);
  }, [sessionId, clear]);

  const ICONS = {
    checking: Spinner,
    paid: CheckCircle,
    pending_timeout: Spinner,
    expired: XCircle,
    failed: XCircle,
    error: XCircle,
  };
  const Icon = ICONS[state];

  const COPY = {
    checking: {
      en: "Confirming your payment...",
      pl: "Potwierdzamy Twoją płatność...",
    },
    paid: {
      en: "Payment successful. Thank you!",
      pl: "Płatność zakończona sukcesem. Dziękujemy!",
    },
    pending_timeout: {
      en: "Still processing — we'll email you as soon as it confirms.",
      pl: "Nadal przetwarzamy — wyślemy e-mail gdy tylko się potwierdzi.",
    },
    expired: {
      en: "This checkout session expired. Please try again.",
      pl: "Sesja płatności wygasła. Spróbuj ponownie.",
    },
    failed: {
      en: "Payment failed.",
      pl: "Płatność nieudana.",
    },
    error: {
      en: "We couldn't verify your payment. Contact us if you were charged.",
      pl: "Nie udało się zweryfikować płatności. Skontaktuj się z nami jeśli pobrano opłatę.",
    },
  };

  const tone =
    state === "paid"
      ? "text-emerald-300 border-emerald-400/40 bg-emerald-400/10"
      : state === "checking" || state === "pending_timeout"
      ? "text-cyan-300 border-cyan-400/40 bg-cyan-400/10"
      : "text-rose-300 border-rose-400/40 bg-rose-400/10";

  return (
    <main
      data-testid="checkout-success-page"
      className="min-h-screen bg-[#060608] text-white flex items-center justify-center px-4 py-20"
    >
      <div className="max-w-lg w-full text-center p-8 rounded-3xl border border-white/10 bg-[#0d0d14]">
        <span className={`w-16 h-16 mx-auto grid place-items-center rounded-full border ${tone}`}>
          <Icon weight="duotone" size={32} className={state === "checking" ? "animate-spin" : ""} />
        </span>
        <h1 className="mt-6 font-display font-black text-2xl sm:text-3xl tracking-tight">
          {state === "paid"
            ? pick("Order confirmed.", "Zamówienie potwierdzone.")
            : pick("Checkout", "Płatność")}
        </h1>
        <p data-testid="checkout-status-text" className="mt-3 text-white/70">
          {pick(COPY[state].en, COPY[state].pl)}
        </p>

        {state === "paid" && details && (
          <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/40 text-left">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold mb-3">
              {pick("Order summary", "Podsumowanie")}
            </div>
            <ul className="space-y-2 text-sm">
              {details.items?.map((it) => (
                <li key={it.id} className="flex items-center justify-between gap-3">
                  <span className="text-white/80 truncate">
                    {it.title} <span className="text-white/40">× {it.qty}</span>
                  </span>
                  <span className="text-cyan-300 font-bold">{fmtPrice(it.line_total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold">
                {pick("Total", "Razem")}
              </span>
              <span className="font-display font-black text-xl">
                {fmtPrice(details.amount_total)}
              </span>
            </div>
          </div>
        )}

        <button
          data-testid="checkout-back-btn"
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
