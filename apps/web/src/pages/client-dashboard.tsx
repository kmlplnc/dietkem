import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { toast } from 'react-hot-toast';
import '../styles/client-dashboard.css';

const ClientDashboard: React.FC = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Client bilgilerini çek
  const { data: client, isLoading: clientLoading } = trpc.clients.getById.useQuery(
    { id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Son ölçümleri çek
  const { data: measurements = [], isLoading: measurementsLoading } = trpc.measurements.getByClientId.useQuery(
    { client_id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Son görüşmeleri çek
  const { data: consultations = [], isLoading: consultationsLoading } = trpc.consultations.getByClientId.useQuery(
    { client_id: Number(clientId) },
    { enabled: !!clientId }
  );

  // En son ölçümü bul
  const latestMeasurement = React.useMemo(() => {
    if (!measurements || measurements.length === 0) return null;
    
    const sorted = [...measurements].sort((a, b) => 
      new Date(b.measured_at as string).getTime() - new Date(a.measured_at as string).getTime()
    );
    
    return sorted[0];
  }, [measurements]);

  // Son görüşmeyi bul
  const latestConsultation = React.useMemo(() => {
    if (!consultations || consultations.length === 0) return null;
    
    const sorted = [...consultations].sort((a, b) => 
      new Date(a.consultation_date).getTime() - new Date(b.consultation_date).getTime()
    );
    
    return sorted[sorted.length - 1];
  }, [consultations]);

  useEffect(() => {
    if (!clientLoading && !measurementsLoading && !consultationsLoading) {
      setIsLoading(false);
    }
  }, [clientLoading, measurementsLoading, consultationsLoading]);

  const handleLogout = () => {
    localStorage.removeItem('clientAccessCode');
    navigate('/client-access');
    toast.success('Başarıyla çıkış yapıldı');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  if (isLoading) {
    return (
      <div className="client-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Bilgileriniz yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-dashboard">
        <div className="error-container">
          <h2>Danışan bulunamadı</h2>
          <p>Lütfen geçerli bir danışan kodu ile giriş yapın.</p>
          <button onClick={() => navigate('/client-access')} className="btn-primary">
            Tekrar Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="client-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Danışan Paneli</h1>
          <p className="subtitle">Size özel bilgileri burada bulabilirsiniz</p>
          <div className="greeting">
            Merhaba, {client.name?.split(' ')[0] || 'Danışan'} 👋
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Güncel Ölçümler */}
        <section className="dashboard-section">
          <h2>📊 Güncel Ölçümler</h2>
          {latestMeasurement ? (
            <>
              <div className="measurements-grid">
                <div className="measurement-item">
                  <div className="measurement-value">{latestMeasurement.weight_kg} kg</div>
                  <div className="measurement-label">Kilo</div>
                </div>
                {latestMeasurement.waist_cm && (
                  <div className="measurement-item">
                    <div className="measurement-value">{latestMeasurement.waist_cm} cm</div>
                    <div className="measurement-label">Bel Çevresi</div>
                  </div>
                )}
                {latestMeasurement.body_fat_percentage && (
                  <div className="measurement-item">
                    <div className="measurement-value">%{latestMeasurement.body_fat_percentage}</div>
                    <div className="measurement-label">Vücut Yağ Oranı</div>
                  </div>
                )}
              </div>
              <div className="measurement-date">
                Ölçüm Tarihi: {formatDate(latestMeasurement.measured_at as string)}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Henüz ölçüm verisi bulunmamaktadır</p>
            </div>
          )}
        </section>

        {/* Randevu Bilgileri */}
        <section className="dashboard-section">
          <h2>🗓️ Randevu Bilgileri</h2>
          {latestConsultation ? (
            <>
              <div className="appointment-info">
                <div className="appointment-date">
                  Son randevu: {formatDate(latestConsultation.consultation_date)}
                </div>
                <div className="appointment-type">
                  {getConsultationTypeText(latestConsultation.consultation_type)}
                </div>
                {latestConsultation.notes && (
                  <div className="appointment-notes">
                    {latestConsultation.notes}
                  </div>
                )}
              </div>
              <div className="appointment-note">
                Yeni bir randevu talep etmek isterseniz diyetisyeninizle iletişime geçin
              </div>
            </>
          ) : (
            <>
              <div className="empty-state">
                <p>Henüz randevu bulunmamaktadır</p>
              </div>
              <div className="appointment-note">
                Yeni bir randevu talep etmek isterseniz diyetisyeninizle iletişime geçin
              </div>
            </>
          )}
        </section>

        {/* Güncel Diyet Planı */}
        <section className="dashboard-section">
          <h2>🥗 Diyet Planınız</h2>
          <div className="diet-plan">
            <div className="diet-plan-content">
              <p>Size özel diyet planınız diyetisyeniniz tarafından hazırlanmaktadır.</p>
              <div className="diet-plan-links">
                <a href="#" className="diet-plan-link">
                  📄 Haftalık örnek menü
                </a>
                <a href="#" className="diet-plan-link">
                  📋 Detaylı beslenme planı
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Diyetisyenin Notları */}
        <section className="dashboard-section">
          <h2>💬 Son Notlarınız</h2>
          {client.notes ? (
            <div className="notes-container">
              <div className="note-item">
                <div className="note-content">{client.notes}</div>
                <div className="note-date">Güncel</div>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <p>Henüz not bulunmamaktadır</p>
            </div>
          )}
        </section>

        {/* Görüşme Geçmişi */}
        <section className="dashboard-section">
          <h2>📋 Görüşme Geçmişi</h2>
          {consultations && consultations.length > 0 ? (
            <div className="consultations-list">
              {consultations.slice(-3).reverse().map((consultation) => (
                <div key={consultation.id} className="consultation-item">
                  <div className="consultation-date">
                    {formatDate(consultation.consultation_date)}
                  </div>
                  <div className="consultation-type">
                    {getConsultationTypeText(consultation.consultation_type)}
                  </div>
                  {consultation.notes && (
                    <div className="consultation-notes">
                      {consultation.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>Henüz görüşme geçmişi bulunmamaktadır</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <button onClick={handleLogout} className="btn-logout">
          Çıkış Yap
        </button>
      </footer>
    </div>
  );
};

export default ClientDashboard; 