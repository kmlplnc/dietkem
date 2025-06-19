import { Link } from 'react-router-dom';

const RealNavbar = () => (
  <header className="navbar-top-bar">
    <div className="navbar-container">
      <div className="navbar-left">
        <Link className="navbar-logo-link" to="/">
          <img src="/logo/logo3.png" alt="Dietkem Logo" className="logo-img" />
        </Link>
        <span className="brand-name">Dietkem</span>
      </div>
      <nav className="main-nav">
        <Link className="nav-link" to="/blog">Blog</Link>
        <Link className="nav-link" to="/tarifler">Tarifler</Link>
        <Link className="nav-link" to="/calorimatik">Kalorimatik</Link>
        <Link className="nav-link" to="/ai-plan">AI Planı</Link>
        <Link className="nav-link" to="/abonelikler">Abonelikler</Link>
      </nav>
      <div className="right-section">
        <div className="language-switcher">
          <button className="lang-btn active">TR</button>
          <span className="separator">|</span>
          <button className="lang-btn">EN</button>
        </div>
        <div className="auth-buttons-container">
          <Link className="btn btn-signin" to="/login">Giriş Yap</Link>
          <Link className="btn btn-signup" to="/register">Kayıt Ol</Link>
        </div>
      </div>
    </div>
    <style>{`
      :root {
        --gray-600: #4b5563;
        --text-color: #0f172a;
      }
      .navbar-top-bar {
        background-color: rgba(255,255,255,0.92);
        backdrop-filter: blur(6px);
        padding: 0.35rem 0;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        font-family: 'Inter', sans-serif;
      }
      .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        min-width: 0;
        flex-wrap: nowrap !important;
        flex-direction: row;
        height: 64px;
      }
      .navbar-left, .main-nav, .right-section {
        display: flex;
        align-items: center;
        flex-direction: row;
        flex-wrap: nowrap;
      }
      .main-nav {
        margin: 0 auto;
        flex-wrap: nowrap !important;
        flex-direction: row;
        gap: 3.5rem;
      }
      .navbar-left {
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
        color: var(--gray-600) !important;
      }
      .nav-link,
      .btn-signin,
      .btn-signup {
        color: var(--gray-600) !important;
      }
      .nav-link:hover,
      .btn-signin:hover,
      .btn-signup:hover {
        color: var(--text-color) !important;
      }
      .btn-signin::after,
      .btn-signup::after {
        display: none !important;
        content: none !important;
      }
      .nav-link {
        text-decoration: none;
        font-size: 0.87rem;
        font-weight: 500;
        transition: color 0.2s ease;
        position: relative;
        padding: 0.75rem 1.25rem;
        white-space: nowrap;
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
      .right-section {
        gap: 2rem;
      }
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
      .auth-buttons-container {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 200px;
        min-width: 200px;
        width: 200px;
        margin: 0 auto;
        justify-content: center;
        box-sizing: border-box;
        padding-left: 0;
        padding-right: 0;
        height: 30px;
        min-height: 30px;
      }
      .btn-signin,
      .btn-signup,
      .auth-buttons-container a {
        text-decoration: none !important;
        border-bottom: none !important;
        box-shadow: none !important;
        color: var(--gray-600) !important;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 30px;
        min-height: 30px;
        max-width: 100%;
        padding: 0;
        font-family: 'Inter', sans-serif;
        font-size: 0.87rem;
        font-weight: 500;
        letter-spacing: normal;
        background: #fff;
        border: 1.5px solid #e5e7eb;
        border-radius: 6px;
        line-height: 1.2;
        text-align: center;
        white-space: nowrap;
      }
      @media (max-width: 700px) {
        .auth-buttons-container {
          gap: 0.5rem;
        }
        .btn-signin, .btn-signup {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          min-width: 70px;
          height: 28px;
        }
        .main-nav {
          display: none;
        }
        .language-switcher {
          display: none;
        }
      }
      @media (max-width: 480px) {
        .auth-buttons-container {
          gap: 0.4rem;
        }
        .btn-signin, .btn-signup {
          padding: 0.35rem 0.6rem;
          font-size: 0.75rem;
          min-width: 60px;
          height: 26px;
        }
      }
    `}</style>
  </header>
);

export default RealNavbar; 