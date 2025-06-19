import React from "react";
import { useCookieConsent } from "../context/CookieConsentContext";

const BUTTON_SIZE = 56; // px, matches Tawk.to widget size

const FloatingSettingsButton = () => {
  const { openModal, t } = useCookieConsent();
  const [show, setShow] = React.useState(false);
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    setShow(!!hasConsent);
  }, []);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        right: 24,
        zIndex: 2100,
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={openModal}
        aria-label={t.settings}
        style={{
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          background: '#fff',
          border: '1.5px solid #2563eb',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 0.2s, background 0.2s, transform 0.3s',
          animation: 'fadeInFloatingBtn 0.7s cubic-bezier(0.4,0,0.2,1)',
          outline: 'none',
          position: 'relative',
        }}
        className="floating-settings-gear"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'transform 0.4s' }}
          className="gear-svg"
        >
          <circle cx="12" cy="12" r="3.5" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.09a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.09a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        {/* Tooltip */}
        <span
          style={{
            position: 'absolute',
            bottom: BUTTON_SIZE + 10,
            left: '50%',
            transform: 'translateX(-60%)',
            background: '#222',
            color: '#fff',
            padding: '6px 14px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            opacity: hover ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.13)',
            zIndex: 2200,
          }}
        >
          {t.settings}
        </span>
        <style>{`
          @keyframes fadeInFloatingBtn {
            from { opacity: 0; transform: translateY(30px) scale(0.8); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .floating-settings-gear:hover {
            box-shadow: 0 4px 16px rgba(37,99,235,0.18);
            background: #f3f6fd;
          }
          .floating-settings-gear:hover .gear-svg {
            transform: rotate(60deg);
          }
        `}</style>
      </button>
    </div>
  );
};

export default FloatingSettingsButton; 