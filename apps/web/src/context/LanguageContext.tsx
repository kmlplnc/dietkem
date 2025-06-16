import React, { createContext, useState, useEffect, useContext } from 'react';
import { tr } from '../translations/tr';
import { en } from '../translations/en';

type Language = 'tr' | 'en';

interface LanguageContextType {
  currentLang: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
  tr,
  en
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    const savedLang = localStorage.getItem('language') as Language;
    return savedLang || 'tr';
  });

  const changeLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value: any = translations[currentLang];
    
    for (const k of keys) {
      if (value && value[k] !== undefined) {
        value = value[k];
      } else {
        console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
        return key;
      }
    }

    if (params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        return str.replace(`{${key}}`, val);
      }, value);
    }

    return value;
  };

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 