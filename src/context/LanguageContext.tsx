import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translations } from '../constants/translations';

type Language = 'en' | 'ta';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)['ta'];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ta');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved === 'ta' || saved === 'en') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
