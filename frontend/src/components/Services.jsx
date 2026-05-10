import {
  DeviceMobile,
  GameController,
  DeviceTablet,
  Wind,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { SERVICES } from "@/data/content";
import { useLang } from "@/i18n/LanguageContext";

const ICONS = { DeviceMobile, GameController, DeviceTablet, Wind };

const TONE = {
  cyan: {
    border: "hover:border-cyan-400/60",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(0,229,255,0.35)]",
    text: "text-cyan-300",
    chip: "bg-cyan-400/10 border-cyan-400/30 text-cyan-300",
  },
  purple: {
    border: "hover:border-fuchsia-400/60",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(184,41,255,0.4)]",
    text: "text-fuchsia-300",
    chip: "bg-fuchsia-400/10 border-fuchsia-400/30 text-fuchsia-300",
  },
  green: {
    border: "hover:border-emerald-400/60",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(0,255,102,0.35)]",
    text: "text-emerald-300",
    chip: "bg-emerald-400/10 border-emerald-400/30 text-emerald-300",
  },
};

export default function Services({ onBook }) {
  const { pick, fmtPrice } = useLang();

  return (
    <section id="services" data-testid="services-section" className="relative py-20 sm:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-4">
              {pick("/01 — Services", "/01 — Usługi")}
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-2xl">
              {pick("Repairs that feel like an ", "Naprawy, które wydają się ")}
              <span className="neon-text">{pick("upgrade", "upgrade'em")}</span>.
            </h2>
          </div>
          <p className="text-white/60 max-w-md text-base leading-relaxed">
            {pick(
              "Transparent pricing, certified technicians, genuine parts. Every repair ships with a 90-day warranty.",
              "Przejrzyste ceny, certyfikowani technicy, oryginalne części. Każda naprawa z 90-dniową gwarancją."
            )}
          </p>
        </div>

        <div className="grid md:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-5">
          {SERVICES.map((s, idx) => {
            const Icon = ICONS[s.icon] ?? GameController;
            const tone = TONE[s.tone] ?? TONE.cyan;
            return (
              <article
                key={s.id}
                data-testid={`service-card-${s.id}`}
                className={`relative group rounded-2xl border border-white/10 bg-[#0d0d14] p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1 ${tone.border} ${tone.glow} ${s.span ?? ""}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {s.image && (
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-20 group-hover:opacity-35 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(6,6,8,0.3) 0%, rgba(6,6,8,0.95) 85%), url(${s.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`w-12 h-12 grid place-items-center rounded-xl border ${tone.chip}`}>
                      <Icon weight="duotone" size={24} />
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold">
                      {pick(s.tag.en, s.tag.pl)}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white tracking-tight">
                    {pick(s.title.en, s.title.pl)}
                  </h3>
                  <p className="mt-2 text-white/60 text-sm leading-relaxed max-w-md">
                    {pick(s.blurb.en, s.blurb.pl)}
                  </p>

                  <div className="mt-auto pt-6 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold">
                        {pick("Starting at", "Od")}
                      </div>
                      <div className={`font-display font-black text-2xl ${tone.text}`}>
                        {fmtPrice(s.from)}
                      </div>
                    </div>
                    <button
                      data-testid={`service-book-${s.id}`}
                      onClick={() => onBook?.(pick(s.title.en, s.title.pl))}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 hover:border-white/30 transition"
                    >
                      {pick("Book", "Zamów")}
                      <ArrowUpRight weight="bold" size={14} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
