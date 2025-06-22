import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../lib/auth';
import { trpc } from '../utils/trpc';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Trash2
} from 'lucide-react';
import CreateClientForm from '../components/CreateClientForm';
import ClientsPage from './ClientsPage';
import ClientDetail from './ClientDetail';
import Toast from '../components/Toast';
import VideoCallPanel from '../components/VideoCallPanel';
import "../styles/dietitian-panel.css";
import ConfirmationModal from '../components/ConfirmationModal';

// Helper functions
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

const getRemainingTime = (dateString: string, timeString: string) => {
  const now = new Date();
  const consultationDateTime = new Date(dateString.split('T')[0] + 'T' + timeString);
  const diffMs = consultationDateTime.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return 'Süresi doldu';
  }
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} gün kaldı`;
  } else if (diffHours > 0) {
    return `${diffHours} saat kaldı`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} dakika kaldı`;
  } else {
    return 'Çok yakında';
  }
};

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
  const { data: consultations, isLoading } = trpc.consultations.getByClientId.useQuery({ client_id: clientId });
  const [showAll, setShowAll] = useState(false);
  
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Randevular yükleniyor...</p>
      </div>
    );
  }

  if (!consultations || consultations.length === 0) {
    return <p>Bu danışan için randevu bulunmamaktadır.</p>;
  }

  const visibleConsultations = showAll ? consultations : consultations.slice(0, 4);

  return (
    <div className="appointments-content">
      <div className="consultations-grid">
        {visibleConsultations.map((consultation) => (
          <div
            key={consultation.id}
            className="consultation-client-card appointment-square-card"
          >
            <div style={{fontWeight: 700, fontSize: 20, color: '#3b82f6', marginBottom: 2}}>{formatDate(consultation.consultation_date)}</div>
            <div style={{fontSize: 13, color: '#64748b', marginBottom: 2}}>{getDayOfWeek(consultation.consultation_date)} - {formatTime(consultation.consultation_time)}</div>
            <div style={{fontWeight: 600, fontSize: 15, color: '#374151', marginBottom: 2}}>{getConsultationTypeText(consultation.consultation_type)}</div>
            <span className={`appointment-status status-${consultation.status}`} style={{margin: '8px 0'}}>
              {getStatusText(consultation.status)}
            </span>
            {consultation.notes && (
              <div style={{fontSize: 14, color: '#6b7280', background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginTop: 4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {truncate(consultation.notes, 60)}
              </div>
            )}
          </div>
        ))}
      </div>
      {consultations.length > 4 && (
        <button onClick={() => setShowAll(!showAll)} className="show-all-btn">
          {showAll ? 'Daha Az Göster' : 'Tümünü Göster'}
        </button>
      )}
    </div>
  );
};

// Upcoming Appointments Component
const UpcomingAppointments: React.FC<{ clientId: number; clientName: string }> = ({ clientId, clientName }) => {
  const { data: consultations, isLoading, refetch } = trpc.consultations.getByClientId.useQuery({ client_id: clientId });
  const updateConsultation = trpc.consultations.update.useMutation({
    onSuccess: () => {
      refetch();
      showToast('Randevu başarıyla güncellendi!', 'success');
    },
    onError: (error) => {
      showToast('Randevu güncellenirken hata oluştu: ' + error.message, 'error');
    }
  });

  const [editModal, setEditModal] = useState<{ isOpen: boolean; consultation: any }>({
    isOpen: false,
    consultation: null
  });

  // State to force re-render for countdown updates
  const [, setCountdown] = useState(0);
  
  // State to track which consultations have been notified
  const [notifiedConsultations, setNotifiedConsultations] = useState<Set<number>>(new Set());

  // Update countdown every minute and check for notifications
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
      
      // Check for notifications
      if (consultations) {
        consultations.forEach(consultation => {
          if (shouldPlayNotification(consultation.consultation_date, consultation.consultation_time) && 
              !notifiedConsultations.has(consultation.id)) {
            playNotificationSound();
            setNotifiedConsultations(prev => new Set(prev).add(consultation.id));
            showToast(`⚠️ ${clientName} için randevu 5 dakika içinde başlayacak!`, 'info');
          }
        });
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [consultations, notifiedConsultations, clientName]);

  const now = new Date();

  // Helper to combine date and time into a Date object
  const getDateTime = (date: string, time: string) => {
    return new Date(date.split('T')[0] + 'T' + time);
  };

  const upcoming = (consultations || []).filter(c => {
    const dt = getDateTime(c.consultation_date, c.consultation_time);
    return dt > now;
  });

  const handleEdit = (consultation: any) => {
    setEditModal({ isOpen: true, consultation });
  };

  const handleSave = (updatedConsultation: any) => {
    updateConsultation.mutate({
      id: updatedConsultation.id,
      consultation_date: updatedConsultation.consultation_date,
      consultation_time: updatedConsultation.consultation_time,
      consultation_type: updatedConsultation.consultation_type,
      status: updatedConsultation.status,
      notes: updatedConsultation.notes
    });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Randevular yükleniyor...</p>
      </div>
    );
  }

  if (upcoming.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <h3>Yaklaşan Randevu Yok</h3>
        <p>Bu danışan için henüz planlanmış bir randevu bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      <div className="consultations-grid">
        {upcoming.map((consultation) => {
          const isUrgent = shouldPlayNotification(consultation.consultation_date, consultation.consultation_time);
          
          return (
            <div key={consultation.id} className={`consultation-client-card ${isUrgent ? 'urgent-appointment' : ''}`}>
              <div className="card-header">
                <div className="date-info">
                  <div className="date-icon">📅</div>
                  <div className="date-details">
                    <div className="date">{formatDate(consultation.consultation_date)}</div>
                    <div className="day">{getDayOfWeek(consultation.consultation_date)}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleEdit(consultation)}
                  className="edit-btn"
                  title="Düzenle"
                >
                  ✏️
                </button>
              </div>
              <div className="card-content">
                <div className="time-info">
                  <span className="time-icon">🕐</span>
                  <span className="time">{formatTime(consultation.consultation_time)}</span>
                </div>
                <div className="type-info">
                  <span className="type-icon">🏥</span>
                  <span className="type">{getConsultationTypeText(consultation.consultation_type)}</span>
                </div>
                <div className="countdown-info">
                  <span className="countdown-icon">⏰</span>
                  <span className={`countdown-text ${isUrgent ? 'urgent' : ''}`}>
                    {getRemainingTime(consultation.consultation_date, consultation.consultation_time)}
                  </span>
                </div>
                {consultation.notes && (
                  <div className="notes-info">
                    <span className="notes-icon">📝</span>
                    <span className="notes">{consultation.notes.length > 50 ? consultation.notes.substring(0, 50) + '...' : consultation.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <EditConsultationModal
        consultation={editModal.consultation}
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, consultation: null })}
        onSave={handleSave}
      />
    </div>
  );
};

// Past Appointments Component
const PastAppointments: React.FC<{ clientId: number; clientName: string }> = ({ clientId, clientName }) => {
  const { data: consultations, isLoading, refetch } = trpc.consultations.getByClientId.useQuery({ client_id: clientId });
  
  const deleteConsultation = trpc.consultations.delete.useMutation({
    onSuccess: () => {
      refetch();
      toast.success('Görüşme başarıyla silindi!');
    },
    onError: (error) => {
      toast.error('Hata: ' + error.message);
    }
  });

  const [confirmModal, setConfirmModal] = useState({ isOpen: false, consultationId: null as number | null });

  const now = new Date();

  // Helper to combine date and time into a Date object
  const getDateTime = (date: string, time: string) => {
    return new Date(date.split('T')[0] + 'T' + time);
  };

  const past = (consultations || []).filter(c => {
    const dt = getDateTime(c.consultation_date, c.consultation_time);
    return dt <= now;
  });

  const handleDelete = (consultationId: number) => {
    setConfirmModal({ isOpen: true, consultationId: consultationId });
  };

  const confirmDelete = () => {
    if (confirmModal.consultationId) {
      deleteConsultation.mutate({ id: confirmModal.consultationId });
    }
    setConfirmModal({ isOpen: false, consultationId: null });
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Görüşmeler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="appointments-container">
      {past.length === 0 ? (
        <div className="empty-state">
         <div className="empty-icon">📋</div>
         <h3>Geçmiş Görüşme Yok</h3>
         <p>Bu danışan için henüz gerçekleşmiş bir görüşme bulunmuyor.</p>
       </div>
      ) : (
        <div className="consultations-grid">
          {past.map((consultation) => (
            <div key={consultation.id} className="consultation-client-card appointment-square-card">
              <button 
                className="delete-btn" 
                onClick={() => handleDelete(consultation.id)}
                title="Görüşmeyi Sil"
              >
                <Trash2 size={16} />
              </button>
              <div style={{fontWeight: 700, fontSize: 20, color: '#3b82f6', marginBottom: 2}}>{formatDate(consultation.consultation_date)}</div>
              <div style={{fontSize: 13, color: '#64748b', marginBottom: 2}}>{getDayOfWeek(consultation.consultation_date)} - {formatTime(consultation.consultation_time)}</div>
              <div style={{fontWeight: 600, fontSize: 15, color: '#374151', marginBottom: 2}}>{getConsultationTypeText(consultation.consultation_type)}</div>
              <span className={`appointment-status status-completed`} style={{margin: '8px 0'}}>
                Tamamlandı
              </span>
              {consultation.notes && (
                <div style={{fontSize: 14, color: '#6b7280', background: '#f8fafc', borderRadius: 8, padding: '8px 12px', marginTop: 4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {consultation.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, consultationId: null })}
        onConfirm={confirmDelete}
        title="Görüşmeyi Sil"
        message="Bu görüşmeyi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  );
};

// Edit Consultation Modal Component
const EditConsultationModal: React.FC<{
  consultation: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedConsultation: any) => void;
}> = ({ consultation, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    consultation_date: consultation?.consultation_date || '',
    consultation_time: consultation?.consultation_time || '',
    consultation_type: consultation?.consultation_type || 'initial',
    status: consultation?.status || 'scheduled',
    notes: consultation?.notes || ''
  });

  useEffect(() => {
    if (consultation) {
      setFormData({
        consultation_date: consultation.consultation_date,
        consultation_time: consultation.consultation_time,
        consultation_type: consultation.consultation_type,
        status: consultation.status,
        notes: consultation.notes
      });
    }
  }, [consultation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...consultation,
      ...formData
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Randevu Düzenle</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tarih:</label>
            <input
              type="date"
              value={formData.consultation_date}
              onChange={(e) => setFormData({...formData, consultation_date: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Saat:</label>
            <input
              type="time"
              value={formData.consultation_time}
              onChange={(e) => setFormData({...formData, consultation_time: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Tür:</label>
            <select
              value={formData.consultation_type}
              onChange={(e) => setFormData({...formData, consultation_type: e.target.value})}
            >
              <option value="initial">İlk Görüşme</option>
              <option value="follow-up">Takip Görüşmesi</option>
              <option value="emergency">Acil Görüşme</option>
              <option value="online">📹 Online Görüşme (Görüntülü)</option>
            </select>
            {formData.consultation_type === 'online' && (
              <div className="form-help">
                <p>✅ Online görüşme seçildi! Bu randevu "Görüntülü Görüşmeler" sayfasında görünecek ve video görüşmesi yapabileceksiniz.</p>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Durum:</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="scheduled">Planlandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notlar:</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              İptal
            </button>
            <button type="submit" className="btn-primary">
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to get next consultation for a client
const getNextConsultation = (consultations: any[]) => {
  if (!consultations || consultations.length === 0) return null;
  
  const now = new Date();
  const futureConsultations = consultations.filter(c => {
    const dt = new Date(c.consultation_date.split('T')[0] + 'T' + c.consultation_time);
    return dt > now;
  });
  
  if (futureConsultations.length === 0) return null;
  
  // Sort by date and time, get the earliest
  return futureConsultations.sort((a, b) => {
    const dtA = new Date(a.consultation_date.split('T')[0] + 'T' + a.consultation_time);
    const dtB = new Date(b.consultation_date.split('T')[0] + 'T' + b.consultation_time);
    return dtA.getTime() - dtB.getTime();
  })[0];
};

// Notification sound function
const playNotificationSound = () => {
  try {
    // Create audio context for notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Set sound properties
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Notification sound not supported');
  }
};

// Check if notification should be played
const shouldPlayNotification = (dateString: string, timeString: string) => {
  const now = new Date();
  const consultationDateTime = new Date(dateString.split('T')[0] + 'T' + timeString);
  const diffMs = consultationDateTime.getTime() - now.getTime();
  
  if (diffMs <= 0) return false;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  return diffMinutes <= 5 && diffMinutes > 0;
};

// Client Card with Next Consultation Countdown
const ClientCard: React.FC<{ 
  client: any; 
  onAppointmentsClick: (clientId: number, clientName: string) => void;
  onNewConsultationClick: (clientId: number, clientName: string) => void;
  onRecentConsultationsClick: (clientId: number, clientName: string) => void;
}> = ({ client, onAppointmentsClick, onNewConsultationClick, onRecentConsultationsClick }) => {
  const { data: consultations } = trpc.consultations.getByClientId.useQuery({ client_id: client.id });
  const [, setCountdown] = useState(0);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const nextConsultation = getNextConsultation(consultations || []);

  return (
    <div className="consultation-client-card">
      <div className="client-header">
        <h3 className="client-name">{client.name}</h3>
        <div className="next-consultation-info">
          {nextConsultation ? (
            <span className="next-consultation-countdown">
              ⏰ {getRemainingTime(nextConsultation.consultation_date, nextConsultation.consultation_time)}
            </span>
          ) : (
            <span className="no-upcoming-consultation">
              📅 Yaklaşan randevu yok
            </span>
          )}
        </div>
      </div>
      
      <div className="client-info">
        <ClientConsultationStats clientId={client.id} />
      </div>
      
      <div className="client-actions">
        <button 
          className="appointments-btn"
          onClick={() => onAppointmentsClick(client.id, client.name)}
        >
          🗓️ Randevularını Gör
        </button>
        
        <button 
          className="new-consultation-btn"
          onClick={() => onNewConsultationClick(client.id, client.name)}
        >
          ➕ Yeni Görüşme Ekle
        </button>
        
        <button 
          className="recent-consultations-btn"
          onClick={() => onRecentConsultationsClick(client.id, client.name)}
        >
          🧾 Son Görüşmeler
        </button>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

// Video Call Panel Content Component (Full Page)
const VideoCallPanelContent: React.FC<{ dietitianId: number }> = ({ dietitianId }) => {
  const { data: appointments, isLoading } = trpc.consultations.getVideoCalls.useQuery({ dietitianId });

  const formatTime = (timeString: string) => timeString;

  const getConsultationTypeText = (type: string) => {
    switch (type) {
      case 'initial': return 'İlk Görüşme';
      case 'follow_up': return 'Takip Görüşmesi';
      case 'online': return 'Online Görüşme';
      default: return type;
    }
  };

  const handleJoinCall = async (appointment: any) => {
    // Video call logic here
    console.log('Joining call for appointment:', appointment);
  };

  const getCallStatusText = (appointment: any) => {
    const now = new Date();
    const appointmentTime = new Date(`${appointment.consultation_date} ${appointment.consultation_time}`);
    const timeDiff = appointmentTime.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 0) {
      return <span style={{ color: '#ef4444' }}>⏰ Süresi dolmuş</span>;
    } else if (minutesDiff <= 15) {
      return <span style={{ color: '#f59e0b' }}>⏰ {minutesDiff} dakika kaldı</span>;
    } else {
      return <span style={{ color: '#10b981' }}>⏰ {Math.floor(minutesDiff / 60)} saat {minutesDiff % 60} dakika kaldı</span>;
    }
  };

  const getCallButtonText = (appointment: any) => {
    switch (appointment.status) {
      case 'scheduled': return 'Görüşmeye Katıl';
      case 'in_progress': return 'Görüşmede';
      case 'completed': return 'Tamamlandı';
      default: return 'Görüşmeye Katıl';
    }
  };

  const isCallButtonDisabled = (appointment: any) => {
    return appointment.status === 'completed';
  };

  if (isLoading) {
    return (
      <div className="video-call-loading">
        <div className="loading-spinner"></div>
        <p>Görüşmeler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="video-calls-container">
      {!appointments || appointments.length === 0 ? (
        <div className="video-call-empty">
          <div className="empty-icon">📹</div>
          <h3>Görüntülü Görüşme Yok</h3>
          <p>Bugün için görüntülü görüşmeniz bulunmamaktadır.</p>
          <div className="empty-help">
            <p>Görüntülü görüşme yapmak için:</p>
            <ol>
              <li>Danışanlarınızla yeni randevu oluşturun</li>
              <li>Görüşme türü olarak <strong>"Online Görüşme"</strong> seçin</li>
              <li>Randevu zamanı geldiğinde bu sayfada görünecektir</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="dpanel-video-grid">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="dpanel-video-card"
            >
              <div className="dpanel-video-card-header">
                <div className="dpanel-video-client-info">
                  <h4 className="dpanel-video-client-name">{appointment.client_name}</h4>
                  <div className="dpanel-video-details">
                    <div className="dpanel-video-detail-item">
                      <span role="img" aria-label="time">🕐</span>
                      <span>{formatTime(appointment.consultation_time)}</span>
                    </div>
                    <div className="dpanel-video-detail-item">
                      <span role="img" aria-label="type">🏥</span>
                      <span>{getConsultationTypeText(appointment.consultation_type)}</span>
                    </div>
                    <div className="dpanel-video-detail-item">
                      {getCallStatusText(appointment)}
                    </div>
                  </div>
                </div>
                <button
                  className={`dpanel-video-join-btn ${appointment.status === 'in_progress' ? 'active' : ''} ${appointment.status === 'completed' ? 'completed' : ''}`}
                  onClick={() => handleJoinCall(appointment)}
                  disabled={isCallButtonDisabled(appointment)}
                >
                  {getCallButtonText(appointment)}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
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
    
    if (clientId) {
      setSelectedClientId(parseInt(clientId));
      if (clientName) {
        setSelectedClientName(clientName);
      }
    }
  }, [location.search]);

  // URL'yi güncelle
  const updateURL = (tab: string, view?: string, clientId?: number, clientName?: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tab', tab);
    
    if (view) {
      searchParams.set('view', view);
    }
    
    if (clientId) {
      searchParams.set('clientId', clientId.toString());
      if (clientName) {
        searchParams.set('clientName', clientName);
      }
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  const handleSignOut = async () => {
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
  const handleClientDetail = (clientId: number, clientName?: string) => {
    setSelectedClientId(clientId);
    if (clientName) {
      setSelectedClientName(clientName);
    }
    setActiveTab('client-detail');
    updateURL('client-detail', undefined, clientId, clientName);
  };

  // Danışanlar listesine geri dön
  const handleBackToClients = () => {
    setSelectedClientId(null);
    setSelectedClientName('');
    setActiveTab('clients');
    // URL'den clientId ve clientName parametrelerini temizle
    const searchParams = new URLSearchParams();
    searchParams.set('tab', 'clients');
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  // Görüşme paneli handler'ları
  const handleOpenConsultations = (clientId: number, clientName: string) => {
    setSelectedClientForConsultations({ id: clientId, name: clientName });
    setIsConsultationsOpen(true);
  };

  const handleCloseConsultations = () => {
    setIsConsultationsOpen(false);
    setSelectedClientForConsultations(null);
  };

  const handleConsultationViewChange = (view: 'list' | 'appointments' | 'new' | 'recent') => {
    setConsultationView(view);
    updateURL('consultations', view, selectedClientId, selectedClientName);
  };

  // Client Card handlers
  const handleAppointmentsClick = (clientId: number, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleConsultationViewChange('appointments');
  };

  const handleNewConsultationClick = (clientId: number, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleConsultationViewChange('new');
  };

  const handleRecentConsultationsClick = (clientId: number, clientName: string) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleConsultationViewChange('recent');
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
          <div className="dashboard-home">
            <section>
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

            <section>
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

            <section>
              <h2>Yaklaşan Görüşmeler</h2>
              <div className="appointment-list">
                <div className="empty-state">
                  <i className="fas fa-calendar-times"></i>
                  <h3>Henüz görüşme yok</h3>
                  <p>Yeni görüşme eklemek için yukarıdaki "Görüşme Ekle" butonunu kullanın</p>
                </div>
              </div>
            </section>
          </div>
        );
      case 'new-client':
        return <CreateClientForm />;
      case 'clients':
        return <ClientsPage onClientDetail={handleClientDetail} />;
      case 'client-detail':
        return <ClientDetail clientId={selectedClientId} onBack={handleBackToClients} />;
      case 'consultations':
        return (
          <div className="consultations-page">
            {consultationView === 'list' && (
              <>
                <div className="page-header">
                  <h1>Görüşmeler</h1>
                </div>
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
                      <ClientCard
                        key={client.id}
                        client={client}
                        onAppointmentsClick={handleAppointmentsClick}
                        onNewConsultationClick={handleNewConsultationClick}
                        onRecentConsultationsClick={handleRecentConsultationsClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {consultationView === 'appointments' && selectedClientId && (
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

            {consultationView === 'new' && selectedClientId && (
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
                        <option value="online">📹 Online Görüşme (Görüntülü)</option>
                      </select>
                      {formData.type === 'online' && (
                        <div className="form-help">
                          <p>✅ Online görüşme seçildi! Bu randevu "Görüntülü Görüşmeler" sayfasında görünecek ve video görüşmesi yapabileceksiniz.</p>
                        </div>
                      )}
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

            {consultationView === 'recent' && selectedClientId && (
              <div className="consultation-detail-view">
                <div className="detail-header">
                  <h2>Son Görüşmeler</h2>
                  <p>Danışan: {selectedClientName}</p>
                </div>
                
                <div className="recent-consultations-content">
                  <PastAppointments clientId={selectedClientId} clientName={selectedClientName} />
                </div>
              </div>
            )}
          </div>
        );
      case 'video-calls':
        return (
          <div className="video-calls-page">
            <div className="page-header">
              <h1>Görüntülü Görüşmeler</h1>
            </div>
            <VideoCallPanelContent dietitianId={user.id} />
          </div>
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
            <a 
              href="#" 
              className={`nav-link ${activeTab === 'video-calls' ? 'active' : ''}`}
              onClick={(e) => { 
                e.preventDefault(); 
                setActiveTab('video-calls'); 
                updateURL('video-calls');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
              </svg>
              Görüntülü Görüşmeler
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
          <header className="topbar">
            <div className="user-info">
              <span className="greeting">
                {activeTab === 'consultations' && (
                  consultationView === 'appointments' ? `Randevular - ${selectedClientName}` :
                  consultationView === 'new' ? `Yeni Görüşme - ${selectedClientName}` :
                  consultationView === 'recent' ? `Son Görüşmeler - ${selectedClientName}` :
                  null
                )}
                {activeTab === 'new-client' && 'Yeni Danışan Ekle'}
                {activeTab === 'client-detail' && 'Danışan Detayları'}
              </span>
              {activeTab === 'consultations' && consultationView !== 'list' && (
                <button 
                  className="back-btn"
                  onClick={() => handleConsultationViewChange('list')}
                >
                  ← Geri
                </button>
              )}
            </div>
          </header>
          {renderContent()}
        </div>
      </div>

      {/* Toast */}
      {toast.isVisible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </>
  );
};

export default DietitianPanel; 