// CLERK_DISABLED_TEMP: import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { trpc } from "../../utils/trpc";

export default function CompleteProfilePage() {
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { t } = useLanguage();
  // CLERK_DISABLED_TEMP: const [firstName, setFirstName] = useState(user?.firstName || "");
  // CLERK_DISABLED_TEMP: const [lastName, setLastName] = useState(user?.lastName || "");
  // CLERK_DISABLED_TEMP: const [username, setUsername] = useState(user?.username || "");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateProfile = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      navigate("/welcome");
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (isLoaded && user) {
    // CLERK_DISABLED_TEMP:   // If profile is already complete, redirect to welcome
    // CLERK_DISABLED_TEMP:   if (user.firstName && user.lastName && user.username) {
    // CLERK_DISABLED_TEMP:     navigate("/welcome");
    // CLERK_DISABLED_TEMP:   }
    // CLERK_DISABLED_TEMP: }
  }, [navigate]);

  // CLERK_DISABLED_TEMP: if (!isLoaded || !user) {
  // CLERK_DISABLED_TEMP:   return <div>{t("welcome.loading") || "Yükleniyor..."}</div>;
  // CLERK_DISABLED_TEMP: }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      setError("Lütfen tüm alanları doldurun.");
      setLoading(false);
      return;
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username.trim())) {
      setError("Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir.");
      setLoading(false);
      return;
    }

    try {
      const trimmedUsername = username.trim().toLowerCase();
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();

      // Update profile using tRPC
      updateProfile.mutate({
        // CLERK_DISABLED_TEMP: clerkId: user.id,
        clerkId: '',
        // CLERK_DISABLED_TEMP: email: user.emailAddresses[0]?.emailAddress || "",
        email: '',
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        username: trimmedUsername,
      });
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.message || "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
      setLoading(false);
    }
  };

  return (
    <div className="verify-email-container">
      <div className="verify-email-card">
        <h1>{t('profile.completeTitle') || "Profilini Tamamla"}</h1>
        <p>{t('profile.completeDesc') || "Devam etmek için aşağıdaki bilgileri doldurmalısın."}</p>
        {error && <div className="verify-email-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="verify-email-input"
            placeholder={t('profile.firstName') || "İsim"}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
          />
          <input
            type="text"
            className="verify-email-input"
            placeholder={t('profile.lastName') || "Soyisim"}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
            minLength={2}
            maxLength={50}
          />
          <input
            type="text"
            className="verify-email-input"
            placeholder={t('profile.username') || "Kullanıcı Adı"}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={30}
            title="Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir"
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('profile.saving') || "Kaydediliyor..." : t('profile.save') || "Kaydet ve Devam Et"}
          </button>
        </form>
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
        .verify-email-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
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
      `}</style>
    </div>
  );
} 