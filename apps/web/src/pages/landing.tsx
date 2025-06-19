import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../hooks/useTranslation';
// CLERK_DISABLED_TEMP: import { useUser, useClerk } from '@clerk/clerk-react';

interface FormData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  activity: string;
  goal: string;
}

const LandingPage: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentLang, changeLanguage, t } = useLanguage();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debug user info
  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (isLoaded && user) {
    // CLERK_DISABLED_TEMP:   console.log('Landing Page - User:', user);
    // CLERK_DISABLED_TEMP: }
  }, []);

  // Dropdown for Araçlar
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  // Custom hover logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function handleMouseLeave() {
      timeout = setTimeout(() => setToolsDropdownOpen(false), 200);
    }
    function handleMouseEnter() {
      clearTimeout(timeout);
      setToolsDropdownOpen(true);
    }
    const btn = toolsButtonRef.current;
    const menu = toolsMenuRef.current;
    if (btn) {
      btn.addEventListener('mouseenter', handleMouseEnter);
      btn.addEventListener('mouseleave', handleMouseLeave);
    }
    if (menu) {
      menu.addEventListener('mouseenter', handleMouseEnter);
      menu.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (btn) {
        btn.removeEventListener('mouseenter', handleMouseEnter);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (menu) {
        menu.removeEventListener('mouseenter', handleMouseEnter);
        menu.removeEventListener('mouseleave', handleMouseLeave);
      }
      clearTimeout(timeout);
    };
  }, [toolsDropdownOpen]);

  // Dropdown dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async (): Promise<void> => {
    try {
      // CLERK_DISABLED_TEMP: await signOut();
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData: FormData = {
      gender: (form.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value || '',
      age: (form.querySelector('#age') as HTMLInputElement)?.value || '',
      height: (form.querySelector('#height') as HTMLInputElement)?.value || '',
      weight: (form.querySelector('#weight') as HTMLInputElement)?.value || '',
      activity: (form.querySelector('#activity') as HTMLSelectElement)?.value || '',
      goal: (form.querySelector('#goal') as HTMLSelectElement)?.value || ''
    };

    if (formData.gender && formData.age && formData.height && formData.weight && formData.activity) {
      // BMR calculation using Mifflin-St Jeor formula
      let bmr = 10 * Number(formData.weight) + 6.25 * Number(formData.height) - 5 * Number(formData.age);
      bmr = formData.gender === 'male' ? bmr + 5 : bmr - 161;
      
      // TDEE calculation
      let tdee = Math.round(bmr * Number(formData.activity));
      
      // Adjust calories based on goal
      if (formData.goal === 'lose') {
        tdee = Math.round(tdee - 500); // 500 calorie deficit for weight loss
      } else if (formData.goal === 'gain') {
        tdee = Math.round(tdee + 500); // 500 calorie surplus for weight gain
      }
      
      // Update result
      const resultNumber = document.querySelector('.result-value .number');
      if (resultNumber instanceof HTMLElement) {
        resultNumber.textContent = tdee.toLocaleString();
      }
      
      // Show result section
      const resultSection = document.querySelector('.result-section');
      if (resultSection instanceof HTMLElement) {
        resultSection.classList.add('show');
      }
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title slide-fade-in">{t('hero.title')}</h1>
          <p className="hero-subtitle slide-fade-in delay-200">{t('hero.subtitle')}</p>
          <div className="hero-cta">
            <button className="btn btn-primary scale-in delay-300" onClick={() => navigate('/abonelikler')}>{t('hero.startFree')}</button>
            <Link to="/hakkimizda" className="btn btn-outline scale-in delay-400">{t('hero.learnMore')}</Link>
          </div>
        </div>
      </section>

      <section className="why-dietkem">
        <div className="container why-dietkem-inner">
          <div className="content-wrapper">
            <h2 className="section-title slide-fade-in">{t('features.title')}</h2>
            <div className="envelope-row">
              <div className="envelope-trigger scale-in delay-200" onClick={() => {
                const title = document.querySelector('.section-title');
                const features = document.querySelector('.features-grid');
                const envelope = document.querySelector('.envelope-trigger');
                if (title instanceof HTMLElement && features instanceof HTMLElement && envelope instanceof HTMLElement) {
                  envelope.classList.add('opened');
                  title.classList.add('hide');
                  envelope.classList.add('slide-down');
                  setTimeout(() => {
                    features.classList.add('show');
                  }, 400);
                }
              }}>
                <div className="envelope">
                  <div className="envelope-flap"></div>
                  <div className="envelope-content">
                    <span>{t('features.explore')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="features-grid">
            <div className="feature-card scale-in delay-300">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">{t('features.science.title')}</h3>
              <p className="feature-description">{t('features.science.description')}</p>
            </div>

            <div className="feature-card scale-in delay-400">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">{t('features.tracking.title')}</h3>
              <p className="feature-description">{t('features.tracking.description')}</p>
            </div>

            <div className="feature-card scale-in delay-500">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">{t('features.local.title')}</h3>
              <p className="feature-description">{t('features.local.description')}</p>
            </div>

            <div className="feature-card scale-in delay-600">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">{t('features.ai.title')}</h3>
              <p className="feature-description">{t('features.ai.description')}</p>
            </div>

            <div className="feature-card scale-in delay-700">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">{t('features.blog.title')}</h3>
              <p className="feature-description">{t('features.blog.description')}</p>
            </div>

            <div className="feature-card scale-in delay-800">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">{t('features.pricing.title')}</h3>
              <p className="feature-description">{t('features.pricing.description')}</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Reset and Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-color: #2563eb;
          --text-color: #0f172a;
          --bg-color: #f9fafb;
          --white: #ffffff;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-600: #4b5563;
          --gray-800: #1f2937;
        }

        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.5;
          color: var(--text-color);
          background-color: var(--bg-color);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* Buttons */
        .btn {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 6px;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
          font-size: 0.85rem;
        }

        .btn-primary {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.7rem 2.2rem;
          font-size: 1.05rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-text {
          color: var(--primary-color);
        }

        .btn-text:hover {
          color: #1d4ed8;
        }

        /* Hero Section */
        .hero {
          background: var(--white);
          padding: 6rem 2rem 4rem;
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(37, 99, 235, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          background: linear-gradient(135deg, 
            var(--text-color) 0%,
            var(--gray-800) 25%,
            var(--gray-600) 50%,
            var(--gray-800) 75%,
            var(--text-color) 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 300%;
          animation: 
            gradient 12s ease-in-out infinite,
            float 6s ease-in-out infinite,
            fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
          animation-fill-mode: forwards;
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(-5px) rotate(2deg) scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.25rem);
          color: var(--gray-600);
          max-width: 600px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
          opacity: 0;
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards;
        }

        .hero-cta {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
        }

        .hero .btn {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          min-width: 160px;
          height: 56px;
          text-align: center;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .hero .btn-primary {
          background: var(--primary-color);
          color: var(--white);
          border: none;
          box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards;
        }

        .hero .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-2px);
          box-shadow: 0 6px 8px -1px rgba(37, 99, 235, 0.3);
        }

        .hero .btn-outline {
          background: transparent;
          border: 2px solid var(--gray-300);
          color: var(--gray-600);
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards;
        }

        .hero .btn-outline:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
          transform: translateY(-2px);
        }

        /* Why Dietkem Section */
        .why-dietkem {
          background: linear-gradient(to bottom, var(--white), var(--gray-100));
          padding: 0.5rem 0;
          position: relative;
          overflow: hidden;
          min-height: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .content-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 2;
        }

        .section-title {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 1.5rem;
          position: relative;
          transition: all 0.5s ease;
        }

        .section-title.hide {
          opacity: 0;
          transform: translateY(-100px);
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          width: 3rem;
          height: 3px;
          background: linear-gradient(to right, var(--primary-color), #4f46e5);
          border-radius: 3px;
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .section-title.hide::after {
          width: 0;
        }

        .envelope-row {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .envelope-trigger {
          cursor: pointer;
          width: 100px;
          height: 70px;
          position: relative;
          transition: all 0.5s ease;
          display: block;
        }

        .envelope-trigger.slide-down {
          transform: translateY(100px);
          opacity: 0;
        }

        .envelope-trigger:hover {
          transform: scale(1.05);
        }

        .envelope-trigger.slide-down:hover {
          transform: translateY(100px);
        }

        .envelope {
          width: 100%;
          height: 100%;
          background: var(--white);
          border-radius: 8px;
          position: relative;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 2px solid var(--primary-color);
        }

        .envelope-flap {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          background: var(--primary-color);
          transform-origin: top;
          transition: transform 0.5s ease;
          clip-path: polygon(0 0, 50% 50%, 100% 0);
          z-index: 2;
        }

        .envelope-content {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--primary-color);
          font-weight: 600;
          font-size: 1.1rem;
          transition: opacity 0.3s ease;
          z-index: 1;
          width: 100%;
          text-align: center;
        }

        .envelope-trigger.opened .envelope-flap {
          transform: rotateX(180deg);
        }

        .envelope-trigger.opened .envelope-content {
          opacity: 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 1rem;
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        .features-grid.show {
          opacity: 1;
          transform: translateY(0);
        }

        .feature-card {
          background: var(--white);
          border-radius: 12px;
          padding: 1.75rem 1.5rem;
          text-align: center;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px);
          min-height: 280px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .features-grid.show .feature-card {
          opacity: 1;
          transform: translateY(0);
        }

        .features-grid.show .feature-card:nth-child(1) { transition-delay: 0.1s; }
        .features-grid.show .feature-card:nth-child(2) { transition-delay: 0.2s; }
        .features-grid.show .feature-card:nth-child(3) { transition-delay: 0.3s; }
        .features-grid.show .feature-card:nth-child(4) { transition-delay: 0.4s; }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
          line-height: 1;
          display: inline-block;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .feature-description {
          font-size: 0.875rem;
          color: var(--gray-600);
          line-height: 1.6;
          max-width: 240px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .why-dietkem {
            padding: 0.25rem 0;
          }

          .features-grid {
            gap: 1rem;
          }

          .feature-card {
            padding: 1.5rem 1.25rem;
            min-height: 260px;
          }
        }

        @media (max-width: 480px) {
          .why-dietkem {
            padding: 1.5rem 1rem;
          }

          .feature-card {
            min-height: 240px;
          }
        }

        /* Why Dietkem Section inner for stacking */
        .why-dietkem-inner {
          position: relative;
          min-height: 100vh;
        }

        /* User Welcome Styles */
        .user-dropdown {
          position: relative;
          display: inline-block;
        }

        .dropdown-button {
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 0.9rem;
          font-weight: 500;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s ease;
        }

        .dropdown-button:hover {
          color: var(--primary-color);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 50;
          margin-top: 0.5rem;
          animation: slideDown 0.2s ease-out;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          text-align: left;
          background: none;
          border: none;
          color: var(--text-color);
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background-color: var(--hover-bg);
          color: var(--primary-color);
        }

        .dropdown-item:first-child {
          border-radius: 8px 8px 0 0;
        }

        .dropdown-item:last-child {
          border-radius: 0 0 8px 8px;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .dropdown-menu {
            right: -1rem;
          }
        }

        /* Avatar in navbar */
        .user-avatar-flex {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .navbar-useravatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          border: none;
          outline: none;
          background: #f3f4f6;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          transition: box-shadow 0.18s, background 0.18s;
          display: block;
        }
        .user-avatar-btn {
          background: none;
          border: none;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.18s, color 0.18s;
          border-radius: 0.5rem;
        }
        .user-avatar-btn:hover, .user-avatar-btn:focus {
          background: #f3f4f6;
        }
        .user-avatar-btn:hover .navbar-username, .user-avatar-btn:focus .navbar-username {
          color: #2563eb;
        }
        .user-avatar-btn:hover .navbar-useravatar, .user-avatar-btn:focus .navbar-useravatar {
          box-shadow: 0 2px 8px rgba(37,99,235,0.13);
        }
        .navbar-username {
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 500;
          font-family: inherit;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }
        @media (max-width: 700px) {
          .user-avatar-flex {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .navbar-username {
            font-size: 13px;
          }
        }
      `}</style>
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Remove the old scroll listener code
          });
        `
      }} />
    </>
  );
}

export default LandingPage; 