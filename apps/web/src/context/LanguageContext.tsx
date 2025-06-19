import React, { createContext, useState, useEffect, useContext } from 'react';
import { tr } from '../translations/tr';
import { en } from '../translations/en';

type Language = 'tr' | 'en';

interface LanguageContextType {
  currentLang: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | boolean | number>) => string | string[] | any;
}

const translations = {
  tr,
  en
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

  const t = (key: string, params?: Record<string, string | boolean | number>): string | string[] | any => {
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

    // If returnObjects is true, return the value as is
    if (params?.returnObjects) {
      return value;
    }

    // Handle string values with parameters
    if (typeof value === 'string' && params) {
      return Object.entries(params).reduce((str, [key, val]) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return str.replace(new RegExp(`{${key}}`, 'g'), String(val));
        }
        return str;
      }, value);
    }

    // Return the value as is for arrays and other types
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