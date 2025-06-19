import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// CLERK_DISABLED_TEMP: import { useUser } from '@clerk/clerk-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../lib/auth.tsx';

export default function WelcomePage() {
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [visibleChars, setVisibleChars] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [checking, setChecking] = useState(true);
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
  const welcomeText = `${t('welcome.title')}, ${userName || 'Kullanıcı'}!`;

  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (isLoaded && user) {
    // CLERK_DISABLED_TEMP:   // Check if profile is complete
    // CLERK_DISABLED_TEMP:   if (!user.firstName || !user.lastName || !user.username) {
    // CLERK_DISABLED_TEMP:     navigate("/complete-profile");
    // CLERK_DISABLED_TEMP:     return;
    // CLERK_DISABLED_TEMP:   }

      setChecking(false);

      // Start character animation immediately
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= welcomeText.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50);

      // Shorter animation duration
      const textDuration = welcomeText.length * 50;
      const extraWaitTime = 1500; // Increased wait time to 1.5 seconds
      const totalDuration = textDuration + extraWaitTime;

      // Start fade out before navigation
      setTimeout(() => {
        setIsFading(true);
        
        // Navigate after fade out animation
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 600);
      }, totalDuration);

      return () => clearInterval(interval);
    // CLERK_DISABLED_TEMP: }
  }, [welcomeText, navigate]);

  // CLERK_DISABLED_TEMP: if (!isLoaded || !user || checking) {
  if (checking) {
    return <div>{t("welcome.loading") || "Yükleniyor..."}</div>;
  }

  return (
    <div className={`welcome-page ${isFading ? 'fade-out' : ''}`}>
      <div className="welcome-content">
        <h1 className="welcome-typewriter">
          {welcomeText.split('').map((char, index) => (
            <span 
              key={index} 
              className="letter-animation"
              style={{ 
                opacity: index < visibleChars ? 1 : 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: index < visibleChars 
                  ? 'translateY(0) scale(1)' 
                  : 'translateY(6px) scale(0.98)',
                display: 'inline-block',
                animationDelay: `${index * 0.03}s`
              }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      <style>{`
        .welcome-page {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          opacity: 1;
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-page.fade-out {
          opacity: 0;
        }

        .welcome-content {
          text-align: center;
          padding: 0;
          background: transparent;
          transform: translateY(0);
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-page.fade-out .welcome-content {
          transform: translateY(-20px);
        }

        .welcome-typewriter {
          font-size: 3.2rem;
          font-weight: 600;
          color: #0f172a;
          margin: 0;
          line-height: 1.4;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .letter-animation {
          display: inline-block;
          opacity: 0;
          transform: translateY(6px) scale(0.98);
          animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .welcome-typewriter {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-typewriter {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
} 