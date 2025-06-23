import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const KvkkInfo: React.FC = () => {
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    document.title = currentLang === 'tr' ? "KVKK Aydınlatma Metni | Dietkem" : "KVKK Information | Dietkem";
  }, [currentLang]);

  return (
    <main className="kvkk-main">
      <div className="kvkk-container">
        <h1>{t('kvkk.title')}</h1>
        <p><strong>Dietkem</strong> {t('kvkk.introduction')}</p>
        <section>
          <h2>{t('kvkk.dataController.title')}</h2>
          <p>{t('kvkk.dataController.description')}</p>
        </section>
        <section>
          <h2>{t('kvkk.processingPurposes.title')}</h2>
          <p>{t('kvkk.processingPurposes.description')}</p>
          <ul>
            <li>{t('kvkk.processingPurposes.services')}</li>
            <li>{t('kvkk.processingPurposes.personalization')}</li>
            <li>{t('kvkk.processingPurposes.notifications')}</li>
            <li>{t('kvkk.processingPurposes.improvement')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('kvkk.dataTransfer.title')}</h2>
          <p>{t('kvkk.dataTransfer.description')}</p>
          <ul>
            <li>{t('kvkk.dataTransfer.authorities')}</li>
            <li>{t('kvkk.dataTransfer.providers')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('kvkk.collectionMethods.title')}</h2>
          <ul>
            <li>{t('kvkk.collectionMethods.direct')}</li>
            <li>{t('kvkk.collectionMethods.legalBasis')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('kvkk.rights.title')}</h2>
          <p>{t('kvkk.rights.description')}</p>
          <ul>
            <li>{t('kvkk.rights.learn')}</li>
            <li>{t('kvkk.rights.request')}</li>
            <li>{t('kvkk.rights.purpose')}</li>
            <li>{t('kvkk.rights.transfer')}</li>
            <li>{t('kvkk.rights.correction')}</li>
            <li>{t('kvkk.rights.compensation')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('kvkk.contact.title')}</h2>
          <p>{t('kvkk.contact.description')} <a href="mailto:support@dietkem.com">support@dietkem.com</a></p>
        </section>
      </div>
      <style>{`
        .kvkk-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          padding-top: 100px; /* Navbar'ın altında kalması için */
          margin-bottom: 2rem; /* Footer için boşluk */
          overflow-y: auto;
        }
        .kvkk-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .kvkk-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .kvkk-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .kvkk-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .kvkk-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .kvkk-container li {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0.4rem;
        }
        .kvkk-container a {
          color: #2563eb;
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .kvkk-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .kvkk-container h1 {
            font-size: 1.3rem;
          }
          .kvkk-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default KvkkInfo; 