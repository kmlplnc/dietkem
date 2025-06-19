import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

const ClinicInfo: React.FC = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = t('clinicInfo.title') + " | Dietkem";
  }, [t]);

  return (
    <main className="clinic-info-main">
      <div className="clinic-info-container">
        <h1>{t('clinicInfo.title')}</h1>
        <p>{t('clinicInfo.description')}</p>
        <hr className="divider" />
        <section>
          <h2>{t('clinicInfo.multiExpertManagement.title')}</h2>
          <ul>
            {t('clinicInfo.multiExpertManagement.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clinicInfo.patientTracking.title')}</h2>
          <ul>
            {t('clinicInfo.patientTracking.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clinicInfo.clinicAnalytics.title')}</h2>
          <ul>
            {t('clinicInfo.clinicAnalytics.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clinicInfo.sharedCalendar.title')}</h2>
          <ul>
            {t('clinicInfo.sharedCalendar.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>{t('clinicInfo.corporateIdentity.title')}</h2>
          <ul>
            {t('clinicInfo.corporateIdentity.items', { returnObjects: true }).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
        <hr className="divider" />
        <p className="cta">{t('clinicInfo.cta')}</p>
      </div>
      <style>{`
        .clinic-info-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 100vh;
          background: #f9fafb;
          padding: 2rem 0;
          overflow-y: auto;
        }
        .clinic-info-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 768px;
          width: 100%;
          padding: 2rem 1.5rem;
          margin: 0 1rem;
        }
        .clinic-info-container h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
          text-align: center;
        }
        .clinic-info-container h2 {
          font-size: 1.15rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.7rem;
          color: #2563eb;
        }
        .clinic-info-container p {
          font-size: 1rem;
          color: #222;
          margin-bottom: 1.1rem;
          line-height: 1.7;
        }
        .clinic-info-container ul {
          margin: 0 0 1.1rem 1.2rem;
          padding: 0;
          list-style: disc inside;
        }
        .clinic-info-container li {
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
          .clinic-info-container {
            padding: 1rem 0.5rem;
            border-radius: 8px;
          }
          .clinic-info-container h1 {
            font-size: 1.3rem;
          }
          .clinic-info-container h2 {
            font-size: 1rem;
          }
        }
      `}</style>
    </main>
  );
};

export default ClinicInfo; 