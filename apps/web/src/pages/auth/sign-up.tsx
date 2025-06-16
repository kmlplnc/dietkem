import { SignUp } from "@clerk/clerk-react";
import { useLanguage } from '../../context/LanguageContext';

export default function SignUpPage() {
  const { currentLang } = useLanguage();

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="sign-in-card">
          <div className="sign-in-header">
            <h1>{currentLang === 'tr' ? 'Kayıt Ol' : 'Sign Up'}</h1>
            <p className="subtitle">{currentLang === 'tr' ? 'Modern diyetisyenler için akıllı çözüm ortağı.' : 'Smart solution partner for modern dietitians.'}</p>
            <SignUp 
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
              afterSignUpUrl="/welcome"
              signInUrl="/sign-in"
              redirectUrl="/welcome"
              routing="path"
              path="/sign-up"
            />
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
          margin-bottom: 0;
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
          width: 100% !important;
        }

        .cl-alert {
          text-align: center !important;
          width: 100% !important;
          margin: 0 auto !important;
        }

        .cl-formFieldLabel {
          text-align: center !important;
          width: 100% !important;
        }

        .cl-formField {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .brand-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          padding: 1.5rem 0;
          border-top: 1px solid #e5e7eb;
          width: 100%;
          justify-content: center;
        }

        .brand-logo {
          height: 24px;
          width: auto;
        }

        .brand-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #6b7280;
        }

        @media (max-width: 640px) {
          .sign-in-container {
            padding: 1rem;
          }

          .sign-in-card {
            padding: 1.5rem 1.5rem 0 1.5rem;
          }
        }
      `}</style>
    </div>
  );
} 