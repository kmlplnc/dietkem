import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t, currentLang } = useLanguage();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="/logo/logo3.png" alt="Dietkem Logo" />
              <h3>Dietkem</h3>
            </div>
            <p className="footer-description">
              {currentLang === 'en' 
                ? 'Professional nutrition and diet services for a healthier life.'
                : 'Daha sağlıklı bir yaşam için profesyonel beslenme ve diyet hizmetleri.'
              }
            </p>
          </div>

          <div className="footer-section">
            <h4>{currentLang === 'en' ? 'Services' : 'Hizmetler'}</h4>
            <ul className="footer-links">
              <li><Link to="/calorimatik">{currentLang === 'en' ? 'Calorie Calculator' : 'Kalori Hesaplama'}</Link></li>
              <li><Link to="/recipes">{currentLang === 'en' ? 'Recipes' : 'Tarifler'}</Link></li>
              <li><Link to="/blog">{currentLang === 'en' ? 'Blog' : 'Blog'}</Link></li>
              <li><Link to="/subscription">{currentLang === 'en' ? 'Subscription' : 'Abonelik'}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{currentLang === 'en' ? 'Company' : 'Şirket'}</h4>
            <ul className="footer-links">
              <li><Link to="/hakkimizda">{currentLang === 'en' ? 'About Us' : 'Hakkımızda'}</Link></li>
              <li><Link to="/clinic-info">{currentLang === 'en' ? 'Clinic Info' : 'Klinik Bilgileri'}</Link></li>
              <li><Link to="/dietitian-info">{currentLang === 'en' ? 'Dietitian Info' : 'Diyetisyen Bilgileri'}</Link></li>
              <li><Link to="/client-info">{currentLang === 'en' ? 'Client Info' : 'Danışan Bilgileri'}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{currentLang === 'en' ? 'Legal' : 'Yasal'}</h4>
            <ul className="footer-links">
              <li><Link to="/privacy">{currentLang === 'en' ? 'Privacy Policy' : 'Gizlilik Politikası'}</Link></li>
              <li><Link to="/terms">{currentLang === 'en' ? 'Terms of Use' : 'Kullanım Şartları'}</Link></li>
              <li><Link to="/kvkk">{currentLang === 'en' ? 'KVKK' : 'KVKK'}</Link></li>
              <li><Link to="/cookies">{currentLang === 'en' ? 'Cookies Policy' : 'Çerez Politikası'}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>{currentLang === 'en' ? 'Contact' : 'İletişim'}</h4>
            <div className="contact-info">
              <p>📧 info@dietkem.com</p>
              <p>📞 +90 (212) 555 0123</p>
              <p>📍 {currentLang === 'en' ? 'Istanbul, Turkey' : 'İstanbul, Türkiye'}</p>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 Dietkem. {currentLang === 'en' ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</p>
            <div className="footer-bottom-links">
              <Link to="/privacy-preferences">{currentLang === 'en' ? 'Privacy Preferences' : 'Gizlilik Tercihleri'}</Link>
              <span className="separator">|</span>
              <Link to="/sitemap">{currentLang === 'en' ? 'Sitemap' : 'Site Haritası'}</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #1f2937;
          color: #f9fafb;
          margin-top: auto;
          padding-top: 3rem;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h4 {
          color: #fbbf24;
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          border-bottom: 2px solid #374151;
          padding-bottom: 0.5rem;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .footer-logo img {
          width: 40px;
          height: 40px;
          border-radius: 8px;
        }

        .footer-logo h3 {
          color: #fbbf24;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .footer-description {
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.9rem;
        }

        .footer-links a:hover {
          color: #fbbf24;
        }

        .contact-info p {
          color: #d1d5db;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .social-links a {
          color: #d1d5db;
          font-size: 1.5rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .social-links a:hover {
          color: #fbbf24;
        }

        .footer-bottom {
          border-top: 1px solid #374151;
          padding: 1.5rem 0;
        }

        .footer-bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-bottom p {
          color: #9ca3af;
          margin: 0;
          font-size: 0.9rem;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-bottom-links a {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .footer-bottom-links a:hover {
          color: #fbbf24;
        }

        .separator {
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-bottom-links {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer; 