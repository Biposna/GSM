import { createContext, useContext, useEffect, useState, useCallback } from "react";

const LanguageContext = createContext(null);

const STORAGE_KEY = "asgamegsm.lang";

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pl") setLangState(saved);
  }, []);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch (err) {
      console.warn("LanguageContext: cannot persist language preference", err);
    }
  }, []);

  const toggle = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "en" ? "pl" : "en";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (err) {
        console.warn("LanguageContext: cannot persist language preference", err);
      }
      return next;
    });
  }, []);

  // Price formatter — always PLN (zł), but swaps decimal separator per locale.
  const fmtPrice = useCallback(
    (value) => {
      const num = Number(value);
      const fixed = Number.isInteger(num) ? num.toString() : num.toFixed(2);
      const formatted = lang === "pl" ? fixed.replace(".", ",") : fixed;
      return `${formatted} zł`;
    },
    [lang]
  );

  // Pick the right string from a {en, pl} pair.
  const pick = useCallback(
    (enText, plText) => (lang === "pl" ? plText : enText),
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, pick, fmtPrice }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
