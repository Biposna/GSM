import { Wrench } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

export default function FloatingCTA({ onClick }) {
  const { pick } = useLang();
  return (
    <button
      data-testid="floating-book-btn"
      onClick={onClick}
      className="fixed z-40 bottom-5 left-5 sm:left-auto sm:right-5 md:bottom-20 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all duration-300 hover:-translate-y-0.5 pulse-ring"
    >
      <Wrench weight="bold" size={16} />
      <span className="hidden sm:inline">{pick("Book a Repair", "Zamów naprawę")}</span>
      <span className="sm:hidden">{pick("Book", "Zamów")}</span>
    </button>
  );
}
