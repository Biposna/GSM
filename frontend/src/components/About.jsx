import { ShieldCheck, Medal, Sparkle, HandCoins } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: { en: "90-day warranty", pl: "90 dni gwarancji" },
    desc: {
      en: "Every repair is covered. We stand behind our work or we make it right.",
      pl: "Każda naprawa jest objęta gwarancją. Jeśli coś pójdzie nie tak — poprawiamy.",
    },
  },
  {
    icon: Medal,
    title: { en: "Certified techs", pl: "Certyfikowani technicy" },
    desc: {
      en: "Board-level trained technicians with thousands of successful repairs.",
      pl: "Technicy przeszkoleni w naprawach płyt głównych, z tysiącami udanych realizacji.",
    },
  },
  {
    icon: Sparkle,
    title: { en: "Genuine parts", pl: "Oryginalne części" },
    desc: {
      en: "OEM-grade screens, batteries and components. No compromise.",
      pl: "Ekrany, baterie i podzespoły klasy OEM. Żadnych kompromisów.",
    },
  },
  {
    icon: HandCoins,
    title: { en: "Fair pricing", pl: "Uczciwe ceny" },
    desc: {
      en: "No-surprise quotes. You approve every cost before we start.",
      pl: "Wyceny bez niespodzianek. Akceptujesz każdy koszt przed startem.",
    },
  },
];

export default function About() {
  const { pick } = useLang();
  return (
    <section id="about" data-testid="about-section" className="relative py-20 sm:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-emerald-300 font-bold mb-4">
            {pick("/03 — About", "/03 — O nas")}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            {pick("Built by gamers.", "Stworzone przez graczy.")}
            <br />
            <span className="neon-text">
              {pick("Trusted by thousands.", "Zaufało nam tysiące.")}
            </span>
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed max-w-xl">
            {pick(
              "As Game & GSM started as a corner shop with a soldering iron and a stack of broken consoles. Six years later, we're the city's go-to destination for fast, honest repairs and a curated selection of games — run by people who actually play them.",
              "As Game & GSM zaczynało jako lokalny punkt z lutownicą i stosem zepsutych konsol. Sześć lat później jesteśmy adresem numer jeden w mieście do szybkich, uczciwych napraw i starannie dobranych gier — prowadzonym przez ludzi, którzy naprawdę w nie grają."
            )}
          </p>

          <div className="mt-8 inline-flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex -space-x-2">
              {["A", "V", "M"].map((c, i) => (
                <span
                  key={c}
                  className={`w-9 h-9 grid place-items-center rounded-full text-black font-display font-black text-sm border-2 border-black ${
                    ["bg-cyan-400", "bg-fuchsia-400", "bg-emerald-400"][i]
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/50 font-bold">
                {pick("Rated 4.9 / 5", "Ocena 4.9 / 5")}
              </div>
              <div className="text-sm text-white">
                {pick("across 1,400+ local reviews", "na podstawie 1 400+ lokalnych opinii")}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title.en}
                data-testid={`about-pillar-${idx}`}
                className="p-6 rounded-2xl border border-white/10 bg-[#0d0d14] hover:border-cyan-400/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="w-11 h-11 grid place-items-center rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                  <Icon weight="duotone" size={22} />
                </span>
                <h3 className="mt-5 font-display font-bold text-lg text-white">
                  {pick(p.title.en, p.title.pl)}
                </h3>
                <p className="mt-2 text-sm text-white/60 leading-relaxed">
                  {pick(p.desc.en, p.desc.pl)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
