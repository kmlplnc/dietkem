// CLERK_DISABLED_TEMP: import { SignUp } from "@clerk/clerk-react";
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
            {/* CLERK_DISABLED_TEMP: <SignUp 
              appearance={{
                elements: {
                  header: "hidden",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  card: "shadow-none",
                  rootBox: "mx-auto",
                  cardContent: "p-0",
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
              afterSignUpUrl="/sign-up/verify-email-address"
              signInUrl="/sign-in"
              redirectUrl="/sign-up/verify-email-address"
              routing="path"
              path="/sign-up"
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
          padding: 2rem 1.5rem 1.5rem 1.5rem;
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
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
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
          margin: 0 auto 0.75rem;
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
          text-align: left !important;
          width: 100% !important;
          margin: 0.25rem 0 !important;
          color: #dc2626 !important;
          font-size: 0.875rem !important;
        }

        .cl-formFieldSuccess {
          text-align: left !important;
          width: 100% !important;
          margin: 0.25rem 0 !important;
          color: #059669 !important;
          font-size: 0.875rem !important;
        }

        .cl-alert {
          text-align: left !important;
          width: 100% !important;
          margin: 0.5rem 0 !important;
          padding: 0.75rem !important;
          border-radius: 0.5rem !important;
          background-color: #fee2e2 !important;
          color: #dc2626 !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          border: 1px solid #fecaca !important;
        }

        .cl-alertText {
          color: #dc2626 !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        .cl-alertIcon {
          color: #dc2626 !important;
          margin-right: 0.5rem !important;
        }

        .cl-formFieldLabel {
          text-align: center !important;
          width: 100% !important;
        }

        .cl-formField {
          margin-bottom: 1rem !important;
          width: 100% !important;
        }

        .cl-formFieldInput {
          width: 100% !important;
          padding: 0.75rem 1rem !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
          transition: all 0.2s ease !important;
        }

        .cl-formFieldInput:focus {
          outline: none !important;
          border-color: #2563eb !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
        }

        .cl-formButtonPrimary {
          width: 100% !important;
          padding: 0.75rem 1rem !important;
          background-color: #2563eb !important;
          color: white !important;
          border: none !important;
          border-radius: 0.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .cl-formButtonPrimary:hover {
          background-color: #1d4ed8 !important;
        }

        .cl-formButtonPrimary:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
        }

        .brand-footer {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
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

        /* Password validation styles */
        .cl-password-validation {
          text-align: left !important;
          width: 100% !important;
          margin: 0.25rem 0 !important;
          padding: 0.5rem !important;
          background-color: #f3f4f6 !important;
          border-radius: 0.375rem !important;
          font-size: 0.875rem !important;
          line-height: 1.25rem !important;
        }

        .cl-password-validation ul {
          list-style-type: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .cl-password-validation li {
          margin: 0.25rem 0 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.5rem !important;
        }

        .cl-password-validation li::before {
          content: "•" !important;
          color: #6b7280 !important;
        }

        /* Social button styles */
        .cl-socialButtonsBlockButton {
          width: 100% !important;
          padding: 0.75rem 1rem !important;
          background-color: white !important;
          color: #374151 !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.5rem !important;
          font-size: 0.875rem !important;
          font-weight: 500 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 0.5rem !important;
        }

        .cl-socialButtonsBlockButton:hover {
          background-color: #f9fafb !important;
          border-color: #d1d5db !important;
        }

        .cl-socialButtonsBlockButton:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1) !important;
        }

        /* Divider styles */
        .cl-dividerLine {
          background-color: #e5e7eb !important;
          height: 1px !important;
          margin: 1.5rem 0 !important;
        }

        .cl-dividerText {
          color: #6b7280 !important;
          font-size: 0.875rem !important;
          background-color: white !important;
          padding: 0 1rem !important;
        }

        @media (max-width: 640px) {
          .sign-in-container {
            padding: 1rem;
          }

          .sign-in-card {
            padding: 1.5rem 1.5rem 0 1.5rem;
          }
        }

        .cl-header,
        .cl-headerTitle,
        .cl-headerSubtitle {
          display: none !important;
          visibility: hidden !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
} 