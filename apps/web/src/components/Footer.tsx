import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="footer-wide">
      <div className="footer-main">
        <div className="footer-col logo-col">
          <Link to="/" className="footer-logo-link">
            <img src="/logo/logo3.png" alt="Dietkem Logo" className="footer-logo" />
          </Link>
          <div className="footer-socials">
            {/*
            <a href="https://instagram.com/dietkem" target="_blank" rel="noopener" aria-label="Instagram" className="footer-social-icon">
              <svg width="22" height="22" fill="none" stroke="#1a1a1a" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2"/></svg>
            </a>
            <a href="https://linkedin.com/company/dietkem" target="_blank" rel="noopener" aria-label="LinkedIn" className="footer-social-icon">
              <svg width="22" height="22" fill="none" stroke="#1a1a1a" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 10v7"/><path d="M7 7v.01"/><path d="M12 10v7"/><path d="M12 14a2 2 0 1 1 4 0v3"/></svg>
            </a>
            */}
          </div>
        </div>
        <div className="footer-col">
          <div className="footer-title">{t('footer.corporate')}</div>
          <ul>
            <li><Link to="/hakkimizda">{t('footer.about')}</Link></li>
            <li><Link to="/contact">{t('footer.contact')}</Link></li>
            <li><Link to="/privacy">{t('footer.privacy')}</Link></li>
            <li><Link to="/terms">{t('footer.terms')}</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-title">{t('footer.apps')}</div>
          <ul>
            <li><a href="#">{t('footer.iosAndroid')}</a></li>
            <li><a href="#">{t('footer.desktop')}</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <div className="footer-title">{t('footer.usageAreas')}</div>
          <ul>
            <li><Link to="/dietitian-info">{t('footer.dietitians')}</Link></li>
            <li><Link to="/client-info">{t('footer.clients')}</Link></li>
            <li><Link to="/clinic-info">{t('footer.clinics')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-left">
          <span className="footer-copyright">© 2025 Dietkem. {t('footer.rights')}</span>
        </div>
        <div className="footer-bottom-links">
          <Link to="/cookies">{t('footer.cookies')}</Link>
          <Link to="/kvkk">{t('footer.kvkk')}</Link>
          <Link to="/privacy-preferences">{t('footer.privacyPrefs')}</Link>
        </div>
      </div>
      <style>{`
        .footer-wide {
          background: #fff;
          color: #1a1a1a;
          padding: 40px 0 0 0;
          font-family: inherit;
          border-top: 1px solid #ececec;
        }
        .footer-main {
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 48px;
          padding: 0 32px 32px 32px;
        }
        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .footer-title {
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 0.7rem;
          letter-spacing: -0.01em;
        }
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .footer-col li {
          font-size: 14px;
        }
        .footer-col a, .footer-col a:visited {
          color: #1a1a1a;
          text-decoration: none;
          transition: text-decoration 0.2s, color 0.2s;
        }
        .footer-col a:hover {
          text-decoration: underline;
          color: #2563eb;
        }
        .logo-col {
          gap: 1.2rem;
        }
        .footer-logo-link {
          display: inline-block;
        }
        .footer-logo {
          width: 120px;
          height: auto;
          margin-bottom: 0.5rem;
        }
        .footer-socials {
          display: flex;
          gap: 16px;
          margin-top: 0.5rem;
        }
        .footer-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f5f5f5;
          transition: background 0.2s;
        }
        .footer-social-icon:hover {
          background: #e5e7eb;
        }
        .footer-bottom {
          border-top: 1px solid #ececec;
          padding: 24px 32px 32px 32px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          max-width: 1280px;
          margin: 0 auto;
          font-size: 13px;
          color: #6b6b6b;
        }
        .footer-bottom-left {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .footer-bottom-links {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
        }
        .footer-bottom-links a {
          color: #6b6b6b;
          text-decoration: none;
          font-size: 13px;
          transition: text-decoration 0.2s, color 0.2s;
        }
        .footer-bottom-links a:hover {
          text-decoration: underline;
          color: #2563eb;
        }
        @media (max-width: 1024px) {
          .footer-main {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 32px;
          }
        }
        @media (max-width: 700px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
        }
        @media (max-width: 500px) {
          .footer-main {
            grid-template-columns: 1fr;
            gap: 18px;
            padding: 0 10px 18px 10px;
          }
          .footer-bottom {
            padding: 18px 10px 18px 10px;
            flex-direction: column;
            gap: 0.7rem;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 