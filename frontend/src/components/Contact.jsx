import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Envelope, Phone, MapPin, PaperPlaneRight } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Contact() {
  const { pick } = useLang();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = pick("Enter your name", "Podaj imię");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = pick("Enter a valid email", "Podaj poprawny e-mail");
    if (form.message.trim().length < 5)
      e.message = pick("Message is too short", "Wiadomość jest za krótka");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/contact`, form);
      toast.success(
        pick(
          "Message sent — we'll reply within 24 hours.",
          "Wiadomość wysłana — odpowiemy w 24 godziny."
        )
      );
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error(pick("Could not send. Please try again.", "Nie udało się wysłać. Spróbuj ponownie."));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition";

  return (
    <section id="contact" data-testid="contact-section" className="relative py-20 sm:py-28 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="text-[11px] uppercase tracking-[0.28em] text-fuchsia-300 font-bold mb-4">
            {pick("/05 — Contact", "/05 — Kontakt")}
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight">
            {pick("Let's ", "Naprawmy ")}
            <span className="neon-text">{pick("fix it", "to")}</span>
            {pick(" together.", " razem.")}
          </h2>
          <p className="mt-6 text-white/70 leading-relaxed max-w-md">
            {pick(
              "Drop a message, call us or swing by the shop. We usually answer within an hour during business hours.",
              "Napisz, zadzwoń albo wpadnij do sklepu. W godzinach pracy odpowiadamy zwykle w ciągu godziny."
            )}
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-4" data-testid="contact-phone">
              <span className="w-11 h-11 grid place-items-center rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300">
                <Phone weight="duotone" size={20} />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold">
                  {pick("Phone", "Telefon")}
                </div>
                <a href="tel:+48000000000" className="text-white hover:text-cyan-300 transition">
                  +48 000 000 000
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4" data-testid="contact-email">
              <span className="w-11 h-11 grid place-items-center rounded-xl bg-fuchsia-400/10 border border-fuchsia-400/30 text-fuchsia-300">
                <Envelope weight="duotone" size={20} />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold">E-mail</div>
                <a href="mailto:info@example.com" className="text-white hover:text-fuchsia-300 transition">
                  info@example.com
                </a>
              </div>
            </li>
            <li className="flex items-center gap-4" data-testid="contact-address">
              <span className="w-11 h-11 grid place-items-center rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300">
                <MapPin weight="duotone" size={20} />
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold">
                  {pick("Store", "Sklep")}
                </div>
                <div className="text-white">
                  {pick(
                    "ul. Przykładowa 1, 00-000 Warszawa",
                    "ul. Przykładowa 1, 00-000 Warszawa"
                  )}
                </div>
              </div>
            </li>
          </ul>

          <div data-testid="contact-map" className="mt-8 rounded-2xl overflow-hidden border border-white/10 relative aspect-[16/10]">
            <iframe
              title={pick("Store location", "Lokalizacja sklepu")}
              src="https://www.openstreetmap.org/export/embed.html?bbox=17.0700%2C51.1380%2C17.1100%2C51.1620&layer=mapnik&marker=51.1500%2C17.0900"
              className="w-full h-full grayscale contrast-125 brightness-75"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-cyan-400/10" />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          data-testid="contact-form"
          className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0d0d14]"
          noValidate
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-2">
                {pick("Your name", "Imię")}
              </label>
              <input
                data-testid="contact-name-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={input}
                placeholder={pick("Alex Morgan", "Anna Kowalska")}
              />
              {errors.name && <p className="mt-1 text-[11px] text-rose-300">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-2">E-mail</label>
              <input
                data-testid="contact-email-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={input}
                placeholder={pick("you@domain.com", "ty@domena.pl")}
                type="email"
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-300">{errors.email}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-2">
                {pick("Subject", "Temat")}
              </label>
              <input
                data-testid="contact-subject-input"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className={input}
                placeholder={pick("What's it about?", "O czym piszesz?")}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase tracking-[0.22em] text-white/50 font-bold mb-2">
                {pick("Message", "Wiadomość")}
              </label>
              <textarea
                data-testid="contact-message-input"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                className={`${input} resize-none`}
                placeholder={pick("Tell us what's going on...", "Opisz, co się dzieje...")}
              />
              {errors.message && <p className="mt-1 text-[11px] text-rose-300">{errors.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between flex-wrap gap-4">
            <p className="text-[11px] text-white/40 max-w-sm">
              {pick(
                "By submitting, you agree to our privacy terms. We never share your info.",
                "Wysyłając formularz akceptujesz naszą politykę prywatności. Nie udostępniamy danych."
              )}
            </p>
            <button
              data-testid="contact-submit-btn"
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed glow-cyan"
            >
              {submitting ? pick("Sending...", "Wysyłanie...") : pick("Send message", "Wyślij wiadomość")}
              <PaperPlaneRight weight="bold" size={14} />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
