import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const PrivacyPolicy: React.FC = () => {
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    document.title = currentLang === 'tr' ? "Gizlilik Politikası | Dietkem" : "Privacy Policy | Dietkem";
  }, [currentLang]);

  return (
    <main className="privacy-policy-main">
      <div className="privacy-policy-container">
        <h1>{t('privacy.title')}</h1>
        <section>
          <h2>{t('privacy.introduction.title')}</h2>
          <p>{t('privacy.introduction.description')}</p>
        </section>
        <section>
          <h2>{t('privacy.dataCollection.title')}</h2>
          <p><strong>{t('privacy.dataCollection.registration')}</strong></p>
          <ul>
            <li>{t('privacy.dataCollection.registrationItems')}</li>
          </ul>
          <p><strong>{t('privacy.dataCollection.usage')}</strong></p>
          <ul>
            <li>{t('privacy.dataCollection.usageItems')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('privacy.dataUsage.title')}</h2>
          <ul>
            <li>{t('privacy.dataUsage.aiPlans')}</li>
            <li>{t('privacy.dataUsage.personalization')}</li>
            <li>{t('privacy.dataUsage.improvement')}</li>
            <li>{t('privacy.dataUsage.analysis')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('privacy.cookies.title')}</h2>
          <ul>
            <li>{t('privacy.cookies.performance')}</li>
            <li>{t('privacy.cookies.preferences')}</li>
          </ul>
          <p>{t('privacy.cookies.blocking')}</p>
        </section>
        <section>
          <h2>{t('privacy.dataSharing.title')}</h2>
          <p>{t('privacy.dataSharing.description')}</p>
          <ul>
            <li>{t('privacy.dataSharing.legal')}</li>
            <li>{t('privacy.dataSharing.providers')}</li>
            <li>{t('privacy.dataSharing.consent')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('privacy.dataRetention.title')}</h2>
          <ul>
            <li>{t('privacy.dataRetention.active')}</li>
            <li>{t('privacy.dataRetention.deletion')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('privacy.dataSecurity.title')}</h2>
          <ul>
            <li>{t('privacy.dataSecurity.encryption')}</li>
            <li>{t('privacy.dataSecurity.protection')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('privacy.userRights.title')}</h2>
          <ul>
            <li>{t('privacy.userRights.information')}</li>
            <li>{t('privacy.userRights.correction')}</li>
            <li>{t('privacy.userRights.portability')}</li>
            <li>{t('privacy.userRights.withdrawal')}</li>
          </ul>
          <p>{t('privacy.userRights.contact')}</p>
        </section>
        <section>
          <h2>{t('privacy.contact.title')}</h2>
          <p>{t('privacy.contact.description')}</p>
          <ul>
            <li>📧 support@dietkem.com</li>
            <li>📍 {t('privacy.contact.address')}</li>
          </ul>
        </section>
      </div>
      <style>{`
        .privacy-policy-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .privacy-policy-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .privacy-policy-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .privacy-policy-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .privacy-policy-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .privacy-policy-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .privacy-policy-container li {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0.4rem;
        }
        @media (max-width: 600px) {
          .privacy-policy-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .privacy-policy-container h1 {
            font-size: 1.3rem;
          }
          .privacy-policy-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default PrivacyPolicy; 