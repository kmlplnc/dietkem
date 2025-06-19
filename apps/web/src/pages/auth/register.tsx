import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth.tsx';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isLoggedIn } = useAuth();
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

    const result = await register(email, password, firstName, lastName);
    
    if (result.success) {
      navigate('/welcome');
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  if (isLoggedIn) {
    return null;
  }

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>{t('auth.register')}</h2>
        <label>{t('auth.firstName')}</label>
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          disabled={loading}
        />
        <label>{t('auth.lastName')}</label>
        <input
          type="text"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          disabled={loading}
        />
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
          minLength={6}
          disabled={loading}
        />
        {error && <div className="error">{error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? t('auth.registering') : t('auth.register')}
        </button>
        <div className="form-footer">
          <p>
            {t('auth.haveAccount')} <a href="/login">{t('auth.login')}</a>
          </p>
        </div>
      </form>
      <style>{`
        .register-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9f9f9;
          padding: 1rem;
        }
        .register-form {
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
        .register-form h2 {
          margin-bottom: 1.5rem;
          text-align: center;
          color: #1f2937;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .register-form label {
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #374151;
        }
        .register-form input {
          margin-bottom: 1rem;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        .register-form input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        .register-form input:disabled {
          background-color: #f9fafb;
          cursor: not-allowed;
        }
        .register-form .error {
          color: #dc2626;
          margin-bottom: 1rem;
          text-align: center;
          padding: 0.5rem;
          background-color: #fef2f2;
          border-radius: 4px;
          border: 1px solid #fecaca;
        }
        .register-form button {
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
        .register-form button:hover:not(:disabled) {
          background: #1d4ed8;
        }
        .register-form button:disabled {
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

export default RegisterPage; 