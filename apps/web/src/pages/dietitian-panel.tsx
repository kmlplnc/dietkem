import React, { useState } from 'react';
// CLERK_DISABLED_TEMP: import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../lib/auth';
import { trpc } from '../utils/trpc';
import CreateClientForm from '../components/CreateClientForm';
import ClientsPage from './ClientsPage';
import ClientDetail from './ClientDetail';
import ConsultationsPanel from '../components/ConsultationsPanel';
import "./dashboard.css";

const DietitianPanel = () => {
  // CLERK_DISABLED_TEMP: const { signOut } = useAuth();
  // CLERK_DISABLED_TEMP: const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isConsultationsOpen, setIsConsultationsOpen] = useState(false);
  const [selectedClientForConsultations, setSelectedClientForConsultations] = useState<{id: number, name: string} | null>(null);
  const { t } = useLanguage() || { t: (key: string) => key };
  const { user } = useAuth();

  // Danışan sayısını çek
  const { data: clientCount, isLoading: isLoadingClientCount } = trpc.clients.getCount.useQuery();

  // Tüm danışanları çek
  const { data: clients, isLoading: isLoadingClients } = trpc.clients.getAll.useQuery();

  const handleSignOut = async () => {
    // CLERK_DISABLED_TEMP: await signOut();
    navigate('/');
  };

  // CLERK_DISABLED_TEMP: if (!isLoaded) {
  // CLERK_DISABLED_TEMP:   return <div className="loading">{t('dashboard.loading')}</div>;
  // CLERK_DISABLED_TEMP: }

  // CLERK_DISABLED_TEMP: if (!user) {
  // CLERK_DISABLED_TEMP:   navigate("/sign-in");
  // CLERK_DISABLED_TEMP:   return null;
  // CLERK_DISABLED_TEMP: }

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    } else if (user?.email) {
      return user.email.split('@')[0];
    } else {
      return 'Diyetisyen';
    }
  };

  // Danışan detayına git
  const handleClientDetail = (clientId: number) => {
    setSelectedClientId(clientId);
    setActiveTab('client-detail');
  };

  // Danışanlar listesine geri dön
  const handleBackToClients = () => {
    setSelectedClientId(null);
    setActiveTab('clients');
  };

  // Görüşmeler panelini aç
  const handleOpenConsultations = (clientId: number, clientName: string) => {
    setSelectedClientForConsultations({ id: clientId, name: clientName });
    setIsConsultationsOpen(true);
  };

  // Görüşmeler panelini kapat
  const handleCloseConsultations = () => {
    setIsConsultationsOpen(false);
    setSelectedClientForConsultations(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <main className="dashboard-content">
            <section className="quick-actions">
              <h2>Hızlı İşlemler</h2>
              <div className="action-cards">
                <div className="action-card" onClick={() => setActiveTab('new-client')}>
                  <i className="fas fa-user-plus"></i>
                  <h3>Yeni Danışan</h3>
                  <p>Yeni danışan kaydı oluşturun</p>
                </div>
                <div className="action-card">
                  <i className="fas fa-plus"></i>
                  <h3>Yeni Beslenme Planı</h3>
                  <p>Danışanınız için özel beslenme planı oluşturun</p>
                </div>
                <div className="action-card">
                  <i className="fas fa-calendar-plus"></i>
                  <h3>Görüşme Ekle</h3>
                  <p>Yeni görüşme randevusu oluşturun</p>
                </div>
              </div>
            </section>

            <section className="dashboard-stats">
              <h2>Genel Bakış</h2>
              <div className="stat-cards">
                <div className="stat-card">
                  <h3>Toplam Danışan</h3>
                  <p className="stat-number">
                    {isLoadingClientCount ? 'Yükleniyor...' : String(clientCount || 0)}
                  </p>
                </div>
                <div className="stat-card">
                  <h3>Aktif Planlar</h3>
                  <p className="stat-number">-</p>
                </div>
                <div className="stat-card">
                  <h3>Bugünkü Görüşmeler</h3>
                  <p className="stat-number">-</p>
                </div>
              </div>
            </section>

            <section className="upcoming-section">
              <h2>Yaklaşan Görüşmeler</h2>
              <div className="appointment-list">
                <div className="empty-state">
                  <i className="fas fa-calendar-times"></i>
                  <h3>Henüz görüşme yok</h3>
                  <p>Yeni görüşme eklemek için yukarıdaki "Görüşme Ekle" butonunu kullanın</p>
                </div>
              </div>
            </section>
          </main>
        );
      case 'new-client':
        return <CreateClientForm />;
      case 'clients':
        return <ClientsPage onClientDetail={handleClientDetail} />;
      case 'client-detail':
        return <ClientDetail clientId={selectedClientId} onBack={handleBackToClients} />;
      case 'consultations':
        return (
          <main className="dashboard-content">
            <header className="topbar">
              <div className="user-info">
                <span className="greeting">Görüşmeler</span>
              </div>
            </header>
            
            <div className="consultations-page">
              {!clients || clients.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                  <h3>Henüz danışan yok</h3>
                  <p>Görüşme yönetimi için önce danışan eklemeniz gerekiyor.</p>
                </div>
              ) : (
                <div className="consultations-grid">
                  {clients.map((client) => (
                    <div key={client.id} className="consultation-client-card">
                      <div className="client-header">
                        <h3 className="client-name">{client.name}</h3>
                        <span className={`client-status ${client.status === 'active' ? 'active' : 'passive'}`}>
                          {client.status === 'active' ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      
                      <div className="client-info">
                        <div className="info-row">
                          <span className="info-label">Son Görüşme:</span>
                          <span className="info-value">Henüz görüşme yok</span>
                        </div>
                        
                        <div className="info-row">
                          <span className="info-label">Toplam Görüşme:</span>
                          <span className="info-value">0</span>
                        </div>
                      </div>
                      
                      <div className="client-actions">
                        <button 
                          className="appointments-btn"
                          onClick={() => handleOpenConsultations(client.id, client.name)}
                        >
                          🗓️ Randevularını Gör
                        </button>
                        
                        <button 
                          className="new-consultation-btn"
                          onClick={() => handleOpenConsultations(client.id, client.name)}
                        >
                          ➕ Yeni Görüşme Ekle
                        </button>
                        
                        <button 
                          className="recent-consultations-btn"
                          onClick={() => handleOpenConsultations(client.id, client.name)}
                        >
                          🧾 Son Görüşmeler
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        );
      default:
        return <div>Sayfa bulunamadı</div>;
    }
  };

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
            <h2>Diyetisyen Paneli</h2>
          </div>
          <nav className="nav-menu">
            <a 
              href="#" 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ana Sayfa
            </a>
            <a 
              href="#" 
              className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('clients'); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Danışanlarım
            </a>
            <a href="#" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
              Beslenme Planları
            </a>
            <a 
              href="#" 
              className={`nav-link ${activeTab === 'consultations' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab('consultations'); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Görüşmeler
            </a>
            <a href="#" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Raporlar
            </a>
            <button onClick={handleSignOut} className="logout-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Çıkış
            </button>
          </nav>
        </aside>

        <div className="main-content">
          {activeTab === 'dashboard' && (
            <header className="topbar">
              <div className="user-info">
                <span className="greeting">Hoş geldiniz, {getUserDisplayName()}!</span>
              </div>
            </header>
          )}

          {renderContent()}
        </div>
      </div>
      
      {/* Consultations Panel */}
      {selectedClientForConsultations && (
        <ConsultationsPanel
          clientId={selectedClientForConsultations.id}
          clientName={selectedClientForConsultations.name}
          isOpen={isConsultationsOpen}
          onClose={handleCloseConsultations}
        />
      )}
    </>
  );
};

export default DietitianPanel; 