import React, { createContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import trTranslations from '../locales/tr.json';

// Create context with default value
export const LanguageContext = createContext({
  currentLang: 'tr',
  changeLanguage: () => {},
  t: (key) => key
});

export const LanguageProvider = ({ children }) => {
  // Initialize state with localStorage value or default to 'tr'
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'tr';
  });

  // Translations object
  const translations = {
    en: enTranslations,
    tr: trTranslations
  };

  // Function to change language
  const changeLanguage = (lang) => {
    console.log('Changing language to:', lang);
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key) => {
    try {
      const keys = key.split('.');
      let value = translations[currentLang];
      
      for (const k of keys) {
        if (value && value[k] !== undefined) {
          value = value[k];
        } else {
          console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
          return key;
        }
      }
      
      return value;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  // Update document language when currentLang changes
  useEffect(() => {
    console.log('Language changed to:', currentLang);
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  // Context value
  const value = {
    currentLang,
    changeLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 