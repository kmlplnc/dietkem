import React from "react";
import RealNavbar from "./RealNavbar.tsx";
import { useLocation } from "react-router-dom";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Check if current route is dietitian panel
  const isDietitianPanel = location.pathname === '/dietitian-panel';
  
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column" 
    }}>
      {!isDietitianPanel && <RealNavbar />}
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

export default Layout; 