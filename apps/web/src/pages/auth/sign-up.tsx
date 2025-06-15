import { useState } from 'react';
import { SignUp } from "@clerk/clerk-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSignUp } from '@clerk/clerk-react';

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signUp } = useSignUp();

  const features = [
    {
      title: "Profesyonel Diyetisyenler",
      description: "Alanında uzman diyetisyenlerle çalışın"
    },
    {
      title: "Kişiselleştirilmiş Programlar",
      description: "Size özel beslenme planları oluşturun"
    },
    {
      title: "Kolay Takip",
      description: "İlerlemenizi anlık olarak takip edin"
    }
  ];

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="sign-in-card">
          <div className="sign-in-header">
            <h1>Kayıt Ol</h1>
            <p className="subtitle">Dietkem ile danışan takibi, planlama ve analiz tek bir yerde.</p>
            <SignUp 
              afterSignUpUrl="/welcome"
              signInUrl="/sign-in"
              redirectUrl="/welcome"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-white rounded-2xl shadow-lg p-8 w-full max-w-[400px] mx-auto",
                  headerTitle: { display: 'none' },
                  headerSubtitle: { display: 'none' },
                  cardHeader: { display: 'none' },
                  formButtonPrimary: 
                    "bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg w-full transition-colors",
                  formFieldInput: 
                    "w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm pl-10",
                  formFieldLabel: 
                    "text-gray-700 text-sm font-medium",
                  formFieldAction: 
                    "text-blue-600 hover:text-blue-700 text-sm",
                  identityPreviewEditButton: 
                    "text-blue-600 hover:text-blue-700 text-sm",
                  footerActionLink: 
                    "text-blue-600 hover:text-blue-700 text-sm",
                  socialButtonsBlockButton: 
                    "border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm rounded-lg",
                  socialButtonsBlockButtonText: 
                    "text-gray-700 text-sm",
                  formFieldInputShowPasswordButton: 
                    "text-gray-500 hover:text-gray-700",
                  footer: "hidden",
                  formFieldError: "text-red-500 text-sm",
                  alert: "bg-red-50 text-red-500 text-sm rounded-lg p-3",
                  alertText: "text-red-500 text-sm",
                  alertIcon: "text-red-500",
                  identityPreviewText: "text-gray-700 text-sm",
                  otpCodeFieldInput: 
                    "w-12 h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center text-lg",
                  formFieldWarningText: "text-yellow-600 text-sm",
                  formFieldSuccessText: "text-green-600 text-sm",
                },
                variables: {
                  colorPrimary: "#3b82f6",
                  colorText: "#1f2937",
                  colorTextSecondary: "#6b7280",
                  colorBackground: "#ffffff",
                  colorInputBackground: "#ffffff",
                  colorInputText: "#1f2937",
                  colorDanger: "#ef4444",
                  colorSuccess: "#22c55e",
                  colorWarning: "#f59e0b",
                  borderRadius: "0.5rem",
                },
              }}
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