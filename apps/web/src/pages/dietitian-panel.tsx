import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { trpc } from '../utils/trpc';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import CreateClientForm from '../components/CreateClientForm';
import ClientsPage from './ClientsPage';
import ClientDetail from './ClientDetail';
import Toast from '../components/Toast';
import "./dashboard.css";

// Client Consultation Stats Component
const ClientConsultationStats: React.FC<{ clientId: number }> = ({ clientId }) => {
  const { data: stats, isLoading } = trpc.consultations.getClientStats.useQuery({ client_id: clientId });

  if (isLoading) {
    return (
      <div className="client-info">
        <div className="info-row">
          <span className="info-label">Son Görüşme:</span>
          <span className="info-value">Yükleniyor...</span>
        </div>
        <div className="info-row">
          <span className="info-label">Toplam Görüşme:</span>
          <span className="info-value">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="client-info">
      <div className="info-row">
        <span className="info-label">Son Görüşme:</span>
        <span className="info-value">
          {stats?.lastConsultation 
            ? formatDate(stats.lastConsultation.consultation_date) 
            : 'Henüz görüşme yok'
          }
        </span>
      </div>
      <div className="info-row">
        <span className="info-label">Toplam Görüşme:</span>
        <span className="info-value">{stats?.totalConsultations || 0}</span>
      </div>
    </div>
  );
};

// Client Appointments Component
const ClientAppointments: React.FC<{ clientId: number; clientName: string }> = ({ clientId, clientName }) => {
  const { data: consultations, isLoading, refetch } = trpc.consultations.getByClientId.useQuery({ client_id: clientId });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { weekday: 'short' });
  };

  const getConsultationTypeText = (type: string) => {
    switch (type) {
      case 'initial': return 'İlk Görüşme';
      case 'follow-up': return 'Takip Görüşmesi';
      case 'emergency': return 'Acil Görüşme';
      case 'online': return 'Online Görüşme';
      default: return type;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planlandı';
      case 'completed': return 'Tamamlandı';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <div className="appointments-content">
        <div className="loading-appointments">
          <div className="loading-spinner"></div>
          <p>Randevular yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!consultations || consultations.length === 0) {
    return (
      <div className="appointments-content">
        <div className="empty-appointments">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3>Henüz randevu yok</h3>
          <p>Bu danışan için henüz randevu oluşturulmamış.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-content">
      <div className="consultations-grid">
        {consultations.map((consultation) => (
          <div key={consultation.id} className="consultation-client-card" style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 70}}>
              <div style={{fontWeight: 700, fontSize: 18, color: '#3b82f6'}}>{formatDate(consultation.consultation_date)}</div>
              <div style={{fontSize: 13, color: '#64748b'}}>{getDayOfWeek(consultation.consultation_date)}</div>
              <div style={{fontSize: 13, color: '#64748b'}}>{formatTime(consultation.consultation_time)}</div>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 6}}>
              <div style={{fontWeight: 600, fontSize: 15, color: '#374151'}}>{getConsultationTypeText(consultation.consultation_type)}</div>
              {consultation.notes && (
                <div style={{fontSize: 14, color: '#6b7280', background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginTop: 4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {consultation.notes}
                </div>
              )}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 120}}>
              <span className={`appointment-status status-${consultation.status}`} style={{marginBottom: 8}}>
                {getStatusText(consultation.status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DietitianPanel = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [consultationView, setConsultationView] = useState<'list' | 'appointments' | 'new' | 'recent'>('list');
  const [isConsultationsOpen, setIsConsultationsOpen] = useState(false);
  const [selectedClientForConsultations, setSelectedClientForConsultations] = useState<{id: number, name: string} | null>(null);
  const { t } = useLanguage() || { t: (key: string) => key };

  // Toast state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Form state
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'initial',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Danışan sayısını çek
  const { data: clientCount, isLoading: isLoadingClientCount } = trpc.clients.getCount.useQuery();

  // Tüm danışanları çek
  const { data: clients, isLoading: isLoadingClients, refetch: refetchClients } = trpc.clients.getAll.useQuery();

  // Görüşme mutation'ı
  const createConsultationMutation = trpc.consultations.create.useMutation();

  // Toast helper functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // URL'den tab bilgisini al
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    const view = searchParams.get('view');
    const clientId = searchParams.get('clientId');
    const clientName = searchParams.get('clientName');
    
    if (tab) {
      setActiveTab(tab);
    }
    
    if (view && (view === 'list' || view === 'appointments' || view === 'new' || view === 'recent')) {
      setConsultationView(view);
    }
    
    if (clientId && clientName) {
      setSelectedClientId(parseInt(clientId));
      setSelectedClientName(clientName);
    }
  }, [location.search]);

  // URL'yi güncelle
  const updateURL = (tab: string, view?: string, clientId?: number, clientName?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tab', tab);
    
    if (view) {
      searchParams.set('view', view);
    }
    
    if (clientId && clientName) {
      searchParams.set('clientId', clientId.toString());
      searchParams.set('clientName', clientName);
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleSignOut = async () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">{t('dashboard.loading')}</div>;
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

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
    updateURL('client-detail', undefined, clientId);
  };

  // Danışanlar listesine geri dön
  const handleBackToClients = () => {
    setSelectedClientId(null);
    setActiveTab('clients');
    updateURL('clients');
  };

  // Görüşme paneli handler'ları
  const handleOpenConsultations = (clientId: number, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setIsConsultationsOpen(true);
    setConsultationView('list');
    updateURL('consultations', 'list', clientId, clientName);
  };

  const handleCloseConsultations = () => {
    setIsConsultationsOpen(false);
    setSelectedClientId(null);
    setSelectedClientName('');
    setConsultationView('list');
    updateURL('consultations');
  };

  const handleConsultationViewChange = (view: 'list' | 'appointments' | 'new' | 'recent') => {
    setConsultationView(view);
    updateURL('consultations', view, selectedClientId || undefined, selectedClientName || undefined);
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClientId) {
      showToast('Danışan seçilmedi!', 'error');
      return;
    }

    if (!formData.date || !formData.time) {
      showToast('Tarih ve saat alanları zorunludur!', 'error');
      return;
    }

    if (!user?.id) {
      showToast('Kullanıcı bilgisi bulunamadı!', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // API'ye görüşme kaydetme isteği gönder
      const result = await createConsultationMutation.mutateAsync({
        client_id: selectedClientId,
        consultation_date: formData.date,
        consultation_time: formData.time,
        consultation_type: formData.type as 'initial' | 'follow-up' | 'emergency' | 'online',
        notes: formData.notes || undefined,
        created_by: user.id,
      });

      // Başarılı kayıt sonrası
      showToast('Görüşme başarıyla kaydedildi!', 'success');
      
      // Client listesini yenile
      refetchClients();
      
      // Formu temizle
      setFormData({
        date: '',
        time: '',
        type: 'initial',
        notes: ''
      });
      
      // Görüşmeler listesine dön
      handleConsultationViewChange('list');
      
    } catch (error: any) {
      console.error('Görüşme kaydetme hatası:', error);
      showToast(`Görüşme kaydedilirken bir hata oluştu: ${error.message || 'Bilinmeyen hata'}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <main className="dashboard-content">
            <section className="quick-actions">
              <h2>Hızlı İşlemler</h2>
              <div className="action-cards">
                <div className="action-card" onClick={() => {
                  setActiveTab('new-client');
                  updateURL('new-client');
                }}>
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
                <span className="greeting">
                  {consultationView === 'list' && 'Görüşmeler'}
                  {consultationView === 'appointments' && `Randevular - ${selectedClientName}`}
                  {consultationView === 'new' && `Yeni Görüşme - ${selectedClientName}`}
                  {consultationView === 'recent' && `Son Görüşmeler - ${selectedClientName}`}
                </span>
                {consultationView !== 'list' && (
                  <button 
                    className="back-btn"
                    onClick={() => handleConsultationViewChange('list')}
                  >
                    ← Geri
                  </button>
                )}
              </div>
            </header>
            
            <div className="consultations-page">
              {consultationView === 'list' && (
                <>
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
                            <ClientConsultationStats clientId={client.id} />
                          </div>
                          
                          <div className="client-actions">
                            <button 
                              className="appointments-btn"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setSelectedClientName(client.name);
                                handleConsultationViewChange('appointments');
                              }}
                            >
                              🗓️ Randevularını Gör
                            </button>
                            
                            <button 
                              className="new-consultation-btn"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setSelectedClientName(client.name);
                                handleConsultationViewChange('new');
                              }}
                            >
                              ➕ Yeni Görüşme Ekle
                            </button>
                            
                            <button 
                              className="recent-consultations-btn"
                              onClick={() => {
                                setSelectedClientId(client.id);
                                setSelectedClientName(client.name);
                                handleConsultationViewChange('recent');
                              }}
                            >
                              🧾 Son Görüşmeler
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {consultationView === 'appointments' && (
                <div className="consultation-detail-view">
                  <div className="detail-header">
                    <h2>Randevular</h2>
                    <p>Danışan: {selectedClientName}</p>
                  </div>
                  
                  <div className="appointments-content">
                    <ClientAppointments clientId={selectedClientId} clientName={selectedClientName} />
                  </div>
                </div>
              )}

              {consultationView === 'new' && (
                <div className="consultation-detail-view">
                  <div className="detail-header">
                    <h2>Yeni Görüşme Ekle</h2>
                    <p>Danışan: {selectedClientName}</p>
                  </div>
                  
                  <div className="new-consultation-content">
                    <form className="consultation-form" onSubmit={handleFormSubmit}>
                      <div className="form-group">
                        <label htmlFor="consultation-date">Görüşme Tarihi</label>
                        <input 
                          type="date" 
                          id="consultation-date"
                          className="form-input"
                          required
                          name="date"
                          value={formData.date}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="consultation-time">Görüşme Saati</label>
                        <input 
                          type="time" 
                          id="consultation-time"
                          className="form-input"
                          required
                          name="time"
                          value={formData.time}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="consultation-type">Görüşme Türü</label>
                        <select id="consultation-type" className="form-input" name="type" value={formData.type} onChange={handleInputChange}>
                          <option value="initial">İlk Görüşme</option>
                          <option value="follow-up">Takip Görüşmesi</option>
                          <option value="emergency">Acil Görüşme</option>
                          <option value="online">Online Görüşme</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="consultation-notes">Notlar</label>
                        <textarea 
                          id="consultation-notes"
                          className="form-textarea"
                          rows={4}
                          placeholder="Görüşme hakkında notlar..."
                          name="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                        ></textarea>
                      </div>
                      
                      <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => handleConsultationViewChange('list')}>
                          İptal
                        </button>
                        <button type="submit" className="save-btn" disabled={isSubmitting}>
                          {isSubmitting ? 'Kaydediliyor...' : 'Görüşmeyi Kaydet'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {consultationView === 'recent' && (
                <div className="consultation-detail-view">
                  <div className="detail-header">
                    <h2>Son Görüşmeler</h2>
                    <p>Danışan: {selectedClientName}</p>
                  </div>
                  
                  <div className="recent-consultations-content">
                    <ClientAppointments clientId={selectedClientId} clientName={selectedClientName} />
                  </div>
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
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveTab('dashboard'); 
                updateURL('dashboard');
              }}
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
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveTab('clients'); 
                updateURL('clients');
              }}
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
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveTab('consultations'); 
                updateURL('consultations');
              }}
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

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default DietitianPanel; 