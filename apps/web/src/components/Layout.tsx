import React from "react";
import RealNavbar from "./RealNavbar.tsx";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";
import { CookieConsentProvider } from "../context/CookieConsentContext";
import CookieConsentBar from "./CookieConsentBar";
import CookieConsentModal from "./CookieConsentModal";
import FloatingSettingsButton from "./FloatingSettingsButton";
import TawkToWidget from "./TawkToWidget";
import { useLanguage } from "../context/LanguageContext";

const NAVBAR_HEIGHT = 64; // px

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { currentLang } = useLanguage();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Determine if current route is public
  const isPublic = !/^\/(admin|dashboard|dietitian)/.test(location.pathname);
  
  // Check if current route is dietitian panel
  const isDietitianPanel = location.pathname === '/dietitian-panel';
  
  return (
    <CookieConsentProvider>
      {!isDietitianPanel && <RealNavbar />}
      {(location.pathname === '/' || location.pathname === '/abonelikler' || location.pathname === '/subscription') && !isDietitianPanel && <TawkToWidget />}
      <CookieConsentBar />
      <CookieConsentModal />
      <FloatingSettingsButton />
      <div style={{ 
        paddingTop: isDietitianPanel ? 0 : NAVBAR_HEIGHT, 
        minHeight: "100vh", 
        display: "flex", 
        flexDirection: "column" 
      }}>
        <main style={{ flex: 1 }}>{children}</main>
        {!isDietitianPanel && <Footer />}
      </div>
    </CookieConsentProvider>
  );
};

export default Layout;
export { NAVBAR_HEIGHT }; 