import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function WelcomePage() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [visibleChars, setVisibleChars] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const welcomeText = `Hoş geldiniz, ${user?.firstName || ''} ${user?.lastName || ''}.`;

  useEffect(() => {
    if (isLoaded && user) {
      // Start character animation immediately
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= welcomeText.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 50); // Slightly slower for smoother animation

      // Shorter animation duration
      const textDuration = welcomeText.length * 50;
      const extraWaitTime = 800; // Slightly longer wait time
      const totalDuration = textDuration + extraWaitTime;

      // Start fade out before navigation
      setTimeout(() => {
        setIsFading(true);
        
        // Navigate after fade out animation
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 600); // Fade out duration
      }, totalDuration);

      return () => clearInterval(interval);
    }
  }, [isLoaded, user, welcomeText, navigate]);

  if (!isLoaded || !user) {
    return null;
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