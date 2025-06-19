import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';

const Navbar = () => {
  // CLERK_DISABLED_TEMP: const { user, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const closeTimeoutRef = useRef(null);
  const { user, isLoggedIn, logout } = useAuth();

  // Kullanıcı rolleri ve abonelik kontrolü (örnek: user.publicMetadata.subscription)
  // CLERK_DISABLED_TEMP: const roles = user?.publicMetadata?.role
  // CLERK_DISABLED_TEMP:   ? Array.isArray(user.publicMetadata.role)
  // CLERK_DISABLED_TEMP:     ? user.publicMetadata.role
  // CLERK_DISABLED_TEMP:     : [user.publicMetadata.role]
  // CLERK_DISABLED_TEMP:   : [];
  // CLERK_DISABLED_TEMP: const isDietitian = isSignedIn && roles.some(r => ['dietitian', 'clinic_admin', 'admin'].includes(r));
  // CLERK_DISABLED_TEMP: const hasSubscription = user?.publicMetadata?.subscription === true;

  // Dropdown mouse enter - açık tut
  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Dropdown mouse leave - delay ile kapat
  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000); // 1 saniye delay
  };

  // Button click - toggle dropdown
  const handleButtonClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Dropdown dışına tıklayınca kapat
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Çıkış
  const handleSignOut = () => {
    // CLERK_DISABLED_TEMP: window.Clerk?.signOut?.();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Sol: Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            <img src="/logo/logo3.png" alt="Dietkem Logo" />
          </Link>
        </div>

        {/* Orta: Menü */}
        <div className={`navbar-center${mobileOpen ? ' open' : ''}`}>
          <Link to="/ai-plan" className="navbar-link navbar-link-highlight">AI Planı</Link>
          <Link to="/calorimatik" className="navbar-link">Kalorimatik</Link>
          <Link to="/recipes" className="navbar-link">Tarifler</Link>
        </div>

        {/* Sağ: Kullanıcı, Panel, Destek */}
        <div className="navbar-right">
          {/* CLERK_DISABLED_TEMP: {isDietitian && hasSubscription && (
            <Link to="/panel" className="navbar-link navbar-link-panel">Diyetisyen Paneli</Link>
          )} */}
          <a href="#" className="navbar-link navbar-link-support" title="Canlı Destek">
            <span className="navbar-support-icon">💬</span> <span className="navbar-support-text">Canlı Destek</span>
          </a>
          {isLoggedIn ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button className="navbar-avatar-btn" onClick={handleButtonClick}>
                <img src={user?.avatar_url || '/logo/logo3.png'} alt="Avatar" className="navbar-avatar" />
                <span className="navbar-username">{user?.firstName || user?.email || 'Kullanıcı'}</span>
              </button>
              {dropdownOpen && (
                <>
                  {/* Invisible bridge to prevent dropdown from closing when mouse moves from button to dropdown */}
                  <div 
                    className="navbar-dropdown-bridge"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  />
                  <div 
                    className="navbar-dropdown"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link to="/profile" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>Profil</Link>
                    <Link to="/subscription" className="navbar-dropdown-item" onClick={() => setDropdownOpen(false)}>Abonelik</Link>
                    <button className="navbar-dropdown-item" onClick={() => { logout(); setDropdownOpen(false); }}>Çıkış Yap</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="navbar-auth">
              <Link to="/sign-in" className="navbar-link">Giriş</Link>
              <Link to="/sign-up" className="navbar-link navbar-link-signup">Kayıt</Link>
            </div>
          )}
          {/* Hamburger */}
          <button className="navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menüyü Aç/Kapat">
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
      </div>
      <style>{`
        .navbar {
          width: 100%;
          background: #fff;
          border-bottom: 1px solid #e5e7eb;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          font-family: 'Inter', Arial, sans-serif;
        }
        .navbar-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1.5rem;
        }
        .navbar-left {
          display: flex;
          align-items: center;
        }
        .navbar-logo img {
          height: 40px;
          width: auto;
          display: block;
        }
        .navbar-center {
          display: flex;
          gap: 2rem;
          align-items: center;
        }
        .navbar-link {
          color: #1a1a1a;
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          transition: background 0.18s, color 0.18s;
          position: relative;
        }
        .navbar-link:hover, .navbar-link:focus {
          background: #f3f4f6;
          text-decoration: underline;
        }
        .navbar-link-highlight {
          border: 2px solid #2563eb;
          background: #f3f7fe;
          color: #2563eb;
        }
        .navbar-link-panel {
          color: #2563eb;
          font-weight: 600;
        }
        .navbar-link-support {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .navbar-support-icon {
          font-size: 1.2em;
        }
        .navbar-right {
          display: flex;
          align-items: stretch;
          gap: 1rem;
          height: 100%;
        }
        .navbar-auth {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem 1.5rem;
          margin: 0 auto;
          height: 100%;
          min-height: 100%;
          flex: 1;
        }
        .navbar-link, .navbar-link-signup {
          display: block;
          width: 100%;
          text-align: center;
          margin: 0 auto;
        }
        .navbar-link-signup {
          background: #2563eb;
          color: #fff;
          font-weight: 600;
        }
        .navbar-link-signup:hover {
          background: #1d4ed8;
        }
        .navbar-hamburger {
          display: none;
          flex-direction: column;
          gap: 4px;
          background: none;
          border: none;
          cursor: pointer;
          margin-left: 1rem;
        }
        .hamburger-bar {
          width: 24px;
          height: 3px;
          background: #1a1a1a;
          border-radius: 2px;
          transition: all 0.2s;
        }
        
        /* Dropdown styles */
        .navbar-user {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .navbar-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.5rem;
          transition: background 0.2s;
        }
        
        .navbar-avatar-btn:hover {
          background: #f3f4f6;
        }
        
        .navbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .navbar-username {
          font-weight: 500;
          color: #1a1a1a;
        }
        
        .navbar-dropdown-bridge {
          position: absolute;
          top: 100%;
          right: 0;
          width: 100%;
          height: 4px;
          background: transparent;
          z-index: 1000;
        }
        
        .navbar-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 160px;
          z-index: 1001;
          animation: dropdownFadeIn 0.2s ease-out;
          /* Dropdown'ın mouse event'lerini yakalaması için */
          pointer-events: auto;
          /* Dropdown ile button arasında boşluk olmaması için */
          margin-top: 0;
          /* Dropdown'ın daha büyük olması için padding */
          padding: 0.5rem 0;
        }
        
        .navbar-dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: #1a1a1a;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background 0.2s;
          /* Daha büyük tıklama alanı */
          min-height: 44px;
          display: flex;
          align-items: center;
        }
        
        .navbar-dropdown-item:hover {
          background: #f3f4f6;
        }
        
        .navbar-dropdown-item:first-child {
          border-radius: 0.5rem 0.5rem 0 0;
        }
        
        .navbar-dropdown-item:last-child {
          border-radius: 0 0 0.5rem 0.5rem;
        }
        
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive */
        @media (max-width: 900px) {
          .navbar-center {
            gap: 1rem;
          }
        }
        @media (max-width: 700px) {
          .navbar-inner {
            padding: 0.5rem 0.5rem;
          }
          .navbar-center {
            position: absolute;
            top: 60px;
            left: 0;
            right: 0;
            background: #fff;
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
            padding: 1rem 0.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            z-index: 1001;
            display: none;
          }
          .navbar-center.open {
            display: flex;
          }
          .navbar-hamburger {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
