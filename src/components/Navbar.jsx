import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const Navbar = () => {
  const { t, currentLang, changeLanguage } = useTranslation();

  const handleLanguageChange = (lang) => {
    console.log('Language button clicked:', lang);
    changeLanguage(lang);
  };

  console.log('Navbar rendered with language:', currentLang);

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
          <div className="auth-links">
            <a href="/login" className="login-link">{t('login')}</a>
            <a href="/signup" className="signup-button">{t('signup')}</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 