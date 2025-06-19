// CLERK_DISABLED_TEMP: import { SignIn, useSignIn, useAuth } from "@clerk/clerk-react";
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SignInPage() {
  const { currentLang } = useLanguage();
  // CLERK_DISABLED_TEMP: const { signIn, isLoaded } = useSignIn();
  // CLERK_DISABLED_TEMP: const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // CLERK_DISABLED_TEMP: useEffect(() => {
  // CLERK_DISABLED_TEMP:   if (isSignedIn) {
  // CLERK_DISABLED_TEMP:     navigate("/welcome", { replace: true });
  // CLERK_DISABLED_TEMP:   }
  // CLERK_DISABLED_TEMP: }, [isSignedIn, navigate]);

  // CLERK_DISABLED_TEMP: if (isSignedIn) {
  // CLERK_DISABLED_TEMP:   return null;
  // CLERK_DISABLED_TEMP: }

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="sign-in-card">
          <div className="sign-in-header">
            <h1>{currentLang === 'tr' ? 'Giriş Yap' : 'Sign In'}</h1>
            <p className="subtitle">{currentLang === 'tr' ? 'Modern diyetisyenler için akıllı çözüm ortağı.' : 'Smart solution partner for modern dietitians.'}</p>
            {/* CLERK_DISABLED_TEMP: <SignIn 
              appearance={{
                elements: {
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  card: "shadow-none",
                  rootBox: "mx-auto",
                  cardContent: "p-0",
                  header: "hidden",
                  formButtonPrimary: "w-full",
                  formFieldInput: "w-full",
                  formFieldLabel: "hidden",
                  formFieldAction: "hidden",
                  identityPreviewEditButton: "hidden",
                  identityPreviewText: "hidden",
                  formFieldInputShowPasswordButton: "hidden",
                  formFieldInputShowPasswordIcon: "hidden",
                  formFieldInputShowPasswordIconContainer: "hidden"
                }
              }}
              afterSignInUrl="/welcome"
              signUpUrl="/sign-up"
              redirectUrl="/welcome"
              routing="path"
              path="/sign-in"
              initialValues={{
                emailAddress: ""
              }}
              afterSignUpUrl="/welcome"
            /> */}
            <div className="brand-footer">
              <img src="/logo/logo3.png" alt="Dietkem Logo" className="brand-logo" />
              <span className="brand-name">Dietkem</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .sign-in-container {
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .sign-in-content {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 500px;
        }

        .sign-in-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem 2.5rem 0 2.5rem;
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 15px 30px -10px rgba(0, 0, 0, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sign-in-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          width: 100%;
        }

        .sign-in-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.75rem;
        }

        .subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          line-height: 1.5;
          max-width: 320px;
          margin: 0 auto 1.5rem;
        }

        @media (max-width: 640px) {
          .sign-in-container {
            padding: 1rem;
          }

          .sign-in-card {
            padding: 1.5rem;
          }
        }

        /* Input icon styles */
        .cl-formFieldInput {
          position: relative;
        }

        .cl-formFieldInput::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.5;
        }

        .cl-formFieldInput[type="email"]::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'%3E%3C/path%3E%3Cpolyline points='22,6 12,13 2,6'%3E%3C/polyline%3E%3C/svg%3E");
        }

        .cl-formFieldInput[type="password"]::before {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E");
        }

        /* Clerk component customizations */
        .cl-rootBox {
          width: 100% !important;
          max-width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .cl-card {
          box-shadow: none !important;
          padding: 0 !important;
          background: transparent !important;
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .cl-formFieldInput {
          width: 100% !important;
          max-width: 100% !important;
          text-align: center !important;
        }

        .cl-formButtonPrimary {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
        }

        .cl-socialButtonsBlockButton {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto !important;
        }

        .cl-formFieldAction {
          text-align: center !important;
          width: 100% !important;
        }

        .cl-formFieldError {
          text-align: center !important;
        }

        .cl-formFieldLabel {
          display: none !important;
        }

        .cl-formFieldAction {
          display: none !important;
        }

        .cl-identityPreviewEditButton {
          display: none !important;
        }

        .cl-identityPreviewText {
          display: none !important;
        }

        .cl-formFieldInputShowPasswordButton {
          display: none !important;
        }

        .cl-formFieldInputShowPasswordIcon {
          display: none !important;
        }

        .cl-formFieldInputShowPasswordIconContainer {
          display: none !important;
        }

        .brand-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
          width: 100%;
        }

        .brand-logo {
          width: 24px;
          height: 24px;
        }

        .brand-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}