import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth.tsx';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/welcome');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/welcome');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{t('auth.login')}</h2>
        <label>{t('auth.email')}</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <label>{t('auth.password')}</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? t('auth.loggingIn') : t('auth.login')}
        </button>
        <div className="form-footer">
          <p>
            {t('auth.noAccount')} <a href="/register">{t('auth.register')}</a>
          </p>
        </div>
      </form>
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9f9f9;
          padding: 1rem;
        }
        .login-form {
          background: #fff;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          min-width: 320px;
          max-width: 400px;
          width: 100%;
        }
        .login-form h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .login-form label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        .login-form input {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .login-form input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .login-form input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        .login-form .error {
          color: #dc2626;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.5rem;
          background-color: #fef2f2;
          border-radius: 4px;
          border: 1px solid #fecaca;
        }
        .login-form button {
          padding: 0.75rem;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .login-form button:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .login-form button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }
        .form-footer {
          margin-top: 1.5rem;
          text-align: center;
        }
        .form-footer p {
          color: #6b7280;
          margin: 0;
        }
        .form-footer a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .form-footer a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default LoginPage; 