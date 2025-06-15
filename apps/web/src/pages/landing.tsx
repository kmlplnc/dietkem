import { Link, useNavigate } from 'react-router-dom';
import { useUser, SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

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
            <Link to="/about" className="nav-link">Hakkımızda</Link>
            <Link to="/blog" className="nav-link">Blog</Link>
            <Link to="/tools" className="nav-link">Araçlar</Link>
            <Link to="/contact" className="nav-link">İletişim</Link>
          </nav>

          {/* User Actions & Language */}
          <div className="right-section">
            <div className="language-switcher">
              <button className="lang-btn">TR</button>
              <span className="separator">|</span>
              <button className="lang-btn">EN</button>
            </div>
            <div className="auth-buttons">
              {isLoaded && user ? (
                <div className="user-welcome" ref={dropdownRef}>
                  <button 
                    className="user-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="welcome-text">Merhaba, {user.firstName || user.username || 'Hoş Geldiniz'}</span>
                  </button>
                  {showDropdown && (
                    <div className="dropdown-menu">
                      <button onClick={handleSignOut} className="dropdown-item">
                        Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/sign-in" className="btn btn-text">Giriş Yap</Link>
                  <Link to="/sign-up" className="btn btn-primary">Kayıt Ol</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Sağlıklı Yaşam İçin Yeni Nesil Diyet Yönetimi</h1>
          <p className="hero-subtitle">Diyetisyenler ve danışanlar için basit, güçlü ve akıllı bir platform.</p>
          <div className="hero-cta">
            <Link to="/sign-up" className="btn btn-primary">Ücretsiz Başla</Link>
            <Link to="/about" className="btn btn-outline">Hakkımızda</Link>
          </div>
        </div>
      </section>

      <section className="why-dietkem">
        <div className="container why-dietkem-inner">
          <div className="content-wrapper">
            <h2 className="section-title">Neden Dietkem?</h2>
            <div className="envelope-row">
              <div className="envelope-trigger" onClick={() => {
                const title = document.querySelector('.section-title');
                const features = document.querySelector('.features-grid');
                const envelope = document.querySelector('.envelope-trigger');
                if (title && features && envelope) {
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
                    <span>Keşfet</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">Bilimsel Tabanlı Planlama</h3>
              <p className="feature-description">
                En güncel beslenme bilimine dayalı, kişiye özel diyet planları oluşturun. 
                Makro ve mikro besin dengesi, kalori hesaplaması ve besin değeri analizi ile 
                optimal sonuçlar elde edin.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Gelişmiş Takip ve Analiz</h3>
              <p className="feature-description">
                Detaylı ilerleme grafikleri, vücut kompozisyonu analizi ve kapsamlı raporlarla 
                hedeflerinize ulaşın. Haftalık ve aylık performans değerlendirmesi ile 
                sürecinizi optimize edin.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3 className="feature-title">Türkçe Destek + GDPR Uyumlu</h3>
              <p className="feature-description">
                Tamamen Türkçe arayüz, yerel besin veritabanı ve veri güvenliği standartlarına 
                uygun altyapı. Kişisel verileriniz güvende, tüm içerik Türkçe.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI Destekli Otomatik Planlama</h3>
              <p className="feature-description">
                Yapay zeka destekli önerilerle daha etkili beslenme planları oluşturun. 
                Öğrenen algoritmalar ile kişisel tercihlerinize ve hedeflerinize göre 
                sürekli optimize edilen programlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bmr-calculator">
        <div className="calculator-container">
          <h2 className="calculator-title">Günlük Kalori İhtiyacınızı Öğrenin</h2>
          <p className="calculator-subtitle">BMH + Aktivite oranı ile yaklaşık günlük enerji ihtiyacınızı hesaplayın.</p>
          
          <div className="calculator-card">
            <form className="calculator-form" onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const gender = form.querySelector('input[name="gender"]:checked')?.value;
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
                if (resultNumber) {
                  resultNumber.textContent = tdee.toLocaleString();
                }
                
                // Show result section
                const resultSection = document.querySelector('.result-section');
                if (resultSection) {
                  resultSection.classList.add('show');
                }
              }
            }}>
              <div className="form-group">
                <label>Cinsiyet</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="gender" value="male" />
                    <span>Erkek</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="gender" value="female" />
                    <span>Kadın</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="age">Yaş</label>
                <input type="number" id="age" placeholder="Yaşınızı girin" />
              </div>

              <div className="form-group">
                <label htmlFor="height">Boy (cm)</label>
                <input type="number" id="height" placeholder="Boyunuzu girin" />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Kilo (kg)</label>
                <input type="number" id="weight" placeholder="Kilonuzu girin" />
              </div>

              <div className="form-group">
                <label htmlFor="activity">Aktivite Seviyesi</label>
                <select id="activity">
                  <option value="1.2">Hareketsiz (BMR × 1.2)</option>
                  <option value="1.375">Hafif Aktif (BMR × 1.375)</option>
                  <option value="1.55">Orta Aktif (BMR × 1.55)</option>
                  <option value="1.725">Çok Aktif (BMR × 1.725)</option>
                  <option value="1.9">Aşırı Aktif (BMR × 1.9)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="goal">Hedefiniz</label>
                <select id="goal">
                  <option value="maintain">Kilo Koruma</option>
                  <option value="lose">Kilo Verme</option>
                  <option value="gain">Kilo Alma</option>
                </select>
              </div>

              <button type="submit" className="calculate-btn">Hesapla</button>
            </form>

            <div className="result-section">
              <div className="result-card">
                <h3 className="result-title">Günlük Enerji İhtiyacınız</h3>
                <div className="result-value">
                  <span className="number">0</span>
                  <span className="unit">kcal</span>
                </div>
                <p className="result-description">
                  Bu değer, günlük aktivite seviyenize ve hedefinize göre yaklaşık kalori ihtiyacınızı gösterir.
                </p>
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
          color: var(--gray-600);
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0.2rem 0.4rem;
          transition: color 0.2s ease;
        }

        .lang-btn:hover {
          color: var(--text-color);
        }

        .separator {
          color: var(--gray-300);
          font-size: 0.8rem;
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
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
          100% {
            transform: translateY(0px);
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