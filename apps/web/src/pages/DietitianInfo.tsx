import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const DietitianInfo: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('dietitianInfo.title') + " | Dietkem";
  }, [t]);

  return (
    <main className="dietitian-info-main">
      <div className="dietitian-info-container">
        <h1>{t('dietitianInfo.title')}</h1>
        <p>{t('dietitianInfo.description')}</p>
        <hr className="divider" />
        <section>
          <h2>{t('dietitianInfo.clientManagement.title')}</h2>
          <ul>
            {t('dietitianInfo.clientManagement.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('dietitianInfo.appointmentTracking.title')}</h2>
          <ul>
            {t('dietitianInfo.appointmentTracking.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('dietitianInfo.dietPlanning.title')}</h2>
          <ul>
            {t('dietitianInfo.dietPlanning.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('dietitianInfo.progressTracking.title')}</h2>
          <ul>
            {t('dietitianInfo.progressTracking.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('dietitianInfo.notesCommunication.title')}</h2>
          <ul>
            {t('dietitianInfo.notesCommunication.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <hr className="divider" />
        <p className="cta">{t('dietitianInfo.cta')}</p>
      </div>
      <style>{`
        .dietitian-info-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .dietitian-info-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .dietitian-info-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .dietitian-info-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .dietitian-info-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .dietitian-info-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .dietitian-info-container li {
          font-size: 1rem;
          color: #222;
          margin-bottom: 0.4rem;
        }
        .divider {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
        .cta {
          text-align: center;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .dietitian-info-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .dietitian-info-container h1 {
            font-size: 1.3rem;
          }
          .dietitian-info-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default DietitianInfo; 