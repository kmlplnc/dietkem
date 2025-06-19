import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const PrivacyPreferences: React.FC = () => {
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    document.title = currentLang === 'tr' ? "Gizlilik Tercihleri | Dietkem" : "Privacy Preferences | Dietkem";
  }, [currentLang]);

  return (
    <main className="privacy-preferences-main">
      <div className="privacy-preferences-container">
        <h1>{t('privacyPreferences.title')}</h1>
        <p>{t('privacyPreferences.description')}</p>
        <section>
          <h2>{t('privacyPreferences.necessaryCookies.title')}</h2>
          <p>{t('privacyPreferences.necessaryCookies.description')}</p>
          <div className="cookie-status">
            <span>{t('privacyPreferences.necessaryCookies.status')}</span>
          </div>
        </section>
        <section>
          <h2>{t('privacyPreferences.analyticsCookies.title')}</h2>
          <p>{t('privacyPreferences.analyticsCookies.description')}</p>
          <div className="cookie-option">
            <input type="checkbox" id="analytics" />
            <label htmlFor="analytics">{t('privacyPreferences.analyticsCookies.accept')}</label>
          </div>
        </section>
        <section>
          <h2>{t('privacyPreferences.targetingCookies.title')}</h2>
          <p>{t('privacyPreferences.targetingCookies.description')}</p>
          <div className="cookie-option">
            <input type="checkbox" id="targeting" />
            <label htmlFor="targeting">{t('privacyPreferences.targetingCookies.accept')}</label>
          </div>
        </section>
        <section>
          <h2>{t('privacyPreferences.personalData.title')}</h2>
          <p>{t('privacyPreferences.personalData.description')}</p>
          <div className="cookie-option">
            <input type="checkbox" id="personal-data" />
            <label htmlFor="personal-data">{t('privacyPreferences.personalData.accept')}</label>
          </div>
          <div className="cookie-option">
            <input type="checkbox" id="reject-personal-data" />
            <label htmlFor="reject-personal-data">{t('privacyPreferences.personalData.reject')}</label>
          </div>
        </section>
        <section>
          <h2>{t('privacyPreferences.liveSupport.title')}</h2>
          <p>{t('privacyPreferences.liveSupport.description')}</p>
          <div className="cookie-option">
            <input
              type="checkbox"
              id="tawkConsent"
              checked={typeof window !== 'undefined' ? localStorage.getItem('tawkConsent') === 'true' : false}
              onChange={e => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('tawkConsent', e.target.checked.toString());
                  window.dispatchEvent(new Event('tawkConsentChanged'));
                }
              }}
            />
            <label htmlFor="tawkConsent">{t('privacyPreferences.liveSupport.accept')}</label>
          </div>
        </section>
        <section className="actions">
          <button className="btn-save">{t('privacyPreferences.actions.save')}</button>
          <button className="btn-reset">{t('privacyPreferences.actions.reset')}</button>
        </section>
        <p className="privacy-link">
          📌 {t('privacyPreferences.privacyLink.text')} <a href={currentLang === 'tr' ? "./gizlilik-politikasi" : "./privacy-policy"}>{t('privacyPreferences.privacyLink.link')}</a>.
        </p>
      </div>
      <style>{`
        .privacy-preferences-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .privacy-preferences-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .privacy-preferences-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .privacy-preferences-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
          transition: border-color 0.2s ease;
        }
        .privacy-preferences-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .cookie-status {
          margin: 1rem 0;
          font-weight: 500;
          background: #f0f9ff;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          border-left: 4px solid #2563eb;
          color: #1e40af;
        }
        .cookie-option {
          margin: 0.5rem 0;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background-color 0.2s ease;
        }
        .cookie-option:hover {
          background-color: #f8fafc;
        }
        .cookie-option input[type="checkbox"] {
          margin-right: 0.5rem;
          cursor: pointer;
        }
        .cookie-option label {
          cursor: pointer;
          transition: color 0.2s ease;
        }
        .cookie-option:hover label {
          color: #2563eb;
        }
        .actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }
        .btn-save, .btn-reset {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-save {
          background: #2563eb;
          color: white;
        }
        .btn-save:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        .btn-reset {
          background: #e5e7eb;
          color: #1a1a1a;
        }
        .btn-reset:hover {
          background: #d1d5db;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .privacy-link {
          margin-top: 2rem;
          text-align: center;
        }
        .privacy-link a {
          color: #2563eb;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        .privacy-link a:hover {
          color: #1d4ed8;
        }
        .privacy-preferences-container section {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .privacy-preferences-container section:hover {
          background-color: #f8fafc;
          border-color: #e5e7eb;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        .privacy-preferences-container section:hover h2 {
          border-bottom-color: #2563eb;
        }
        @media (max-width: 600px) {
          .privacy-preferences-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .privacy-preferences-container h1 {
            font-size: 1.3rem;
          }
          .privacy-preferences-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default PrivacyPreferences; 