import { useEffect, useState } from "react";
import { List, X, Wrench, Translate, ShoppingCart } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";
import { useCart } from "@/cart/CartContext";

const LINKS = [
  { id: "services", en: "Services", pl: "Usługi" },
  { id: "store", en: "Game Store", pl: "Sklep z grami" },
  { id: "about", en: "About", pl: "O nas" },
  { id: "testimonials", en: "Reviews", pl: "Opinie" },
  { id: "contact", en: "Contact", pl: "Kontakt" },
];

export default function Navbar({ onBook }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang, pick } = useLang();
  const { count: cartCount, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const LangSwitch = ({ testId }) => (
    <div
      data-testid={testId}
      className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[10px] uppercase tracking-[0.22em] font-bold"
      role="group"
      aria-label="Language switcher"
    >
      {["en", "pl"].map((code) => (
        <button
          key={code}
          data-testid={`lang-btn-${code}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          className={`px-2.5 py-1.5 rounded-full transition-all duration-300 ${
            lang === code
              ? "bg-cyan-400 text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-black/60 border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <button
          data-testid="logo-home-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 group"
        >
          <span className="relative w-9 h-9 grid place-items-center rounded-lg bg-black border border-cyan-400/40 group-hover:border-cyan-400 transition">
            <span className="font-display font-black text-cyan-400 text-sm">AS</span>
            <span className="absolute inset-0 rounded-lg blur-md bg-cyan-500/20 group-hover:bg-cyan-500/40 transition -z-10" />
          </span>
          <span className="font-display font-bold tracking-tight text-white text-sm sm:text-base">
            As Game <span className="text-fuchsia-400">&</span> GSM
          </span>
        </button>

        <ul className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                data-testid={`nav-link-${l.id}`}
                onClick={() => goTo(l.id)}
                className="text-xs uppercase tracking-[0.2em] font-bold text-white/70 hover:text-cyan-300 transition-colors duration-300"
              >
                {pick(l.en, l.pl)}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LangSwitch testId="lang-switcher-desktop" />
          </div>

          <button
            data-testid="navbar-cart-btn"
            onClick={() => setCartOpen(true)}
            aria-label={pick("Open cart", "Otwórz koszyk")}
            className="relative grid place-items-center w-10 h-10 rounded-full border border-white/10 text-white hover:border-cyan-400/50 hover:text-cyan-300 transition"
          >
            <ShoppingCart weight="bold" size={18} />
            {cartCount > 0 && (
              <span
                data-testid="navbar-cart-count"
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-fuchsia-500 text-white text-[10px] font-bold"
              >
                {cartCount}
              </span>
            )}
          </button>

          <button
            data-testid="navbar-book-btn"
            onClick={onBook}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.18em] hover:bg-cyan-300 transition-all duration-300 hover:-translate-y-0.5 glow-cyan"
          >
            <Wrench weight="bold" size={16} />
            {pick("Book a Repair", "Zamów naprawę")}
          </button>

          <button
            data-testid="menu-toggle-btn"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid place-items-center w-10 h-10 rounded-md border border-white/10 text-white hover:border-cyan-400/50 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <List size={20} />}
          </button>
        </div>
      </nav>

      <div
        data-testid="mobile-menu"
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        } backdrop-blur-xl bg-black/80 border-b border-white/10`}
      >
        <ul className="px-4 sm:px-8 py-6 space-y-4">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                data-testid={`mobile-nav-link-${l.id}`}
                onClick={() => goTo(l.id)}
                className="w-full text-left text-lg font-display font-semibold text-white/90 hover:text-cyan-300 py-2"
              >
                {pick(l.en, l.pl)}
              </button>
            </li>
          ))}
          <li className="flex items-center gap-3 pt-2">
            <Translate size={16} className="text-white/50" />
            <LangSwitch testId="lang-switcher-mobile" />
          </li>
          <li>
            <button
              data-testid="mobile-book-btn"
              onClick={() => {
                setOpen(false);
                onBook?.();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.18em]"
            >
              <Wrench weight="bold" size={16} />
              {pick("Book a Repair", "Zamów naprawę")}
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}
