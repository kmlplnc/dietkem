// CLERK_DISABLED_TEMP: import { useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";

export default function VerifyEmailPage() {
  // CLERK_DISABLED_TEMP: const { isLoaded, signUp, setActive } = useSignUp();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (!isLoaded) return;
    // CLERK_DISABLED_TEMP: if (signUp.status === "complete") {
    // CLERK_DISABLED_TEMP:   setActive({ session: signUp.createdSessionId }).then(() => {
    // CLERK_DISABLED_TEMP:     navigate("/welcome");
    // CLERK_DISABLED_TEMP:   });
    // CLERK_DISABLED_TEMP: }
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // CLERK_DISABLED_TEMP: if (!signUp) throw new Error("signUp undefined");
      // CLERK_DISABLED_TEMP: const res = await signUp.attemptEmailAddressVerification({ code });
      // CLERK_DISABLED_TEMP: if (res.status === "complete") {
      // CLERK_DISABLED_TEMP:   setSuccess(true);
      // CLERK_DISABLED_TEMP:   if (!setActive) throw new Error("setActive undefined");
      // CLERK_DISABLED_TEMP:   await setActive({ session: res.createdSessionId });
      // CLERK_DISABLED_TEMP:   navigate("/welcome");
      // CLERK_DISABLED_TEMP: } else {
      // CLERK_DISABLED_TEMP:   setError(t('auth.verifyEmail.invalidCode') || "Kod doğrulanamadı.");
      // CLERK_DISABLED_TEMP: }
      setError(t('auth.verifyEmail.invalidCode') || "Kod doğrulanamadı.");
    } catch (err: any) {
      setError(err.errors?.[0]?.message || t('auth.verifyEmail.invalidCode') || "Kod doğrulanamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1>{t('auth.verifyEmail.title')}</h1>
        <p>{t('auth.verifyEmail.description')}</p>
        <div className="verify-email-message">
          {t('auth.verifyEmail.checkEmail')}
        </div>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            className="verify-email-input"
            placeholder={t('auth.verifyEmail.codePlaceholder') || "Kodu girin"}
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            maxLength={6}
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('auth.verifyEmail.verifying') || "Doğrulanıyor..." : t('auth.verifyEmail.verifyButton') || "Doğrula"}
          </button>
        </form>
        {error && <div className="verify-email-error">{error}</div>}
        {success && <div className="verify-email-success">{t('auth.verifyEmail.success') || "Başarıyla doğrulandı!"}</div>}
      </div>
      <style>{`
        .verify-email-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #ffffff;
        }
        .verify-email-card {
          background: white;
          border-radius: 16px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }
        p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }
        .verify-email-message {
          background-color: #f3f4f6;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          color: #374151;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .verify-email-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          text-align: center;
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
          border: none;
          cursor: pointer;
          width: 100%;
          margin-bottom: 1rem;
        }
        .btn-primary:disabled {
          background-color: #93c5fd;
          cursor: not-allowed;
        }
        .verify-email-error {
          color: #dc2626;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        .verify-email-success {
          color: #16a34a;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
} 