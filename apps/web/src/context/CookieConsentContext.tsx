import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLanguage } from "./LanguageContext";

const defaultConsent = { tawk: false, analytics: false };

interface Consent {
  tawk: boolean;
  analytics: boolean;
}

interface CookieConsentContextType {
  consent: Consent;
  setConsent: (consent: Consent) => void;
  updateConsent: (newConsent: Partial<Consent>) => void;
  modalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  acceptAll: () => void;
  t: {
    barText: string;
    acceptAll: string;
    manage: string;
    modalTitle: string;
    required: string;
    tawk: string;
    analytics: string;
    save: string;
    cancel: string;
    settings: string;
  };
}

const translations = {
  tr: {
    barText: "Sitemiz çerez kullanmaktadır. Gizlilik tercihlerinizi belirleyebilirsiniz.",
    acceptAll: "Tümünü Kabul Et",
    manage: "Tercihleri Yönet",
    modalTitle: "Gizlilik Tercihleri",
    required: "Zorunlu çerezler (her zaman etkin)",
    tawk: "Canlı Destek (Tawk.to)",
    analytics: "İstatistik / Analiz",
    save: "Kaydet",
    cancel: "İptal",
    settings: "Gizlilik Tercihleri"
  },
  en: {
    barText: "Our site uses cookies. You can set your privacy preferences.",
    acceptAll: "Accept All",
    manage: "Manage Preferences",
    modalTitle: "Privacy Preferences",
    required: "Required cookies (always enabled)",
    tawk: "Live Support (Tawk.to)",
    analytics: "Analytics & Statistics",
    save: "Save",
    cancel: "Cancel",
    settings: "Privacy Preferences"
  }
};

const CookieConsentContext = createContext<CookieConsentContextType | null>(null);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export const CookieConsentProvider = ({ children }: CookieConsentProviderProps) => {
  const { currentLang } = useLanguage();
  const [consent, setConsent] = useState<Consent>(() => {
    try {
      const stored = localStorage.getItem('cookieConsent');
      return stored ? JSON.parse(stored) : defaultConsent;
    } catch {
      return defaultConsent;
    }
  });
  // Modal is open if no consent in localStorage
  const [modalOpen, setModalOpen] = useState(() => !localStorage.getItem('cookieConsent'));
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem('cookieConsent', JSON.stringify(consent));
      window.dispatchEvent(new Event('cookieConsentChanged'));
    }
  }, [consent, initialized]);

  useEffect(() => {
    setInitialized(true);
  }, []);

  const acceptAll = () => {
    setConsent({ tawk: true, analytics: true });
    setModalOpen(false);
  };
  
  const updateConsent = (newConsent: Partial<Consent>) => {
    setConsent(c => ({ ...c, ...newConsent }));
    setModalOpen(false);
  };
  
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const t = translations[currentLang as keyof typeof translations] || translations.tr;

  return (
    <CookieConsentContext.Provider value={{ consent, setConsent, updateConsent, modalOpen, openModal, closeModal, acceptAll, t }}>
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}; 