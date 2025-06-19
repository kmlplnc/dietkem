import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useCookieConsent } from "../context/CookieConsentContext";

const TAWK_SRC = "https://embed.tawk.to/6852e96a562852190e9a0493/1iu1tviie";

// Declare global Tawk_API
declare global {
  interface Window {
    Tawk_API?: any;
  }
}

const TawkToWidget = () => {
  const { consent, t } = useCookieConsent();
  const location = useLocation();
  const isPublic = !/^\/(admin|dashboard|dietitian)/.test(location.pathname);
  const enabled = consent.tawk && isPublic;
  const currentLang = t ? 'tr' : 'en'; // Fallback language

  useEffect(() => {
    if (!enabled) {
      // Remove Tawk.to script if present
      const existing = document.querySelector('script[src^="https://embed.tawk.to/"]');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      // Remove widget iframe if present
      const tawkIframe = document.querySelector('iframe[src^="https://embed.tawk.to/"]');
      if (tawkIframe && tawkIframe.parentNode) {
        tawkIframe.parentNode.removeChild(tawkIframe);
      }
      window.Tawk_API = undefined;
      return;
    }
    // If already loaded, do nothing
    if (window.Tawk_API) return;
    // Add Tawk.to script
    const s1 = document.createElement("script");
    s1.async = true;
    s1.src = TAWK_SRC;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    if (currentLang) {
      s1.setAttribute("data-language", currentLang);
    }
    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    }
    window.Tawk_API = window.Tawk_API || {};
    s1.onload = () => {
      if (window.Tawk_API && currentLang) {
        try {
          // Check if setLanguage method exists before calling it
          if (typeof window.Tawk_API.setLanguage === 'function') {
            window.Tawk_API.setLanguage(currentLang);
          } else {
            console.warn('Tawk_API.setLanguage is not available');
          }
        } catch (e) {
          console.warn('Failed to set Tawk language:', e);
        }
      }
    };
    return () => {
      // Remove script and widget on unmount
      const existing = document.querySelector('script[src^="https://embed.tawk.to/"]');
      if (existing && existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      const tawkIframe = document.querySelector('iframe[src^="https://embed.tawk.to/"]');
      if (tawkIframe && tawkIframe.parentNode) {
        tawkIframe.parentNode.removeChild(tawkIframe);
      }
      window.Tawk_API = undefined;
    };
  }, [enabled, currentLang, location.pathname]);

  return null;
};

export default TawkToWidget; 