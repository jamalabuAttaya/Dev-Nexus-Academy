"use client";
/* eslint-disable react-hooks/set-state-in-effect -- hydration-safe localStorage synchronization */

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "ar" | "en";
type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  tr: (arabic: string, english: string) => string;
};

const LanguageContext = createContext<LanguageContextValue>({
  language: "ar",
  setLanguage: () => undefined,
  tr: (arabic) => arabic,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    const saved =
      localStorage.getItem("dev-nexus-language") ??
      localStorage.getItem("codezx-language");
    if (saved === "en" || saved === "ar") setLanguageState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage: (nextLanguage) => {
        setLanguageState(nextLanguage);
        localStorage.setItem("dev-nexus-language", nextLanguage);
      },
      tr: (arabic, english) => (language === "ar" ? arabic : english),
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div
      className={compact ? "language-switch compact" : "language-switch"}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        className={language === "ar" ? "active" : ""}
        onClick={() => setLanguage("ar")}
      >
        ع
      </button>
      <button
        type="button"
        className={language === "en" ? "active" : ""}
        onClick={() => setLanguage("en")}
      >
        EN
      </button>
    </div>
  );
}
