import { useState, useEffect, useRef } from 'react';
import { SignIn } from "@clerk/clerk-react";
import { useSearchParams } from "react-router-dom";

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [typedText, setTypedText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const welcomeText = "Merhaba, hoş geldiniz.";
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChars(prev => {
        if (prev >= welcomeText.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const textDuration = welcomeText.length * 80;
    const extraWaitTime = 1000;
    const totalDuration = textDuration + extraWaitTime;

    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowForm(true), 100);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && (
        <div className="welcome-overlay">
          <h1 className="welcome-typewriter">
            {welcomeText.split('').map((char, index) => (
              <span 
                key={index} 
                style={{ 
                  opacity: index < visibleChars ? 1 : 0,
                  transition: 'opacity 0.1s ease-in'
                }}
              >
                {char}
              </span>
            ))}
          </h1>
        </div>
      )}
      <div className="sign-in-bg">
        <div className={`sign-in-card minimal single-col sign-in-fade ${showForm ? 'show' : ''}`}>
          <h1 className="sign-in-title">Hoş Geldiniz</h1>
          <SignIn
            appearance={{
              elements: {
                card: "p-0 shadow-none bg-transparent",
                formButtonPrimary:
                  "bg-black hover:bg-gray-800 text-white py-3 px-4 rounded-lg text-sm font-medium w-full transition-all duration-200",
                formFieldInput:
                  "w-full rounded-lg border-gray-200 text-sm focus:border-black focus:ring-black bg-white",
                formFieldLabel: "text-sm text-gray-700 font-medium",
                footer: "hidden",
                formField: "mb-4",
                formFieldAction: "text-black hover:text-gray-800",
                identityPreviewEditButton: "text-black hover:text-gray-800",
                identityPreviewText: "text-gray-700",
                otpCodeFieldInput: "rounded-lg border-gray-200 focus:border-black focus:ring-black",
                socialButtonsBlockButton: "rounded-lg border-gray-200 hover:bg-gray-50",
                socialButtonsBlockButtonText: "text-gray-700",
                socialButtonsBlockButtonArrow: "text-gray-700",
                socialButtonsBlockButtonIcon: "text-gray-700",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                formFieldInputShowPasswordButton: "text-gray-500 hover:text-gray-700",
                formFieldInputShowPasswordIcon: "text-gray-500",
                formFieldInputShowPasswordIconActive: "text-black",
                formFieldInputShowPasswordIconInactive: "text-gray-500",
                formFieldInputShowPasswordButtonActive: "text-black hover:text-gray-800",
                formFieldInputShowPasswordButtonInactive: "text-gray-500 hover:text-gray-700",
              },
              variables: {
                colorPrimary: "#000000",
                colorText: "#000000",
                colorTextSecondary: "#666666",
                colorBackground: "#FFFFFF",
                colorInputBackground: "#FFFFFF",
                colorInputText: "#000000",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl={searchParams.get('after_sign_in_url') || '/dashboard'}
            afterSignUpUrl={searchParams.get('after_sign_up_url') || '/dashboard'}
            redirectUrl={searchParams.get('redirect_url') || '/sign-in'}
          />
        </div>
      </div>
      <style>{`
        .welcome-overlay {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          opacity: 1;
          animation: fadeInOut 3.2s cubic-bezier(0.4,0,0.2,1) forwards;
          animation-delay: 0s;
        }
        .welcome-typewriter {
          font-size: 2.5rem;
          font-weight: bold;
          color: #000;
          text-align: center;
          font-family: 'Noto Sans', 'Inter', system-ui, -apple-system, sans-serif;
          letter-spacing: 0.5px;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        .letter-animation {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.3s ease forwards;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        .sign-in-bg {
          min-height: 100vh;
          width: 100vw;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sign-in-card.minimal.single-col {
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          max-width: 400px;
          width: 100%;
          padding: 36px 24px;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1);
        }
        .sign-in-card.minimal.single-col.show {
          opacity: 1;
          transform: translateY(0);
        }
        .cl-card, .cl-internal-1fsg6zy {
          box-shadow: 0 1px 4px rgba(0,0,0,0.025) !important;
          background: transparent !important;
        }
        /* Hide Clerk powered by badge (comprehensive) */
        .clerk-powered, 
        .clerk-powered-by, 
        .cl-internal-1r47j3i, 
        .cl-internal-1r47j3i *,
        .cl-internal-1r47j3i > *,
        .cl-internal-1r47j3i > div,
        .cl-internal-1r47j3i > span,
        .cl-internal-1r47j3i > a,
        .cl-internal-1r47j3i > svg {
          display: none !important;
        }
        .sign-in-title {
          font-size: 2rem;
          font-weight: 700;
          color: #000;
          margin-bottom: 24px;
          text-align: center;
        }
        @media (max-width: 700px) {
          .sign-in-card.minimal.single-col {
            max-width: 98vw;
            padding: 24px 8px;
          }
        }
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;700&display=swap');
      `}</style>
    </>
  );
}
