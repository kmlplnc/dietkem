import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const CookiesPolicy: React.FC = () => {
  const { t, currentLang } = useLanguage();

  useEffect(() => {
    document.title = currentLang === 'tr' ? "Çerez Politikası | Dietkem" : "Cookie Policy | Dietkem";
  }, [currentLang]);

  return (
    <main className="cookies-main">
      <div className="cookies-container">
        <h1>{t('cookies.title')}</h1>
        <section>
          <h2>{t('cookies.introduction')}</h2>
        </section>
        <section>
          <h2>{t('cookies.whatAre.title')}</h2>
          <p>{t('cookies.whatAre.description')}</p>
        </section>
        <section>
          <h2>{t('cookies.types.title')}</h2>
          <ul>
            <li><strong>{t('cookies.types.necessary.title')}:</strong> {t('cookies.types.necessary.description')}</li>
            <li><strong>{t('cookies.types.statistical.title')}:</strong> {t('cookies.types.statistical.description')}</li>
            <li><strong>{t('cookies.types.marketing.title')}:</strong> {t('cookies.types.marketing.description')}</li>
            <li><strong>{t('cookies.types.functional.title')}:</strong> {t('cookies.types.functional.description')}</li>
          </ul>
        </section>
        <section>
          <h2>{t('cookies.settings.title')}</h2>
          <p>{t('cookies.settings.description')}</p>
        </section>
        <section>
          <h2>{t('cookies.moreInfo.title')}</h2>
          <p>{t('cookies.moreInfo.description')} <a href="mailto:support@dietkem.com">support@dietkem.com</a></p>
        </section>
      </div>
      <style>{`
        .cookies-main {
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
        .cookies-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .cookies-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .cookies-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .cookies-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .cookies-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .cookies-container li {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0.4rem;
        }
        .cookies-container a {
          color: #2563eb;
          text-decoration: underline;
        }
        @media (max-width: 600px) {
          .cookies-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .cookies-container h1 {
            font-size: 1.3rem;
          }
          .cookies-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default CookiesPolicy; 