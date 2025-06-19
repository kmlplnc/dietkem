import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import AddMeasurementModal from '../components/AddMeasurementModal';
import toast, { Toaster } from 'react-hot-toast';

interface ClientsPageProps {
  onClientDetail?: (clientId: number) => void;
}

const ClientsPage: React.FC<ClientsPageProps> = ({ onClientDetail }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);

  // Gerçek veritabanı verilerini çek
  const { data: clients, isLoading, error } = trpc.clients.getAll.useQuery();
  const { data: clientCount } = trpc.clients.getCount.useQuery();

  // Yaş hesaplama fonksiyonu
  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Tarih formatı (gg.aa.yyyy)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Cinsiyet çevirisi
  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'Male': return 'Erkek';
      case 'Female': return 'Kadın';
      case 'Other': return 'Diğer';
      default: return gender;
    }
  };

  const handleNewClient = () => {
    navigate('/dietitian-panel?tab=new-client');
  };

  const handleClientDetail = (clientId: number) => {
    if (onClientDetail) {
      onClientDetail(clientId);
    } else {
      // Fallback: Eğer prop yoksa eski yöntemi kullan
      navigate(`/client-detail/${clientId}`);
    }
  };

  const handleNewMeasurement = (clientId: number) => {
    const client = clients?.find(c => c.id === clientId);
    if (client) {
      setSelectedClient({ id: clientId, name: client.name || 'Danışan' });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const handleDeleteClient = () => {
    if (window.confirm('Bu danışanı silmek istediğinizden emin misiniz?')) {
      // UI only - no actual deletion
      toast.success('Danışan silindi (UI only)', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      });
    }
  };

  // Loading durumu
  if (isLoading) {
    return (
      <div className="clients-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Danışanlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className="clients-page">
        <div className="error-state">
          <h3>Hata oluştu</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clients-page">
      <Toaster />
      <div className="page-header">
        <h1>Danışanlarım</h1>
        <button onClick={handleNewClient} className="new-client-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          + Yeni Danışan Ekle
        </button>
      </div>

      {!clients || clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h3>Henüz danışan yok</h3>
          <p>Yeni danışan eklemek için yukarıdaki butonu kullanın.</p>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <div className="client-header">
                <h3 className="client-name">{client.name}</h3>
                <span className={`plan-status ${client.status === 'active' ? 'active' : 'passive'}`}>
                  {client.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              
              <div className="client-info">
                <div className="info-row">
                  <span className="info-label">Cinsiyet • Yaş:</span>
                  <span className="info-value">
                    {getGenderText(client.gender || '')} • {client.birth_date ? calculateAge(client.birth_date) : 'Belirtilmemiş'}
                  </span>
                </div>
                
                <div className="info-row">
                  <span className="info-label">Kayıt Tarihi:</span>
                  <span className="info-value">{client.created_at ? formatDate(client.created_at) : 'Belirtilmemiş'}</span>
                </div>
              </div>
              
              <div className="client-actions">
                <button 
                  onClick={() => handleClientDetail(client.id)}
                  className="detail-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                  Detay
                </button>
                
                <button 
                  onClick={() => handleNewMeasurement(client.id)}
                  className="measurement-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Yeni Ölçüm
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .clients-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
          background: #f8fafc;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state h3 {
          color: #dc2626;
          margin-bottom: 0.5rem;
        }

        .error-state p {
          color: #6b7280;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .new-client-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .new-client-btn:hover {
          background: #334155;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          color: #9ca3af;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
          font-size: 1rem;
        }

        .clients-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .client-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          border: 1px solid #e5e7eb;
        }

        .client-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .client-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .client-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          flex: 1;
        }

        .plan-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .plan-status.active {
          background: #dcfce7;
          color: #166534;
        }

        .plan-status.passive {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .client-info {
          margin-bottom: 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .info-value {
          font-size: 0.9rem;
          color: #1e293b;
          font-weight: 600;
        }

        .client-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-btn, .measurement-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f8fafc;
          color: #1e293b;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
          min-width: 0;
        }

        .detail-btn:hover, .measurement-btn:hover {
          background: #1e293b;
          color: white;
          border-color: #1e293b;
        }

        @media (max-width: 768px) {
          .clients-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .page-header h1 {
            text-align: center;
          }

          .clients-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .client-card {
            padding: 1rem;
          }

          .client-header {
            flex-direction: column;
            gap: 0.5rem;
            align-items: flex-start;
          }

          .plan-status {
            align-self: flex-start;
          }
        }
      `}</style>

      {/* Yeni Ölçüm Modal */}
      {selectedClient && (
        <AddMeasurementModal
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ClientsPage; 