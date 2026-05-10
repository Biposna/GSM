import { Star, Quotes } from "@phosphor-icons/react";
import { TESTIMONIALS } from "@/data/content";
import { useLang } from "@/i18n/LanguageContext";

export default function Testimonials() {
  const { pick } = useLang();
  return (
    <section
      id="testimonials"
      data-testid="testimonials-section"
      className="relative py-20 sm:py-28 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mb-12">
          <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-300 font-bold mb-4">
            {pick("/04 — Reviews", "/04 — Opinie")}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight max-w-3xl">
            {pick("What the ", "Co mówi ")}
            <span className="neon-text">{pick("community", "społeczność")}</span>
            {pick(" says.", ".")}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={t.id}
              data-testid={`testimonial-${t.id}`}
              className="relative p-6 rounded-2xl border border-white/10 bg-[#0d0d14] hover:border-fuchsia-400/40 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Quotes weight="fill" size={28} className="text-fuchsia-400/70 absolute top-5 right-5" />
              <div className="flex gap-1 text-cyan-300">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star key={k} weight="fill" size={14} />
                ))}
              </div>
              <blockquote className="mt-4 text-white/80 text-sm leading-relaxed">
                "{pick(t.text.en, t.text.pl)}"
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-white/10">
                <div className="font-display font-bold text-white text-sm">{t.name}</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mt-1">
                  {pick(t.role.en, t.role.pl)}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
