import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const LandingPage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { currentLang, changeLanguage, t } = useLanguage();

  // Dropdown dışına tıklandığında kapatma
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
      navigate('/');
    } catch (error) {
      console.error('Çıkış yapılırken bir hata oluştu:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const gender = (form.querySelector('input[name="gender"]:checked') as HTMLInputElement)?.value;
    const age = (form.querySelector('#age') as HTMLInputElement)?.value;
    const height = (form.querySelector('#height') as HTMLInputElement)?.value;
    const weight = (form.querySelector('#weight') as HTMLInputElement)?.value;
    const activity = (form.querySelector('#activity') as HTMLSelectElement)?.value;

    if (gender && age && height && weight && activity) {
      // BMR calculation using Mifflin-St Jeor formula
      let bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age);
      bmr = gender === 'male' ? bmr + 5 : bmr - 161;
      
      // TDEE calculation
      let tdee = Math.round(bmr * Number(activity));
      
      // Adjust calories based on goal
      const goal = (form.querySelector('#goal') as HTMLSelectElement)?.value;
      if (goal === 'lose') {
        tdee = Math.round(tdee - 500); // 500 calorie deficit for weight loss
      } else if (goal === 'gain') {
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
      <header className="top-bar">
        <div className="container">
          {/* Brand Area */}
          <div className="navbar-left">
            <img src="/logo/logo3.png" alt="Dietkem Logo" className="logo-img" />
            <span className="brand-name">Dietkem</span>
          </div>

          {/* Main Navigation */}
          <nav className="main-nav">
            <a href="#about" className="nav-link">{t('nav.about')}</a>
            <Link to="/blog" className="nav-link">{t('nav.blog')}</Link>
            <Link to="/tools" className="nav-link">{t('nav.tools')}</Link>
            <Link to="/contact" className="nav-link">{t('nav.contact')}</Link>
          </nav>

          {/* User Actions & Language */}
          <div className="right-section">
            <div className="language-switcher">
              <button 
                className={`lang-btn ${currentLang === 'tr' ? 'active' : ''}`}
                onClick={() => changeLanguage('tr')}
              >
                TR
              </button>
              <span className="separator">|</span>
              <button 
                className={`lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
              >
                EN
              </button>
            </div>
            <div className="auth-buttons">
              {user ? (
                <div className="user-welcome" ref={dropdownRef}>
                  <button 
                    className="user-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="welcome-text">{t('nav.welcome', { name: user.firstName || user.username || t('nav.guest') })}</span>
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={handleSignOut} className="dropdown-item">
                        {t('nav.signOut')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/sign-in" className="btn btn-text">{t('nav.signIn')}</Link>
                  <Link to="/sign-up" className="btn btn-primary">{t('nav.signUp')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">{t('hero.title')}</h1>
          <p className="hero-subtitle">{t('hero.subtitle')}</p>
          <div className="hero-cta">
            <Link to="/sign-up" className="btn btn-primary">{t('hero.startFree')}</Link>
            <Link to="/about" className="btn btn-outline">{t('hero.learnMore')}</Link>
          </div>
        </div>
      </section>

      <section className="why-dietkem">
        <div className="container why-dietkem-inner">
          <div className="content-wrapper">
            <h2 className="section-title">{t('features.title')}</h2>
            <div className="envelope-row">
              <div className="envelope-trigger" onClick={() => {
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
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">{t('features.science.title')}</h3>
              <p className="feature-description">
                {t('features.science.description')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">{t('features.tracking.title')}</h3>
              <p className="feature-description">
                {t('features.tracking.description')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">{t('features.local.title')}</h3>
              <p className="feature-description">
                {t('features.local.description')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">{t('features.ai.title')}</h3>
              <p className="feature-description">
                {t('features.ai.description')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3 className="feature-title">{t('features.blog.title')}</h3>
              <p className="feature-description">
                {t('features.blog.description')}
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">{t('features.pricing.title')}</h3>
              <p className="feature-description">
                {t('features.pricing.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bmr-calculator">
        <div className="calculator-container">
          <h2 className="calculator-title">{t('calculator.title')}</h2>
          <p className="calculator-subtitle">{t('calculator.subtitle')}</p>
          
          <div className="calculator-card">
            <form className="calculator-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t('calculator.gender')}</label>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="gender" value="male" />
                    {t('calculator.genderOptions.male')}
                  </label>
                  <label>
                    <input type="radio" name="gender" value="female" />
                    {t('calculator.genderOptions.female')}
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="age">{t('calculator.age')}</label>
                <input type="number" id="age" name="age" required />
              </div>

              <div className="form-group">
                <label htmlFor="height">{t('calculator.height')}</label>
                <input type="number" id="height" name="height" required />
              </div>

              <div className="form-group">
                <label htmlFor="weight">{t('calculator.weight')}</label>
                <input type="number" id="weight" name="weight" required />
              </div>

              <div className="form-group">
                <label htmlFor="activity">{t('calculator.activity')}</label>
                <select id="activity" name="activity" required>
                  <option value="1.2">{t('calculator.activityOptions.sedentary')}</option>
                  <option value="1.375">{t('calculator.activityOptions.light')}</option>
                  <option value="1.55">{t('calculator.activityOptions.moderate')}</option>
                  <option value="1.725">{t('calculator.activityOptions.active')}</option>
                  <option value="1.9">{t('calculator.activityOptions.veryActive')}</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="goal">{t('calculator.goal')}</label>
                <select id="goal" name="goal" required>
                  <option value="lose">{t('calculator.goalOptions.lose')}</option>
                  <option value="maintain">{t('calculator.goalOptions.maintain')}</option>
                  <option value="gain">{t('calculator.goalOptions.gain')}</option>
                </select>
              </div>

              <button type="submit" className="calculate-btn">
                {t('calculator.calculate')}
              </button>
            </form>
          </div>

          <div className="result-section">
            <h3>{t('calculator.result.title')}</h3>
            <div className="result-value">
              <span className="number">0</span>
              <span className="unit">{t('calculator.result.unit')}</span>
            </div>
            <p className="result-description">{t('calculator.result.description')}</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="container">
          <div className="about-content">
            <h2 className="about-title">{currentLang === 'tr' ? 'Hakkımızda' : 'About Us'}</h2>
            
            <div className="about-text">
              <p className="main-description">
                {currentLang === 'tr' 
                  ? 'Dietkem, diyetisyenlerin gerçek ihtiyaçlarından yola çıkarak geliştirilmiş bir dijital çözümdür. Günümüzde danışan takibi, veri analizi ve kişiye özel diyet planlama süreçleri oldukça zaman alıcı olabilir. Dietkem, bu süreçleri sadeleştirmek ve hızlandırmak amacıyla 2025 yılında kuruldu.'
                  : 'Dietkem is a digital solution developed based on the real needs of dietitians. Today, client tracking, data analysis, and personalized diet planning processes can be very time-consuming. Dietkem was founded in 2025 to simplify and speed up these processes.'}
              </p>

              <div className="about-boxes-grid">
                <div className="about-box">
                  <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-why">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      <path d="M12 2v20"/>
                      <path d="M2 7h20"/>
                      <path d="M2 17h20"/>
                    </svg>
                  </div>
                  <h3>{currentLang === 'tr' ? 'Neden Geliştirildi?' : 'Why was it developed?'}</h3>
                  <ul>
                    <li>{currentLang === 'tr' ? 'Diyetisyenlerin kağıt, Excel ve WhatsApp gibi dağınık sistemler arasında boğulmasını önlemek' : 'Preventing dietitians from drowning in scattered systems like paper, Excel, and WhatsApp'}</li>
                    <li>{currentLang === 'tr' ? 'Tüm danışan bilgilerini tek merkezde toplamak' : 'Gathering all client information in one central location'}</li>
                    <li>{currentLang === 'tr' ? 'Bilimsel temelli, kişisel öneriler sunan bir sistem oluşturmak' : 'Creating a system that offers scientific, personalized recommendations'}</li>
                    <li>{currentLang === 'tr' ? 'Yapay zekâ ile desteklenen modern bir altyapı sunmak' : 'Providing a modern infrastructure supported by artificial intelligence'}</li>
                  </ul>
                </div>

                <div className="about-box">
                  <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-who">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M12 2v4"/>
                      <path d="M12 18v4"/>
                    </svg>
                  </div>
                  <h3>{currentLang === 'tr' ? 'Kim Geliştirdi?' : 'Who developed it?'}</h3>
                  <p>
                    {currentLang === 'tr'
                      ? 'Platform, Antalya Bilim Üniversitesi Beslenme ve Diyetetik bölümü öğrencisi Mehmet Kemal Palancı tarafından geliştirilmeye başlandı. Hem mesleki ihtiyaçları hem de teknik çözümleri birleştiren bir girişim olarak yola çıktı.'
                      : 'The platform was initially developed by Mehmet Kemal Palancı, a student at Antalya Science University\'s Nutrition and Dietetics department. It started as an initiative combining both professional needs and technical solutions.'}
                  </p>
                </div>

                <div className="about-box">
                  <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-mission">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <h3>{currentLang === 'tr' ? 'Misyonumuz' : 'Our Mission'}</h3>
                  <p>
                    {currentLang === 'tr'
                      ? 'Bilimsel, hızlı ve sade bir sistemle diyetisyenlerin günlük iş yükünü azaltmak.'
                      : 'To reduce the daily workload of dietitians with a scientific, fast, and simple system.'}
                  </p>
                </div>

                <div className="about-box">
                  <div className="icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-vision">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </div>
                  <h3>{currentLang === 'tr' ? 'Vizyonumuz' : 'Our Vision'}</h3>
                  <p>
                    {currentLang === 'tr'
                      ? 'Türkiye\'nin en güvenilir ve akıllı diyetisyen platformu olmak. Gelecekte klinikler, spor salonları ve mobil takip uygulamaları ile entegre çalışmak.'
                      : 'To become Turkey\'s most reliable and intelligent dietitian platform. To work integrated with clinics, gyms, and mobile tracking applications in the future.'}
                  </p>
                </div>
              </div>

              <div className="timeline-section">
                <h3>{currentLang === 'tr' ? 'Yolculuğumuz' : 'Our Journey'}</h3>
                <div className="timeline">
                  <div className="timeline-item">
                    <div className="timeline-icon icon-idea">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18h6"/>
                        <path d="M10 22h4"/>
                        <path d="M12 2v8"/>
                        <path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <h4>2023</h4>
                      <p>{currentLang === 'tr' ? 'Fikir aşaması' : 'Ideation Phase'}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon icon-dev">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 18l6-6-6-6"/>
                        <path d="M8 6l-6 6 6 6"/>
                        <path d="M12 2v20"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <h4>2024</h4>
                      <p>{currentLang === 'tr' ? 'İlk prototip geliştirildi' : 'First prototype developed'}</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-icon icon-launch">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                      </svg>
                    </div>
                    <div className="timeline-content">
                      <h4>2025</h4>
                      <p>{currentLang === 'tr' ? 'Yayın ve büyüme hedefi' : 'Launch and growth target'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="founder-message">
                <h3>{currentLang === 'tr' ? 'Kurucumuzdan Mesaj' : 'Message from Our Founder'}</h3>
                <p>
                  {currentLang === 'tr'
                    ? 'Diyetisyenlerin dijital yardımcısı olmak için yola çıktık. Bilimsel temelli, sade ve güvenilir bir platform sunarak mesleki süreci verimli hale getirmeyi hedefliyoruz.'
                    : 'We set out to be the digital assistant for dietitians. We aim to make the professional process efficient by offering a scientific, simple and reliable platform.'}
                </p>
                <div className="founder-signature">
                  <span>– Mehmet Kemal Palancı</span>
                  <span className="founder-title">{currentLang === 'tr' ? 'Dietkem Kurucusu' : 'Founder of Dietkem'}</span>
                </div>
              </div>
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
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          min-width: 0;
          flex-wrap: nowrap;
        }

        /* Brand Area */
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-img {
          height: 42px;
          width: auto;
          object-fit: contain;
          display: block;
        }

        .brand-name {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: var(--text-color);
        }

        /* Main Navigation */
        .main-nav {
          display: flex;
          gap: 2rem;
          margin: 0 2rem;
        }

        .nav-link {
          color: var(--gray-600);
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          transition: color 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-color);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--primary-color);
          transition: width 0.2s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* Right Section */
        .right-section {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        /* Language Switcher */
        .language-switcher {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lang-btn {
          background: none;
          border: none;
          padding: 0.25rem 0.5rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #6b7280;
          transition: all 0.2s ease;
        }

        .lang-btn:hover {
          color: #111827;
        }

        .lang-btn.active {
          color: #111827;
          font-weight: 600;
        }

        .separator {
          color: #e5e7eb;
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
          background-color: var(--primary-color);
          color: var(--white);
        }

        .btn-primary:hover {
          background-color: #1d4ed8;
        }

        .btn-text {
          color: var(--primary-color);
        }

        .btn-text:hover {
          color: #1d4ed8;
        }

        /* Top Bar */
        .top-bar {
          background-color: var(--white);
          padding: 0.35rem 0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .main-nav {
            gap: 1.5rem;
          }
        }

        @media (max-width: 768px) {
          .main-nav {
            display: none;
          }
          
          .language-switcher {
            display: none;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 1rem;
          }

          .brand-name {
            font-size: 1rem;
          }

          .auth-buttons {
            gap: 0.5rem;
          }
        }

        /* Auth Buttons */
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero {
            padding: 5rem 1.5rem 3rem;
            min-height: 70vh;
          }

          .hero-cta {
            flex-direction: column;
            gap: 1rem;
          }

          .hero .btn {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 4rem 1rem 2rem;
          }

          .hero-title {
            font-size: clamp(2rem, 4vw, 2.5rem);
          }

          .hero-subtitle {
            font-size: 1rem;
          }
        }

        /* Why Dietkem Section */
        .why-dietkem {
          background: linear-gradient(to bottom, var(--white), var(--gray-100));
          padding: 2.5rem 2rem;
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
            padding: 2rem 1.5rem;
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

        /* BMR Calculator Section */
        .bmr-calculator {
          background-color: var(--gray-100);
          padding: 5rem 2rem;
        }

        .calculator-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .calculator-title {
          font-size: clamp(1.875rem, 3vw, 2.5rem);
          font-weight: 700;
          color: var(--text-color);
          margin-bottom: 1rem;
          letter-spacing: -0.02em;
        }

        .calculator-subtitle {
          font-size: 1.125rem;
          color: var(--gray-600);
          max-width: 600px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        .calculator-card {
          background: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          overflow: hidden;
        }

        .calculator-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: left;
        }

        .form-group label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gray-600);
        }

        .radio-group {
          display: flex;
          gap: 1.5rem;
        }

        .radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .radio-label input[type="radio"] {
          width: 1.125rem;
          height: 1.125rem;
          accent-color: var(--primary-color);
        }

        input[type="number"],
        select {
          padding: 0.75rem 1rem;
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          font-size: 1rem;
          color: var(--text-color);
          background-color: var(--white);
          transition: all 0.2s ease;
        }

        input[type="number"]:focus,
        select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        input[type="number"]::placeholder {
          color: var(--gray-400);
        }

        .calculate-btn {
          background-color: var(--primary-color);
          color: var(--white);
          border: none;
          border-radius: 8px;
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 1rem;
        }

        .calculate-btn:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 640px) {
          .bmr-calculator {
            padding: 3rem 1rem;
          }

          .calculator-card {
            padding: 1.5rem;
          }

          .radio-group {
            gap: 1rem;
          }
        }

        /* Result Section */
        .result-section {
          margin-top: 2rem;
          opacity: 0;
          transform: translateY(20px);
          display: none;
          transition: all 0.3s ease;
        }

        .result-section.show {
          display: block;
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .result-card {
          background: linear-gradient(135deg, var(--primary-color), #4f46e5);
          border-radius: 12px;
          padding: 2rem;
          color: var(--white);
          text-align: center;
        }

        .result-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .result-value {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .result-value .number {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          background: linear-gradient(to right, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .result-value .unit {
          font-size: 1.5rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .result-description {
          font-size: 0.875rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Update calculator card to handle result section */
        .calculator-card {
          background: var(--white);
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          max-width: 500px;
          margin: 0 auto;
          padding: 2rem;
          overflow: hidden;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .result-card {
            padding: 1.5rem;
          }

          .result-value .number {
            font-size: 2.5rem;
          }

          .result-value .unit {
            font-size: 1.25rem;
          }
        }

        /* User Welcome Styles */
        .user-welcome {
          position: relative;
          display: flex;
          align-items: center;
        }

        .user-button {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .welcome-text {
          font-size: 0.9rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          padding: 0.5rem;
          min-width: 150px;
          margin-top: 0.5rem;
          animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.5rem 1rem;
          text-align: left;
          border: none;
          background: none;
          color: var(--gray-600);
          font-size: 0.9rem;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dropdown-item:hover {
          background: var(--gray-100);
          color: var(--text-color);
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
          .user-welcome {
            flex-direction: column;
            align-items: flex-end;
          }
          
          .welcome-text {
            font-size: 0.8rem;
          }

          .dropdown-menu {
            right: -1rem;
          }
        }

        /* Welcome Overlay Styles */
        .welcome-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(255, 255, 255, 0.98);
          display: flex !important;
          align-items: center;
          justify-content: center;
          z-index: 99999;
          opacity: 1;
          transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .welcome-overlay.fade-out {
          opacity: 0;
          pointer-events: none;
        }

        .welcome-message {
          text-align: center;
          padding: 0;
          background: transparent;
        }

        .welcome-typewriter {
          font-size: 3.2rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0;
          line-height: 1.4;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .letter-animation {
          display: inline-block;
          opacity: 0;
          transform: translateY(8px) scale(0.97);
          animation: fadeInUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .letter-animation.fade-out {
          opacity: 0;
          transform: translateY(8px) scale(0.97);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 768px) {
          .welcome-typewriter {
            font-size: 2.4rem;
          }
        }

        @media (max-width: 480px) {
          .welcome-typewriter {
            font-size: 2rem;
          }
        }

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        html {
          scroll-behavior: smooth;
        }

        .about-section {
          padding: 80px 20px;
          background-color: #f9f9f9;
          position: relative;
          overflow: hidden;
        }

        .about-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 300px;
          height: 300px;
          background: url('/images/diet-illustration.svg') no-repeat;
          background-size: contain;
          opacity: 0.1;
          z-index: 0;
        }

        .about-content {
          position: relative;
          z-index: 1;
        }

        .about-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .main-description {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4b5563;
          margin-bottom: 2rem;
          text-align: center;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-boxes-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .about-box {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .about-box:hover {
          transform: scale(1.02);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
        }

        .icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .icon-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-why .icon-wrapper::before {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1d4ed8 100%);
        }

        .icon-who .icon-wrapper::before {
          background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #047857 100%);
        }

        .icon-mission .icon-wrapper::before {
          background: linear-gradient(135deg, #f472b6 0%, #db2777 50%, #be185d 100%);
        }

        .icon-vision .icon-wrapper::before {
          background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #5b21b6 100%);
        }

        .about-box:hover .icon-wrapper {
          transform: scale(1.1);
          box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .about-box:hover .icon-wrapper::before {
          transform: scale(1.1) rotate(5deg);
        }

        .icon-wrapper svg {
          position: relative;
          z-index: 1;
          color: #2563eb;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .about-box:hover .icon-wrapper svg {
          color: white;
          transform: scale(1.1);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
        }

        .about-box h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .about-box p, .about-box li {
          font-size: 1rem;
          line-height: 1.5;
          color: #4b5563;
        }

        .about-box ul {
          list-style-type: none;
          padding: 0;
        }

        .about-box li {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .about-box li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: #6b7280;
        }

        .timeline-section {
          margin: 3rem 0;
          text-align: center;
        }

        .timeline-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 2rem;
        }

        .timeline {
          display: flex;
          justify-content: space-between;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
        }

        .timeline::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e7eb;
          z-index: 0;
        }

        .timeline-item {
          position: relative;
          z-index: 1;
          text-align: center;
          flex: 1;
        }

        .timeline-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .timeline-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .icon-idea .timeline-icon::before {
          background: linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #b45309 100%);
        }

        .icon-dev .timeline-icon::before {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
        }

        .icon-launch .timeline-icon::before {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
        }

        .timeline-icon svg {
          position: relative;
          z-index: 1;
          color: #2563eb;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        }

        .timeline-item:hover .timeline-icon {
          transform: scale(1.1);
          box-shadow: 0 8px 12px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .timeline-item:hover .timeline-icon::before {
          transform: scale(1.1) rotate(5deg);
        }

        .timeline-item:hover .timeline-icon svg {
          color: white;
          transform: scale(1.1);
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
        }

        .timeline-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .timeline-content p {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .founder-message {
          background: #f3f4f6;
          padding: 2rem;
          border-radius: 12px;
          margin-top: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .founder-message h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 1rem;
        }

        .founder-message p {
          font-size: 1.125rem;
          line-height: 1.6;
          color: #4b5563;
          font-style: italic;
          margin-bottom: 1.5rem;
        }

        .founder-signature {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .founder-signature span {
          font-weight: 500;
          color: #111827;
        }

        .founder-title {
          font-size: 0.875rem;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .about-boxes-grid {
            grid-template-columns: 1fr;
          }

          .timeline {
            flex-direction: column;
            gap: 2rem;
          }

          .timeline::before {
            display: none;
          }

          .timeline-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            text-align: left;
          }

          .timeline-icon {
            margin: 0;
          }

          .about-title {
            font-size: 2rem;
          }

          .main-description {
            font-size: 1rem;
          }
        }

        /* Icon Animations */
        .icon-why {
          animation: float 3s ease-in-out infinite;
        }

        .icon-who {
          animation: pulse 2s ease-in-out infinite;
        }

        .icon-mission {
          animation: rotate 4s linear infinite;
        }

        .icon-vision {
          animation: bounce 2s ease-in-out infinite;
        }

        /* Timeline Icon Animations */
        .icon-idea {
          animation: glow 2s ease-in-out infinite;
        }

        .icon-dev {
          animation: glowDev 2s ease-in-out infinite;
        }

        .icon-launch {
          animation: glowLaunch 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(251, 191, 36, 0.3)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.6)) brightness(1.2);
          }
        }

        @keyframes glowDev {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(34, 197, 94, 0.3)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6)) brightness(1.2);
          }
        }

        @keyframes glowLaunch {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(239, 68, 68, 0.3)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6)) brightness(1.2);
          }
        }

        .timeline-item:hover .icon-idea {
          animation: glow 1.2s ease-in-out infinite;
        }

        .timeline-item:hover .icon-dev {
          animation: glowDev 1.2s ease-in-out infinite;
        }

        .timeline-item:hover .icon-launch {
          animation: glowLaunch 1.2s ease-in-out infinite;
        }

        /* Update icon background colors */
        .icon-idea .timeline-icon::before {
          background: linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #b45309 100%);
        }

        .icon-dev .timeline-icon::before {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 50%, #15803d 100%);
        }

        .icon-launch .timeline-icon::before {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%);
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