import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Hakkimizda = () => {
  const { currentLang, t } = useLanguage();

  React.useEffect(() => {
    document.title = currentLang === 'tr' ? 'Hakkımızda | Dietkem' : 'About Us | Dietkem';
  }, [currentLang]);

  return (
    <main className="about-main">
      <div className="about-container">
        <h1>{t('about.title')}</h1>
        <p><strong>Dietkem</strong>, {t('about.description')}</p>
        <h2>{t('about.mission.title')}</h2>
        <p>{t('about.mission.description')}</p>
        <h2>{t('about.vision.title')}</h2>
        <p>{t('about.vision.description')}</p>
        <h2>{t('about.values.title')}</h2>
        <ul className="about-values">
          {(t('about.values.items', { returnObjects: true }) || []).map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <hr className="about-divider" />
        <p style={{marginTop: 24}}>
          📩 {t('about.contact')} <a href="/iletisim" className="about-link">{t('nav.contact')}</a>
        </p>
      </div>
      <style>{`
        .about-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 60vh;
          padding: 32px 0 48px 0;
          background: #f9fafb;
          padding-top: 64px;
        }
        .about-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 800px;
          width: 100%;
          padding: 32px 24px;
          margin: 0 16px;
        }
        .about-container h1 {
          font-size: 2.2rem;
          font-weight: 700;
          margin-bottom: 1.2rem;
          color: #1a1a1a;
        }
        .about-container h2 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .about-container p {
          font-size: 1.05rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .about-values {
          list-style: none;
          padding: 0;
          margin: 0 0 1.5rem 0;
        }
        .about-values li {
          font-size: 1.08rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .about-divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2.2rem 0 1.2rem 0;
        }
        .about-link {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .about-container {
            padding: 18px 6px;
            border-radius: 8px;
          }
          .about-main {
            padding: 16px 0 32px 0;
          }
          .about-container h1 {
            font-size: 1.4rem;
          }
          .about-container h2 {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </main>
  );
};

export default Hakkimizda; 