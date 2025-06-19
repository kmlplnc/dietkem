import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { trpc } from '../../apps/web/src/utils/trpc';

const Navbar = () => {
  const { t, currentLang, changeLanguage } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const { data: currentUser, isLoading, error } = trpc?.users?.getCurrentUser?.useQuery ? trpc.users.getCurrentUser.useQuery(undefined, { enabled: true }) : { data: null, isLoading: false, error: null };

  // Dışarı tıklayınca kapat
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (lang) => {
    changeLanguage(lang);
  };

  console.log('Navbar rendered with language:', currentLang);
  // CLERK_DISABLED_TEMP: console.debug('Navbar user:', user);
  // CLERK_DISABLED_TEMP: console.debug('Navbar isLoaded:', isLoaded);
  console.log("NAVBAR currentUser:", currentUser, "isLoading:", isLoading, "error:", error);
  console.log("TEST: KOK Navbar component rendered!");

  return (
    <nav className="top-bar">
      <div className="container">
        <div className="logo">DietKem</div>
        <div className="nav-right">
          <div className="language-switcher">
            <button
              type="button"
              className={`lang-button ${currentLang === 'tr' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('tr')}
            >
              TR
            </button>
            <button
              type="button"
              className={`lang-button ${currentLang === 'en' ? 'active' : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              EN
            </button>
          </div>
          <div
            className="tools-dropdown-wrapper"
            ref={dropdownRef}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              className="tools-dropdown-btn"
              type="button"
              tabIndex={0}
              onClick={() => setDropdownOpen((open) => !open)}
              style={{ userSelect: 'none' }}
            >
              Araçlar <span style={{ fontSize: '1.1em' }}>▼</span>
            </button>
            {dropdownOpen && (
              <div className="tools-dropdown-menu">
                <a href="/admin/users" className="dropdown-link">Admin Paneli</a>
              </div>
            )}
          </div>
          <button className="dropdown-button" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* CLERK_DISABLED_TEMP: {currentUser?.first_name || user?.firstName || currentUser?.username || user?.username || "Kullanıcı"} */}
            {currentUser?.first_name || currentUser?.username || "Kullanıcı"}
            <img
              src={
                currentUser?.avatar_url && currentUser?.avatar_url !== ""
                  ? currentUser.avatar_url
                  // CLERK_DISABLED_TEMP: : user?.imageUrl && user?.imageUrl !== ""
                  // CLERK_DISABLED_TEMP: ? user.imageUrl
                  : '/default-avatar.png'
              }
              alt="Avatar"
              className="navbar-useravatar"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', marginLeft: 10, border: '2px solid #2563eb', background: '#fff' }}
            />
          </button>
          <div className="auth-links">
            <a href="/login" className="login-link">{t('login')}</a>
            <a href="/signup" className="signup-button">{t('signup')}</a>
          </div>
        </div>
      </div>
      <style>{`
        .navbar-avatar-link {
          margin-left: 1rem;
          display: flex;
          align-items: center;
        }
        .navbar-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #e5e7eb;
        }
        .tools-dropdown-wrapper {
          position: relative;
          display: inline-block;
          margin-left: 1rem;
        }
        .tools-dropdown-btn {
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .tools-dropdown-btn:hover {
          background: #f2f2f2;
        }
        .tools-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 160px;
          background: #fff;
          border-radius: 0.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          z-index: 9999;
          padding: 0.5rem 0;
          display: block;
        }
        .dropdown-link {
          display: block;
          padding: 0.75rem 1.25rem;
          color: #222;
          text-decoration: none;
          font-size: 1rem;
          border-radius: 0.375rem;
          margin: 0 0.5rem;
          transition: all 0.2s ease;
        }
        .dropdown-link:hover {
          background-color: #f3f4f6;
          color: #2563eb;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 