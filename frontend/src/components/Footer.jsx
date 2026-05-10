import { InstagramLogo, TiktokLogo, DiscordLogo, YoutubeLogo } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

const NAV = [
  { id: "services", en: "Services", pl: "Usługi" },
  { id: "store", en: "Game Store", pl: "Sklep z grami" },
  { id: "about", en: "About", pl: "O nas" },
  { id: "testimonials", en: "Reviews", pl: "Opinie" },
  { id: "contact", en: "Contact", pl: "Kontakt" },
];

const SOCIALS = [
  { Icon: InstagramLogo, label: "Instagram", href: "#" },
  { Icon: TiktokLogo, label: "TikTok", href: "#" },
  { Icon: DiscordLogo, label: "Discord", href: "#" },
  { Icon: YoutubeLogo, label: "YouTube", href: "#" },
];

export default function Footer() {
  const { pick } = useLang();
  const year = new Date().getFullYear();
  return (
    <footer data-testid="site-footer" className="relative pt-20 pb-10 border-t border-white/10 bg-[#08080b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="relative w-10 h-10 grid place-items-center rounded-lg bg-black border border-cyan-400/40">
                <span className="font-display font-black text-cyan-400 text-sm">AS</span>
              </span>
              <span className="font-display font-bold text-lg">
                As Game <span className="text-fuchsia-400">&</span> GSM
              </span>
            </div>
            <p className="mt-5 text-white/55 text-sm leading-relaxed max-w-sm">
              {pick(
                "Tech repair, games and console & phone accessories for players who refuse to lose. Genuine parts, certified techs, 90-day warranty.",
                "Serwis, gry oraz akcesoria do konsol i telefonów dla graczy, którzy nie uznają porażki. Oryginalne części, certyfikowani technicy, 90 dni gwarancji."
              )}
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  data-testid={`footer-social-${label.toLowerCase()}`}
                  aria-label={label}
                  className="w-10 h-10 grid place-items-center rounded-full border border-white/10 text-white/70 hover:text-cyan-300 hover:border-cyan-400/50 transition"
                >
                  <Icon weight="bold" size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-bold mb-4">
              {pick("Navigate", "Nawigacja")}
            </div>
            <ul className="space-y-2">
              {NAV.map((n) => (
                <li key={n.id}>
                  <button
                    data-testid={`footer-nav-${n.id}`}
                    onClick={() =>
                      document.getElementById(n.id)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-white/70 hover:text-cyan-300 transition text-sm"
                  >
                    {pick(n.en, n.pl)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <div className="text-[11px] uppercase tracking-[0.25em] text-white/40 font-bold mb-4">
              {pick("Store", "Sklep")}
            </div>
            <ul className="space-y-2 text-sm text-white/70">
              <li>{pick("ul. Litewska 16u-E, 51-354 Wrocław", "ul. Litewska 16u-E, 51-354 Wrocław")}</li>
              <li>
                <a href="tel:+48515703292" className="hover:text-cyan-300">+48 515 703 292</a>
              </li>
              <li>
                <a href="mailto:sklep@asgamegsm.pl" className="hover:text-fuchsia-300">sklep@asgamegsm.pl</a>
              </li>
              <li>{pick("Mon – Sat · 10:00 – 20:00", "Pon – Sob · 10:00 – 20:00")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p data-testid="footer-copy">
            {pick(
              `© ${year} As Game & GSM — All rights reserved.`,
              `© ${year} As Game & GSM — Wszelkie prawa zastrzeżone.`
            )}
          </p>
          <p className="font-mono">
            {pick("Powered by coffee, solder & co-op mode.", "Napędzane kawą, cyną i trybem co-op.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
