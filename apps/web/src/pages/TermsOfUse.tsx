import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const TermsOfUse: React.FC = () => {
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    document.title = currentLang === 'tr' ? "Kullanım Koşulları | Dietkem" : "Terms of Use | Dietkem";
  }, [currentLang]);

  return (
    <main className="terms-main">
      <div className="terms-container">
        <h1>{t('terms.title')}</h1>
        <p style={{textAlign: 'center', color: '#6b7280', fontSize: '0.98rem', marginBottom: '1.5rem'}}>{t('terms.effectiveDate')}</p>
        <p>{t('terms.introduction')}</p>
        <section>
          <h2>{t('terms.acceptance.title')}</h2>
          <p>{t('terms.acceptance.description')}</p>
        </section>
        <section>
          <h2>{t('terms.serviceDefinition.title')}</h2>
          <p>{t('terms.serviceDefinition.description')}</p>
          <ul>
            <li>{t('terms.serviceDefinition.features.healthData')}</li>
            <li>{t('terms.serviceDefinition.features.aiPlans')}</li>
            <li>{t('terms.serviceDefinition.features.blog')}</li>
            <li>{t('terms.serviceDefinition.features.consultation')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('terms.userObligations.title')}</h2>
          <ul>
            <li>{t('terms.userObligations.accuracy')}</li>
            <li>{t('terms.userObligations.privacy')}</li>
            <li>{t('terms.userObligations.illegal')}</li>
            <li>{t('terms.userObligations.medicalAdvice')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('terms.membership.title')}</h2>
          <ul>
            <li>{t('terms.membership.registration')}</li>
            <li>{t('terms.membership.password')}</li>
            <li>{t('terms.membership.abuse')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('terms.intellectualProperty.title')}</h2>
          <p>{t('terms.intellectualProperty.description')}</p>
        </section>
        <section>
          <h2>{t('terms.serviceChanges.title')}</h2>
          <p>{t('terms.serviceChanges.description')}</p>
          <ul>
            <li>{t('terms.serviceChanges.updates')}</li>
            <li>{t('terms.serviceChanges.discontinuation')}</li>
            <li>{t('terms.serviceChanges.modifications')}</li>
          </ul>
          <p>{t('terms.serviceChanges.effective')}</p>
        </section>
        <section>
          <h2>{t('terms.disclaimer.title')}</h2>
          <p>{t('terms.disclaimer.description')}</p>
        </section>
        <section>
          <h2>{t('terms.subscription.title')}</h2>
          <p>{t('terms.subscription.description')}</p>
        </section>
        <section>
          <h2>{t('terms.cancellation.title')}</h2>
          <p>{t('terms.cancellation.description')}</p>
        </section>
        <section>
          <h2>{t('terms.contact.title')}</h2>
          <p>{t('terms.contact.description')}</p>
          <ul>
            <li>📧 support@dietkem.com</li>
            <li>📍 {t('terms.contact.address')}</li>
          </ul>
        </section>
      </div>
      <style>{`
        .terms-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .terms-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .terms-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .terms-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .terms-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .terms-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .terms-container li {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0.4rem;
        }
        @media (max-width: 600px) {
          .terms-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .terms-container h1 {
            font-size: 1.3rem;
          }
          .terms-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default TermsOfUse; 