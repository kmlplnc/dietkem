import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';

const RealNavbar = () => {
  const { user, isLoggedIn, logout } = useAuth();

  // JWT decode function
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  // Get user info from JWT token if useAuth doesn't work
  const token = localStorage.getItem('token');
  const jwtUser = token ? decodeJWT(token) : null;
  const displayUser = user || jwtUser;

  // Check if user is admin
  const isAdmin = displayUser?.role === 'admin' || displayUser?.role === 'super_admin' || displayUser?.role === 'superadmin';

  return (
    <header className="navbar-top-bar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link className="navbar-logo-link" to="/">
            <img 
              src="/logo/logo3.png" 
              alt="Dietkem Logo" 
              className="logo-img"
              onError={(e) => {
                console.error('Logo failed to load:', e.target.src);
                e.target.style.display = 'none';
              }}
              onLoad={() => console.log('Logo loaded successfully')}
            />
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
          {isLoggedIn || displayUser ? (
            <div className="user-dropdown">
              <div className="user-trigger">
                <div className="user-avatar">
                  <img 
                    src={displayUser?.avatar_url || "/logo/logo3.png"} 
                    alt="Avatar" 
                    className="avatar-img"
                  />
                </div>
                <span className="user-name">
                  {displayUser?.firstName || displayUser?.email || 'Kullanıcı'}
                </span>
              </div>
              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/profile">
                  Profil
                </Link>
                {isAdmin && (
                  <Link className="dropdown-item" to="/admin">
                    Admin Paneli
                  </Link>
                )}
                <button className="dropdown-item logout-item" onClick={logout}>
                  Çıkış
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons-container">
              <Link className="btn btn-signin" to="/login">Giriş Yap</Link>
              <Link className="btn btn-signup" to="/register">Kayıt Ol</Link>
            </div>
          )}
        </div>
      </div>
      <style>{`
        :root {
          --primary-color: #2563eb;
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
          justify-content: space-between;
          gap: 1rem;
          min-width: 0;
          flex-wrap: nowrap !important;
          flex-direction: row;
          height: 64px;
        }
        .navbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          flex-shrink: 0;
        }
        .logo-img {
          height: 42px !important;
          width: 42px !important;
          object-fit: contain;
          display: block;
        }
        .brand-name {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: var(--gray-600) !important;
        }
        .main-nav {
          display: flex;
          align-items: center;
          gap: 2rem;
          flex: 1;
          justify-content: center;
          margin: 0 1rem;
        }
        .nav-link {
          text-decoration: none;
          font-size: 0.87rem;
          font-weight: 500;
          color: var(--gray-600) !important;
          transition: color 0.2s ease;
          position: relative;
          padding: 0.75rem 1rem;
          white-space: nowrap;
        }
        .nav-link:hover {
          color: var(--text-color) !important;
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
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
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
          gap: 0.5rem;
        }
        .btn-signin, .btn-signup {
          height: 30px !important;
          min-width: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 500;
          border-radius: 6px;
          line-height: 1.2;
          box-sizing: border-box;
          text-align: center;
          vertical-align: middle;
          padding: 0 0.75rem;
          white-space: nowrap;
          text-decoration: none !important;
          border-bottom: none !important;
          box-shadow: none !important;
          color: var(--gray-600) !important;
          transition: color 0.2s ease;
        }
        .btn-signin:hover, .btn-signup:hover {
          color: var(--text-color) !important;
        }
        .btn-signin::after,
        .btn-signup::after {
          display: none !important;
          content: none !important;
        }
        
        /* User Dropdown Styles */
        .user-dropdown {
          position: relative;
          display: inline-block;
        }
        
        .user-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        
        .user-trigger:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
        }
        
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-name {
          font-size: 0.87rem;
          font-weight: 500;
          color: var(--gray-600);
          white-space: nowrap;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 180px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          z-index: 1001;
        }
        
        .user-dropdown:hover .dropdown-menu {
          opacity: 1;
          visibility: visible;
          transform: translateX(-50%) translateY(0);
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          color: var(--gray-600);
          text-decoration: none;
          font-size: 0.87rem;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background-color: #f9fafb;
          color: var(--text-color);
        }
        
        .logout-item {
          color: #ef4444;
          border-top: 1px solid #e5e7eb;
        }
        
        .logout-item:hover {
          background-color: #fef2f2;
          color: #dc2626;
        }
        
        @media (max-width: 1024px) {
          .main-nav {
            gap: 1.5rem;
            margin: 0 0.5rem;
          }
          .nav-link {
            padding: 0.75rem 0.75rem;
            font-size: 0.8rem;
          }
          .right-section {
            gap: 0.75rem;
          }
          .user-name {
            max-width: 100px;
          }
        }
        @media (max-width: 768px) {
          .navbar-container {
            justify-content: space-between;
            gap: 0.5rem;
          }
          .main-nav {
            display: none;
          }
          .language-switcher {
            display: none;
          }
          .right-section {
            gap: 0.5rem;
          }
          .auth-buttons-container {
            gap: 0.5rem;
          }
          .btn-signin, .btn-signup {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
            min-width: 70px;
            height: 28px;
          }
          .user-name {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .navbar-container {
            padding: 0 1rem;
          }
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
};

export default RealNavbar; 