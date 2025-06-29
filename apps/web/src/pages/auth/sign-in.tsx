import { useState } from 'react';
import { SignIn } from "@clerk/clerk-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSignIn } from '@clerk/clerk-react';

export default function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useSignIn();

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <div className="sign-in-card">
          <div className="sign-in-header">
            <h1>Giriş Yap</h1>
            <p className="subtitle">Modern diyetisyenler için akıllı çözüm ortağı.</p>
            <SignIn 
              afterSignInUrl="/welcome"
              signUpUrl="/sign-up"
              redirectUrl="/welcome"
              routing="path"
              path="/sign-in"
              forgotPasswordUrl="/reset-password"
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

        /* Google button styles */
        .cl-socialButtonsBlockButton {
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 8px !important;
          background: white !important;
          color: #374151 !important;
          font-weight: 500 !important;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cl-socialButtonsBlockButton:hover {
          background: #f9fafb !important;
          border-color: #d1d5db !important;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .cl-socialButtonsBlockButton img {
          width: 20px;
          height: 20px;
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
      `}</style>
    </div>
  );
}