import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../../utils/trpc';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const sendVerificationCode = trpc.auth.sendVerificationCode.useMutation({
    onSuccess: () => {
      setStep('verification');
      setError('');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const verifyCode = trpc.auth.verifyCode.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/welcome');
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (step === 'form') {
      await sendVerificationCode.mutateAsync(formData);
    } else {
      await verifyCode.mutateAsync({
        ...formData,
        code: verificationCode,
      });
    }
  };

  return (
    <div className="register-bg">
      <div className="register-container">
        <h2 className="register-title">
          {step === 'form' ? 'Hesap Oluştur' : 'E-posta Doğrulama'}
        </h2>
        <p className="register-desc">
          {step === 'form'
            ? 'Hemen ücretsiz hesabınızı oluşturun'
            : 'E-posta adresinize gönderilen 6 haneli kodu girin'}
        </p>
        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}
          {step === 'form' ? (
            <>
              <div className="register-row">
                <div className="register-col">
                  <label htmlFor="firstName">Ad</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    autoComplete="given-name"
                    placeholder="Ad"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                  />
                </div>
                <div className="register-col">
                  <label htmlFor="lastName">Soyad</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    autoComplete="family-name"
                    placeholder="Soyad"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="register-field">
                <label htmlFor="email">E-posta</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="E-posta"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="register-field">
                <label htmlFor="password">Şifre</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Şifre"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </>
          ) : (
            <div className="register-field">
              <label htmlFor="code">Doğrulama Kodu</label>
              <input
                id="code"
                name="code"
                type="text"
                required
                placeholder="6 haneli kod"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                pattern="[0-9]{6}"
              />
              <p className="register-info">
                Kod 5 dakika süreyle geçerlidir. Kod gelmedi mi?{' '}
                <button
                  type="button"
                  className="register-link"
                  onClick={() => sendVerificationCode.mutate(formData)}
                  disabled={sendVerificationCode.isLoading}
                >
                  Tekrar Gönder
                </button>
              </p>
            </div>
          )}
          <button
            type="submit"
            className="register-btn"
            disabled={
              step === 'form'
                ? sendVerificationCode.isLoading
                : verifyCode.isLoading
            }
          >
            {step === 'form'
              ? sendVerificationCode.isLoading
                ? 'Gönderiliyor...'
                : 'Devam Et'
              : verifyCode.isLoading
              ? 'Doğrulanıyor...'
              : 'Hesabı Oluştur'}
          </button>
        </form>
        <div className="register-footer">
          Zaten hesabınız var mı?{' '}
          <a href="/auth/login" className="register-link">Giriş Yap</a>
        </div>
        <div className="register-brand">
          <div className="brand-logo">
            <img src="/logo/logo3.png" alt="DietKem Logo" className="logo-img" />
          </div>
          <div className="brand-text">
            <span className="brand-name">DietKem</span>
            <span className="brand-tagline">Sağlıklı Yaşam Rehberiniz</span>
          </div>
        </div>
      </div>
      <style>{`
        .register-bg {
          min-height: calc(100vh - 64px);
          margin-top: 64px;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .register-container {
          background: #fff;
          padding: 32px 28px 24px 28px;
          border-radius: 12px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          max-width: 400px;
          width: 100%;
        }
        .register-title {
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
          color: #222;
        }
        .register-desc {
          text-align: center;
          color: #666;
          font-size: 1rem;
          margin-bottom: 24px;
        }
        .register-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .register-row {
          display: flex;
          gap: 8px;
        }
        .register-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .register-col label {
          margin-bottom: 4px;
          font-size: 0.97rem;
          color: #444;
        }
        .register-col input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
          width: 100%;
        }
        .register-col input:focus {
          border-color: #2563eb;
        }
        .register-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 8px;
        }
        .register-field label {
          margin-bottom: 4px;
          font-size: 0.97rem;
          color: #444;
        }
        .register-field input {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .register-field input:focus {
          border-color: #2563eb;
        }
        .register-btn {
          width: 100%;
          padding: 12px 0;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s;
        }
        .register-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .register-error {
          background: #fee2e2;
          color: #dc2626;
          padding: 10px 14px;
          border-radius: 6px;
          margin-bottom: 8px;
          font-size: 0.97rem;
          text-align: center;
        }
        .register-info {
          color: #666;
          font-size: 0.95rem;
          margin-top: 6px;
        }
        .register-link {
          color: #2563eb;
          background: none;
          border: none;
          padding: 0;
          font-size: 1em;
          cursor: pointer;
          text-decoration: underline;
        }
        .register-link:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
        .register-footer {
          margin-top: 18px;
          text-align: center;
          color: #666;
          font-size: 1rem;
        }
        .register-brand {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .brand-logo {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .brand-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #2563eb;
          line-height: 1;
        }
        .brand-tagline {
          font-size: 0.8rem;
          color: #6b7280;
          margin-top: 2px;
        }
        @media (max-width: 600px) {
          .register-row {
            flex-direction: column;
            gap: 0;
          }
          .register-col {
            margin-bottom: 12px;
            min-width: 0;
          }
          .register-col input {
            font-size: 0.97rem;
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
} 