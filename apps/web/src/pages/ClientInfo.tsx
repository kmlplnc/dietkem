import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const ClientInfo: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('clientInfo.title') + " | Dietkem";
  }, [t]);

  return (
    <main className="client-info-main">
      <div className="client-info-container">
        <h1>{t('clientInfo.title')}</h1>
        <p>{t('clientInfo.description')}</p>
        <hr className="divider" />
        <section>
          <h2>{t('clientInfo.appointmentTracking.title')}</h2>
          <ul>
            {t('clientInfo.appointmentTracking.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clientInfo.dietPlans.title')}</h2>
          <ul>
            {t('clientInfo.dietPlans.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clientInfo.bodyProgress.title')}</h2>
          <ul>
            {t('clientInfo.bodyProgress.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clientInfo.dietitianInteraction.title')}</h2>
          <ul>
            {t('clientInfo.dietitianInteraction.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clientInfo.knowledgeContent.title')}</h2>
          <ul>
            {t('clientInfo.knowledgeContent.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <hr className="divider" />
        <p className="cta">{t('clientInfo.cta')}</p>
      </div>
      <style>{`
        .client-info-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .client-info-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .client-info-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .client-info-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .client-info-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .client-info-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .client-info-container li {
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
          .client-info-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .client-info-container h1 {
            font-size: 1.3rem;
          }
          .client-info-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default ClientInfo; 