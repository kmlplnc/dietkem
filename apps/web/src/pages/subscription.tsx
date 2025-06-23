import React, { useState } from "react";
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../lib/auth';
import { trpc } from '../utils/trpc';

interface Plan {
  duration: string;
  type: string;
  price: number;
  labelKey?: string;
  freeMonth?: boolean;
}

const basePlans: Plan[] = [
  { duration: '1m', type: 'monthly', price: 179 },
  { duration: '3m', type: 'quarterly', price: 479, labelKey: 'popular' },
  { duration: '6m', type: 'semiAnnual', price: 849 },
  { duration: '12m', type: 'annual', price: 1499, labelKey: 'bestValue' },
];

function formatDate(dateStr: string | null | undefined, locale = 'tr-TR') {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

const SubscriptionPage = () => {
  const { user } = useAuth();
  const [toast, setToast] = useState("");
  const { t, currentLang } = useLanguage();

  // Get subscription info from backend
  const { data: subscriptionInfo, refetch: refetchSubscriptionInfo } = trpc.users.getSubscriptionInfo.useQuery();

  // Start free month mutation
  const startFreeMonthMutation = trpc.users.startFreeMonth.useMutation({
    onSuccess: (data) => {
      setToast(currentLang === 'en' ? 'Free month started!' : '1 Ay Ücretsiz Başladı!');
      setTimeout(() => setToast(""), 2500);
      refetchSubscriptionInfo();
    },
    onError: (error) => {
      setToast(error.message || (currentLang === 'en' ? 'Failed to start free month' : 'Ücretsiz ay başlatılamadı'));
      setTimeout(() => setToast(""), 2500);
    }
  });

  const getLabel = (labelKey: string | undefined) => {
    if (!labelKey) return null;
    const labels: Record<string, string> = {
      popular: '⭐ ' + (currentLang === 'en' ? 'Most Popular' : 'En Popüler'),
      bestValue: '🏆 ' + (currentLang === 'en' ? 'Best Value' : 'En Avantajlı'),
    };
    return labels[labelKey];
  };

  const handleSubscribe = async (plan: Plan) => {
    // If first month is free and this is the monthly plan
    if (plan.duration === '1m' && subscriptionInfo?.canGetFreeMonth) {
      startFreeMonthMutation.mutate();
      return;
    }
    
    // Handle regular subscription (placeholder for now)
    setToast(t('subscription.toastMessages.subscribed'));
    setTimeout(() => setToast(""), 2500);
  };

  // Prepare plans, override 1m plan if eligible for free month
  const plans = basePlans.map(plan => {
    if (plan.duration === '1m' && subscriptionInfo?.canGetFreeMonth) {
      return {
        ...plan,
        price: 0,
        freeMonth: true,
      };
    }
    return plan;
  });

  // Show active subscription status
  const showActiveSubscription = subscriptionInfo?.subscription_status === 'active' && subscriptionInfo?.subscription_end_date;

  return (
    <main className="subscription-main fade-in">
      <div className="subscription-container">
        <h1 className="slide-fade-in">{t('subscription.title')}</h1>
        
        {/* Show active subscription status */}
        {showActiveSubscription && (
          <div className="subscription-active abonelik-kart slide-fade-in delay-300" style={{marginBottom: 32}}>
            <span>🎁 {currentLang === 'en' ? 'Active Subscription' : 'Aktif Aboneliğiniz'}</span>
            <br />
            <span>{currentLang === 'en' ? 'End Date' : 'Bitiş Tarihi'}: {formatDate(subscriptionInfo?.subscription_end_date, currentLang === 'en' ? 'en-US' : 'tr-TR')}</span>
          </div>
        )}
        
        <div className="subscription-cards">
          {plans.map((plan, index) => (
            <div
              className={`subscription-card${plan.labelKey ? ' has-label' : ''}${plan.freeMonth ? ' trial-card' : ''} scale-in delay-${(index + 1) * 100}`}
              key={plan.duration}
            >
              {plan.labelKey && <div className="plan-label">{getLabel(plan.labelKey)}</div>}
              <div className="plan-title">{t(`subscription.plans.${plan.type}.title`)}</div>
              <div className="plan-price">
                {plan.freeMonth
                  ? (currentLang === 'en' ? 'Free' : 'Ücretsiz')
                  : (() => {
                      try {
                        const priceText = t(`subscription.plans.${plan.type}.price`, { price: plan.price });
                        if (priceText === `subscription.plans.${plan.type}.price` || priceText.includes('{price}')) {
                          return `₺${plan.price}`;
                        }
                        return priceText;
                      } catch (error) {
                        return `₺${plan.price}`;
                      }
                    })()}
              </div>
              <ul className="plan-features">
                {(t('subscription.features', { returnObjects: true }) || []).map((feature: string, idx: number) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button
                className="plan-btn"
                onClick={() => handleSubscribe(plan)}
                disabled={startFreeMonthMutation.isLoading}
              >
                {startFreeMonthMutation.isLoading && plan.freeMonth
                  ? (currentLang === 'en' ? 'Starting...' : 'Başlatılıyor...')
                  : plan.freeMonth
                    ? (currentLang === 'en' ? 'Start 1 Month Free' : '1 Ay Ücretsiz Başlat')
                    : t('subscription.subscribe')}
              </button>
            </div>
          ))}
        </div>
        <div className="subscription-extras slide-fade-in delay-500">
          <div className="secure-pay">
            <span role="img" aria-label="Secure payment">🔒</span> {t('subscription.securePayment')}
          </div>
          <div className="guarantee">{t('subscription.satisfactionGuarantee')}</div>
        </div>
        {toast && <div className="subscription-toast">{toast}</div>}
      </div>
      <style>{`
        .subscription-main {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          min-height: 60vh;
          background: #f9fafb;
          padding-top: 100px;
        }
        .subscription-container {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          max-width: 900px;
          width: 100%;
          padding: 32px 24px;
          margin: 0 16px;
          margin-bottom: 2rem;
        }
        .subscription-cards {
          display: flex;
          gap: 2rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .subscription-card {
          background: #f3f7fe;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(37,99,235,0.07);
          padding: 2.5rem 2rem 2rem 2rem;
          min-width: 180px;
          max-width: 220px;
          flex: 1 1 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
          position: relative;
          transition: transform 0.18s cubic-bezier(.4,0,.2,1), box-shadow 0.18s;
        }
        .subscription-card.has-label {
          padding-top: 3rem;
        }
        .subscription-card:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .trial-card {
          background: #e0f7fa;
          border: 2px dashed #22c55e;
        }
        .plan-label {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 6px;
          padding: 4px 12px;
          white-space: nowrap;
        }
        .plan-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          text-align: center;
        }
        .plan-price {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 1.5rem;
        }
        .plan-features {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
          text-align: center;
        }
        .plan-features li {
          margin-bottom: 0.75rem;
          color: #4b5563;
          font-size: 0.95rem;
        }
        .plan-features li:before {
          content: "✓";
          color: #22c55e;
          margin-right: 0.5rem;
          font-weight: bold;
        }
        .plan-btn {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          width: 100%;
        }
        .plan-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .plan-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .subscription-extras {
          margin-top: 3rem;
          text-align: center;
          color: #6b7280;
        }
        .secure-pay {
          margin-bottom: 0.5rem;
        }
        .subscription-toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          background: #2563eb;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          animation: fadeInUp 0.3s ease-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 1rem);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .subscription-active {
          background: #f0fdf4;
          border: 2px solid #22c55e;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          color: #166534;
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .subscription-cards {
            gap: 1rem;
          }
          .subscription-card {
            min-width: 100%;
          }
        }
      `}</style>
    </main>
  );
};

export default SubscriptionPage; 