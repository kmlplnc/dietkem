import { useState } from 'react';
// CLERK_DISABLED_TEMP: import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import "../dashboard.css";

const Dashboard = () => {
  // CLERK_DISABLED_TEMP: const { signOut } = useAuth();
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useLanguage();

  const handleSignOut = async () => {
    // CLERK_DISABLED_TEMP: await signOut();
    navigate('/sign-in');
  };

  // CLERK_DISABLED_TEMP: if (!isLoaded) {
  // CLERK_DISABLED_TEMP:   return <div className="loading">{t('dashboard.loading')}</div>;
  // CLERK_DISABLED_TEMP: }

  // CLERK_DISABLED_TEMP: if (!user) {
  // CLERK_DISABLED_TEMP:   navigate("/sign-in");
  // CLERK_DISABLED_TEMP:   return null;
  // CLERK_DISABLED_TEMP: }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
      />
      <div className="dashboard">
        <button 
          className="mobile-menu-button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="logo">
            <img src="/logo/logo3.png" alt="Dietkem Logo" />
          </div>
          <nav className="nav-menu">
            <a href="#" className="nav-link active">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              {t('dashboard.home')}
            </a>
            <a href="#" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {t('dashboard.clients')}
            </a>
            <a href="#" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              {t('dashboard.mealPlans')}
            </a>
            <a href="#" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              {t('dashboard.reports')}
            </a>
            <button onClick={handleSignOut} className="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              {t('dashboard.signOut')}
            </button>
          </nav>
        </aside>

        <div className="main-content">
          <header className="topbar">
            <div className="user-info">
              <span className="greeting">{t('dashboard.greeting', { name: (t('nav.dietitianPanel') === 'Diyetisyen Paneli' ? 'Diyetisyen' : 'Dietitian') })}</span>
            </div>
          </header>

          <main className="dashboard-content">
            <section className="quick-actions">
              <h2>{t('dashboard.quickActions.title')}</h2>
              <div className="action-cards">
                <div className="action-card">
                  <i className="fas fa-plus"></i>
                  <h3>{t('dashboard.quickActions.createPlan.title')}</h3>
                  <p>{t('dashboard.quickActions.createPlan.description')}</p>
                </div>
                <div className="action-card">
                  <i className="fas fa-user-plus"></i>
                  <h3>{t('dashboard.quickActions.newClient.title')}</h3>
                  <p>{t('dashboard.quickActions.newClient.description')}</p>
                </div>
                <div className="action-card">
                  <i className="fas fa-calendar-plus"></i>
                  <h3>{t('dashboard.quickActions.addAppointment.title')}</h3>
                  <p>{t('dashboard.quickActions.addAppointment.description')}</p>
                </div>
              </div>
            </section>

            <section className="dashboard-stats">
              <h2>{t('dashboard.overview.title')}</h2>
              <div className="stat-cards">
                <div className="stat-card">
                  <h3>{t('dashboard.overview.totalClients')}</h3>
                  <p className="stat-number">24</p>
                </div>
                <div className="stat-card">
                  <h3>{t('dashboard.overview.activePlans')}</h3>
                  <p className="stat-number">18</p>
                </div>
                <div className="stat-card">
                  <h3>{t('dashboard.overview.todayAppointments')}</h3>
                  <p className="stat-number">5</p>
                </div>
              </div>
            </section>

            <section className="upcoming-section">
              <h2>{t('dashboard.upcomingAppointments.title')}</h2>
              <div className="appointment-list">
                <div className="appointment-card">
                  <div className="appointment-time">09:00</div>
                  <div className="appointment-details">
                    <h4>Ayşe Yılmaz</h4>
                    <p>{t('dashboard.upcomingAppointments.controlVisit')}</p>
                  </div>
                </div>
                <div className="appointment-card">
                  <div className="appointment-time">11:30</div>
                  <div className="appointment-details">
                    <h4>Mehmet Demir</h4>
                    <p>{t('dashboard.upcomingAppointments.firstVisit')}</p>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 