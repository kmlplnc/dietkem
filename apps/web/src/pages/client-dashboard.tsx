import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { toast } from 'react-hot-toast';
import '../styles/client-dashboard.css';

const ClientDashboard = () => {
  const { clientId, dietitianId } = useParams();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Use clientId from URL, if dietitianId is not provided, use a default value
  const actualClientId = clientId || '1';
  const actualDietitianId = dietitianId || '1'; // Default dietitian ID

  // Get client's consultations
  const { data: consultations, isLoading: consultationsLoading, refetch } = trpc.consultations.getByClientId.useQuery({
    client_id: parseInt(actualClientId)
  }, {
    refetchInterval: 5000, // Poll for updates every 5 seconds
  });

  // Get active video calls for this client
  const { data: activeCalls, isLoading: activeCallsLoading } = trpc.consultations.getActiveVideoCalls.useQuery({
    client_id: parseInt(actualClientId)
  }, {
    refetchInterval: 3000, // Poll more frequently for active calls
  });

  const handleJoinCall = (consultationId: number) => {
    // Open the video call in a new tab
    window.open(`/call/${consultationId}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
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
      case 'in_progress': return 'Devam Ediyor';
      default: return status;
    }
  };

  if (consultationsLoading) {
    return (
      <div className="client-dashboard-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Görüşme bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="client-dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        <header className="dashboard-header">
          <h1>Danışan Paneli</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setIsPanelOpen(true)}
          >
            Görüşmeler
          </button>
        </header>

        <main className="dashboard-main">
          <div className="welcome-section">
            <h2>Hoş Geldiniz!</h2>
            <p>Diyetisyeninizle görüşmek için sağ üstteki "Görüşmeler" butonuna tıklayın.</p>
          </div>
        </main>
      </div>

      {/* Slide-over Panel */}
      <div className={`slide-over-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Görüşmeler</h2>
          <button 
            className="close-btn"
            onClick={() => setIsPanelOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          {/* Active Video Calls Section */}
          {activeCallsLoading ? (
            <div className="loading-section">
              <div className="spinner"></div>
              <p>Aktif görüşmeler kontrol ediliyor...</p>
            </div>
          ) : activeCalls && activeCalls.length > 0 ? (
            <div className="active-calls-section">
              <h3>🟢 Aktif Görüşmeler</h3>
              {activeCalls.map((call) => (
                <div key={call.id} className="active-call-item">
                  <div className="call-info">
                    <div className="call-title">Video Görüşmesi</div>
                    <div className="call-details">
                      <span>🕐 {formatTime(call.consultation_time)}</span>
                      <span>🏥 {getConsultationTypeText(call.consultation_type)}</span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-success"
                    onClick={() => handleJoinCall(call.id)}
                  >
                    Görüşmeye Katıl
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-active-calls">
              <div className="empty-icon">📹</div>
              <h3>Aktif Görüşme Yok</h3>
              <p>Şu anda aktif video görüşmeniz bulunmamaktadır.</p>
              <p className="info-text">Diyetisyeniniz görüşme başlattığında burada görünecektir.</p>
            </div>
          )}

          {/* Past Consultations */}
          <div className="past-consultations">
            <h3>Geçmiş Görüşmeler</h3>
            {consultations && consultations.length > 0 ? (
              <div className="consultations-list">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-date">
                      {formatDate(consultation.consultation_date)} - {formatTime(consultation.consultation_time)}
                    </div>
                    <div className="consultation-type">
                      {getConsultationTypeText(consultation.consultation_type)}
                    </div>
                    <div className="consultation-status">
                      <span className={`status-badge ${consultation.status}`}>
                        {getStatusText(consultation.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-consultations">
                <p>Henüz görüşme geçmişiniz bulunmamaktadır.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isPanelOpen && (
        <div 
          className="panel-overlay"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;