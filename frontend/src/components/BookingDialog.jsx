import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { X, Wrench, CheckCircle } from "@phosphor-icons/react";
import { useLang } from "@/i18n/LanguageContext";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const SERVICE_KEYS = [
  { en: "Phone Repair", pl: "Naprawa telefonów" },
  { en: "Console Repair", pl: "Naprawa konsol" },
  { en: "Tablet Repair", pl: "Naprawa tabletów" },
  { en: "Controller Repair", pl: "Naprawa padów" },
  { en: "Deep Cleaning", pl: "Czyszczenie i serwis" },
];

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  device: "",
  service: "",
  issue: "",
  preferred_date: "",
};

export default function BookingDialog({ open, onOpenChange, defaultService }) {
  const { pick } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm((f) => ({ ...EMPTY, service: defaultService || f.service || "" }));
      setSuccess(false);
      setErrors({});
    }
  }, [open, defaultService]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onOpenChange(false);
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const validate = () => {
    const e = {};
    if (form.name.trim().length < 2) e.name = pick("Enter your name", "Podaj imię");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = pick("Enter a valid email", "Podaj poprawny e-mail");
    if (form.phone.trim().length < 5) e.phone = pick("Enter a phone number", "Podaj numer telefonu");
    if (!form.device.trim()) e.device = pick("Specify the device", "Wskaż urządzenie");
    if (!form.service) e.service = pick("Pick a service", "Wybierz usługę");
    if (form.issue.trim().length < 5) e.issue = pick("Describe the issue", "Opisz problem");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/bookings`, form);
      setSuccess(true);
      toast.success(pick("Repair request received!", "Zgłoszenie odebrane!"));
    } catch (err) {
      toast.error(pick("Could not submit. Please try again.", "Nie udało się wysłać. Spróbuj ponownie."));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const input =
    "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 transition";

  return (
    <div data-testid="booking-dialog" className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" aria-modal="true" role="dialog">
      <button aria-label="Close overlay" onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div className="relative w-full sm:max-w-xl mx-auto bg-[#0d0d14] border border-white/10 rounded-t-2xl sm:rounded-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-300 text-[11px] uppercase tracking-[0.22em] font-bold">
              <Wrench weight="bold" size={14} />
              {pick("Book a Repair", "Zamów naprawę")}
            </div>
            <h3 className="mt-3 font-display font-black text-2xl text-white tracking-tight">
              {pick("Tell us what needs ", "Powiedz, co trzeba ")}
              <span className="neon-text">{pick("fixing", "naprawić")}</span>.
            </h3>
          </div>
          <button
            data-testid="booking-close-btn"
            onClick={() => onOpenChange(false)}
            className="w-9 h-9 grid place-items-center rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition"
          >
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div data-testid="booking-success" className="mt-8 py-10 flex flex-col items-center text-center">
            <span className="w-16 h-16 grid place-items-center rounded-full bg-emerald-400/10 border border-emerald-400/40 text-emerald-300 glow-cyan">
              <CheckCircle weight="duotone" size={32} />
            </span>
            <h4 className="mt-5 font-display font-bold text-xl text-white">
              {pick("Request received.", "Zgłoszenie odebrane.")}
            </h4>
            <p className="mt-2 text-white/60 text-sm max-w-sm">
              {pick(
                "A technician will reach out within 24 hours to confirm your appointment and quote.",
                "Technik odezwie się w ciągu 24 godzin, aby potwierdzić termin i wycenę."
              )}
            </p>
            <button
              data-testid="booking-done-btn"
              onClick={() => onOpenChange(false)}
              className="mt-8 px-6 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition"
            >
              {pick("Done", "Gotowe")}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  {pick("Name", "Imię")}
                </label>
                <input
                  data-testid="booking-name-input"
                  className={`${input} mt-2`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={pick("Alex Morgan", "Anna Kowalska")}
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-300">{errors.name}</p>}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  {pick("Phone", "Telefon")}
                </label>
                <input
                  data-testid="booking-phone-input"
                  className={`${input} mt-2`}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+48 123 456 789"
                />
                {errors.phone && <p className="mt-1 text-[11px] text-rose-300">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">E-mail</label>
              <input
                data-testid="booking-email-input"
                type="email"
                className={`${input} mt-2`}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={pick("you@domain.com", "ty@domena.pl")}
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-300">{errors.email}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  {pick("Service", "Usługa")}
                </label>
                <select
                  data-testid="booking-service-select"
                  className={`${input} mt-2`}
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                >
                  <option value="" className="bg-black">
                    {pick("Choose one", "Wybierz")}
                  </option>
                  {SERVICE_KEYS.map((s) => {
                    const label = pick(s.en, s.pl);
                    return (
                      <option key={s.en} value={label} className="bg-black">
                        {label}
                      </option>
                    );
                  })}
                </select>
                {errors.service && <p className="mt-1 text-[11px] text-rose-300">{errors.service}</p>}
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                  {pick("Device", "Urządzenie")}
                </label>
                <input
                  data-testid="booking-device-input"
                  className={`${input} mt-2`}
                  value={form.device}
                  onChange={(e) => setForm({ ...form, device: e.target.value })}
                  placeholder={pick("iPhone 14 Pro, PS5, Switch OLED...", "iPhone 14 Pro, PS5, Switch OLED...")}
                />
                {errors.device && <p className="mt-1 text-[11px] text-rose-300">{errors.device}</p>}
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                {pick("Preferred date", "Preferowana data")}
              </label>
              <input
                data-testid="booking-date-input"
                type="date"
                className={`${input} mt-2`}
                value={form.preferred_date}
                onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
                {pick("What's wrong?", "Co się stało?")}
              </label>
              <textarea
                data-testid="booking-issue-input"
                rows={4}
                className={`${input} mt-2 resize-none`}
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
                placeholder={pick(
                  "Describe the problem in a few sentences...",
                  "Opisz problem w kilku zdaniach..."
                )}
              />
              {errors.issue && <p className="mt-1 text-[11px] text-rose-300">{errors.issue}</p>}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[11px] text-white/40 max-w-xs">
                {pick(
                  "Free diagnostics on every intake. No repair starts without your approval.",
                  "Bezpłatna diagnostyka przy każdym zgłoszeniu. Żadna naprawa nie startuje bez Twojej zgody."
                )}
              </p>
              <button
                data-testid="booking-submit-btn"
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed glow-cyan"
              >
                {submitting ? pick("Submitting...", "Wysyłanie...") : pick("Submit request", "Wyślij zgłoszenie")}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
