import { ArrowRight, ShieldCheck, Lightning } from "@phosphor-icons/react";
import { STATS } from "@/data/content";
import { useLang } from "@/i18n/LanguageContext";

const HERO_IMG =
  "https://images.unsplash.com/photo-1763986365305-109ad3ddbf2b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwZ2FtaW5nJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzczMjEyNjV8MA&ixlib=rb-4.1.0&q=85";

export default function Hero({ onBook }) {
  const { pick } = useLang();
  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative pt-28 sm:pt-32 pb-20 sm:pb-28"
    >
      <div aria-hidden className="absolute inset-0 grid-bg opacity-40 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <div className="lg:col-span-7 rise-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/5 text-cyan-300 text-[11px] uppercase tracking-[0.22em] font-bold mb-7">
            <Lightning weight="fill" size={14} />
            {pick(
              "48h Turnaround • 90-day Warranty",
              "Realizacja 48h • 90 dni gwarancji"
            )}
          </div>

          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[76px] leading-[0.95] tracking-tight">
            {pick("Revive Your Gear.", "Odśwież swój sprzęt.")}
            <br />
            <span className="neon-text">
              {pick("Dominate", "Zdominuj")}
            </span>{" "}
            {pick("the Game.", "rozgrywkę.")}
          </h1>

          <p className="mt-6 text-white/70 text-base sm:text-lg max-w-xl leading-relaxed">
            {pick(
              "Expert phone, console, tablet and controller repair — plus a curated catalog of games and console & phone accessories. One place for everything gaming and mobile.",
              "Eksperci od naprawy telefonów, konsol, tabletów i padów — plus starannie dobrany katalog gier oraz akcesoria do konsol i telefonów. Jedno miejsce dla wszystkiego, co gamingowe i mobilne."
            )}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              data-testid="hero-book-btn"
              onClick={onBook}
              className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all duration-300 hover:-translate-y-0.5 glow-cyan"
            >
              {pick("Book a Repair", "Zamów naprawę")}
              <ArrowRight weight="bold" size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              data-testid="hero-store-btn"
              onClick={() => scrollTo("store")}
              className="btn-neon-outline inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
            >
              {pick("Browse Games", "Przeglądaj gry")}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl">
            {STATS.map((s) => (
              <div
                key={s.value}
                data-testid={`hero-stat-${s.value.toLowerCase()}`}
                className="p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur"
              >
                <div className="font-display font-black text-2xl text-white">{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold">
                  {pick(s.label.en, s.label.pl)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative rise-in" style={{ animationDelay: "150ms" }}>
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10">
            <img
              src={HERO_IMG}
              alt={pick("Neon gaming controller", "Neonowy pad gamingowy")}
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10">
                <span className="w-10 h-10 grid place-items-center rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">
                  <ShieldCheck weight="bold" size={20} />
                </span>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-bold">
                    {pick("Certified Technicians", "Certyfikowani technicy")}
                  </div>
                  <div className="text-sm font-semibold">
                    {pick(
                      "Genuine parts, glass-clear repairs.",
                      "Oryginalne części, krystaliczne naprawy."
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 px-3 py-1.5 rounded-full bg-fuchsia-500/90 text-white text-[10px] uppercase tracking-[0.22em] font-bold shadow-xl">
              {pick("Lvl.99 Repair", "Naprawa Lvl.99")}
            </div>
          </div>

          <div className="absolute -inset-3 rounded-3xl border border-cyan-400/20 -z-10" />
        </div>
      </div>
    </section>
  );
}
