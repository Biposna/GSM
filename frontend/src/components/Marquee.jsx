import { BRANDS } from "@/data/content";

export default function Marquee() {
  const strip = [...BRANDS, ...BRANDS];
  return (
    <section
      data-testid="marquee-section"
      className="relative border-y border-white/10 bg-black/40 overflow-hidden"
    >
      <div className="no-scrollbar overflow-hidden">
        <div className="marquee-track flex gap-14 py-6 whitespace-nowrap">
          {strip.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white/10"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                color: "transparent",
              }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
