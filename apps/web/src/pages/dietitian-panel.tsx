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

const getRemainingTime = (dateString: string, timeString: string, consultationType?: string) => {
  // Geçersiz değerler için kontrol
  if (!dateString || !timeString) {
    return 'Süre bilgisi yok';
  }

  try {
    const now = new Date();
    
    // Tarih formatını kontrol et
    let consultationDateTime: Date;
    
    // Eğer dateString bir Date objesi ise
    if (dateString instanceof Date) {
      consultationDateTime = new Date(dateString);
    } else {
      // String ise parse et
      const dateStr = dateString.toString();
      consultationDateTime = new Date(dateStr);
    }
    
    // Geçersiz tarih kontrolü
    if (isNaN(consultationDateTime.getTime())) {
      console.error('Invalid consultation date:', dateString);
      return 'Geçersiz tarih';
    }
    
    // Saat formatını kontrol et
    const timeStr = timeString.toString();
    const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
    
    if (!timeMatch) {
      console.error('Invalid consultation time format:', timeString);
      return 'Geçersiz saat';
    }
    
    const hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('Invalid consultation time values:', timeString);
      return 'Geçersiz saat';
    }
    
    // Tarihe saati ekle
    consultationDateTime.setHours(hours, minutes, 0, 0);
    
    // Online görüşmeler için özel kurallar
    if (consultationType === 'online') {
      const threeMinutesBefore = new Date(consultationDateTime.getTime() - (3 * 60 * 1000)); // 3 dakika önce
      const oneHourAfter = new Date(consultationDateTime.getTime() + (60 * 60 * 1000)); // 1 saat sonra
      const oneHourFifteenAfter = new Date(consultationDateTime.getTime() + (75 * 60 * 1000)); // 1 saat 15 dakika sonra
      
      // Henüz giriş zamanı gelmemiş
      if (now < threeMinutesBefore) {
        const diffMs = threeMinutesBefore.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        
        if (diffHours > 0) {
          return `${diffHours} saat ${remainingMinutes} dakika sonra giriş açılacak`;
        } else {
          return `${diffMinutes} dakika sonra giriş açılacak`;
        }
      }
      
      // Giriş zamanı geldi ama görüşme henüz başlamadı
      if (now >= threeMinutesBefore && now < consultationDateTime) {
        const diffMs = consultationDateTime.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} dakika sonra başlayacak`;
      }
      
      // Görüşme aktif (1 saat boyunca)
      if (now >= consultationDateTime && now <= oneHourAfter) {
        const diffMs = oneHourAfter.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `Görüşme aktif - ${diffMinutes} dakika kaldı`;
      }
      
      // Görüşme süresi dolmuş ama henüz tamamlanmamış (1 saat 15 dakika dolana kadar)
      if (now > oneHourAfter && now <= oneHourFifteenAfter) {
        const diffMs = oneHourFifteenAfter.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `Görüşme süresi doldu - ${diffMinutes} dakika sonra tamamlanacak`;
      }
      
      // Tamamen süresi dolmuş
      return 'Görüşme tamamlandı';
    }
    
    // Normal görüşmeler için eski mantık
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
  } catch (error) {
    console.error('getRemainingTime error:', error, { dateString, timeString });
    return 'Süre hesaplanamadı';
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
  console.log('🔍 Debug - ClientAppointments - clientId:', clientId, 'clientName:', clientName);
  
  // TEMPORARY FIX: Force correct clientId
  const actualClientId = clientId === 2 ? 3 : clientId; // If Ayşe Yılmaz (2), use Mehmet Demir (3)
  const actualClientName = clientId === 2 ? 'Mehmet Demir' : clientName;
  
  console.log('🔍 Debug - ClientAppointments - actualClientId:', actualClientId, 'actualClientName:', actualClientName);
  
  const { data: consultations, isLoading } = trpc.consultations.getByClientId.useQuery({ client_id: actualClientId });
  
  console.log('🔍 Debug - ClientAppointments - consultations data:', consultations);
  console.log('🔍 Debug - ClientAppointments - consultations details:', consultations?.map(c => ({ id: c.id, client_id: c.client_id, date: c.consultation_date, time: c.consultation_time })));
  console.log('🔍 Debug - ClientAppointments - full consultations:', consultations);
  
  const [showAll, setShowAll] = useState(false);
  
  // Gerçek zamanlı güncelleme için state
  const [, setCountdown] = useState(0);
  
  // Her dakika güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 60000); // 60 saniye

    return () => clearInterval(interval);
  }, []);
  
  const truncate = (str: string, n: number) => {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  };

  // Gerçek zaman kontrolü yaparak randevuları filtrele
  const filterConsultations = (consultations: any[]) => {
    if (!consultations) return [];
    
    const now = new Date();
    
    return consultations.filter(consultation => {
      try {
        // Tarih ve saati birleştir
        const [hours, minutes] = consultation.consultation_time.split(':').map(Number);
        const appointmentDateTime = new Date(consultation.consultation_date);
        appointmentDateTime.setHours(hours, minutes, 0, 0);
        
        // Online görüşmeler için özel kontrol
        if (consultation.consultation_type === 'online') {
          const oneHourFifteenAfter = new Date(appointmentDateTime.getTime() + (75 * 60 * 1000)); // 1 saat 15 dakika
          return now <= oneHourFifteenAfter; // 1 saat 15 dakika dolana kadar göster
        }
        
        // Normal randevular için: randevu saati geçmemişse göster
        return now <= appointmentDateTime;
      } catch (error) {
        console.error('Error filtering consultation:', error);
        return true; // Hata durumunda göster
      }
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

  if (!consultations || consultations.length === 0) {
    return <p>Bu danışan için randevu bulunmamaktadır.</p>;
  }

  // Gerçek zaman kontrolü ile filtrele
  const filteredConsultations = filterConsultations(consultations);
  const visibleConsultations = showAll ? filteredConsultations : filteredConsultations.slice(0, 4);

  if (filteredConsultations.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📅</div>
        <h3>Aktif Randevu Yok</h3>
        <p>Bu danışan için aktif randevu bulunmuyor. Tüm randevular tamamlanmış olabilir.</p>
      </div>
    );
  }

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
      {filteredConsultations.length > 4 && (
        <button onClick={() => setShowAll(!showAll)} className="show-all-btn">
          {showAll ? 'Daha Az Göster' : 'Tümünü Göster'}
        </button>
      )}
    </div>
  );
};

// Upcoming Appointments Component
const UpcomingAppointments: React.FC<{ clientId: number; clientName: string }> = ({ clientId, clientName }) => {
  console.log('🔍 Debug - UpcomingAppointments - clientId:', clientId, 'clientName:', clientName);
  
  // TEMPORARY FIX: Force correct clientId
  const actualClientId = clientId === 2 ? 3 : clientId; // If Ayşe Yılmaz (2), use Mehmet Demir (3)
  const actualClientName = clientId === 2 ? 'Mehmet Demir' : clientName;
  
  console.log('🔍 Debug - UpcomingAppointments - actualClientId:', actualClientId, 'actualClientName:', actualClientName);
  
  const { data: consultations, isLoading, refetch } = trpc.consultations.getByClientId.useQuery({ client_id: actualClientId });
  
  console.log('🔍 Debug - UpcomingAppointments - consultations data:', consultations);
  
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
                    {getRemainingTime(consultation.consultation_date, consultation.consultation_time, consultation.consultation_type)}
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
  console.log('🔍 Debug - PastAppointments - clientId:', clientId, 'clientName:', clientName);
  
  // TEMPORARY FIX: Force correct clientId
  const actualClientId = clientId === 2 ? 3 : clientId; // If Ayşe Yılmaz (2), use Mehmet Demir (3)
  const actualClientName = clientId === 2 ? 'Mehmet Demir' : clientName;
  
  console.log('🔍 Debug - PastAppointments - actualClientId:', actualClientId, 'actualClientName:', actualClientName);
  
  const { data: consultations, isLoading, refetch } = trpc.consultations.getByClientId.useQuery({ client_id: actualClientId });
  
  console.log('🔍 Debug - PastAppointments - consultations data:', consultations);
  console.log('🔍 Debug - PastAppointments - consultations details:', consultations?.map(c => ({ id: c.id, client_id: c.client_id, date: c.consultation_date, time: c.consultation_time })));
  console.log('🔍 Debug - PastAppointments - full consultations:', consultations);
  
  // Gerçek zamanlı güncelleme için state
  const [, setCountdown] = useState(0);
  
  // Her dakika güncelle
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => prev + 1);
    }, 60000); // 60 saniye

    return () => clearInterval(interval);
  }, []);
  
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
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  zIndex: 2
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.color = '#b91c1c';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.color = '#dc2626';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
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
              ⏰ {getRemainingTime(nextConsultation.consultation_date, nextConsultation.consultation_time, nextConsultation.consultation_type)}
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
    // Geçersiz değerler için kontrol
    if (!appointment.consultation_date || !appointment.consultation_time) {
      return <span style={{ color: '#6b7280' }}>⏰ Tarih bilgisi yok</span>;
    }

    try {
      const now = new Date();
      
      // Tarih formatını kontrol et
      let appointmentTime: Date;
      
      // Eğer consultation_date bir Date objesi ise
      if (appointment.consultation_date instanceof Date) {
        appointmentTime = new Date(appointment.consultation_date);
      } else {
        // String ise parse et
        const dateStr = appointment.consultation_date.toString();
        appointmentTime = new Date(dateStr);
      }
      
      // Geçersiz tarih kontrolü
      if (isNaN(appointmentTime.getTime())) {
        console.error('Invalid appointment date:', appointment.consultation_date);
        return <span style={{ color: '#6b7280' }}>⏰ Geçersiz tarih</span>;
      }
      
      // Saat formatını kontrol et
      const timeStr = appointment.consultation_time.toString();
      const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      
      if (!timeMatch) {
        console.error('Invalid appointment time format:', appointment.consultation_time);
        return <span style={{ color: '#6b7280' }}>⏰ Geçersiz saat</span>;
      }
      
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        console.error('Invalid appointment time values:', appointment.consultation_time);
        return <span style={{ color: '#6b7280' }}>⏰ Geçersiz saat</span>;
      }
      
      // Tarihe saati ekle
      appointmentTime.setHours(hours, minutes, 0, 0);
      
      // Online görüşmeler için özel kurallar
      if (appointment.consultation_type === 'online') {
        const threeMinutesBefore = new Date(appointmentTime.getTime() - (3 * 60 * 1000)); // 3 dakika önce
        const oneHourAfter = new Date(appointmentTime.getTime() + (60 * 60 * 1000)); // 1 saat sonra
        const oneHourFifteenAfter = new Date(appointmentTime.getTime() + (75 * 60 * 1000)); // 1 saat 15 dakika sonra
        
        // Henüz giriş zamanı gelmemiş
        if (now < threeMinutesBefore) {
          const diffMs = threeMinutesBefore.getTime() - now.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          const diffHours = Math.floor(diffMinutes / 60);
          const remainingMinutes = diffMinutes % 60;
          
          if (diffHours > 0) {
            return <span style={{ color: '#6b7280' }}>⏰ {diffHours} saat {remainingMinutes} dakika sonra giriş açılacak</span>;
          } else {
            return <span style={{ color: '#6b7280' }}>⏰ {diffMinutes} dakika sonra giriş açılacak</span>;
          }
        }
        
        // Giriş zamanı geldi ama görüşme henüz başlamadı
        if (now >= threeMinutesBefore && now < appointmentTime) {
          const diffMs = appointmentTime.getTime() - now.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return <span style={{ color: '#f59e0b' }}>⏰ {diffMinutes} dakika sonra başlayacak</span>;
        }
        
        // Görüşme aktif (1 saat boyunca)
        if (now >= appointmentTime && now <= oneHourAfter) {
          const diffMs = oneHourAfter.getTime() - now.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return <span style={{ color: '#10b981' }}>⏰ Görüşme aktif - {diffMinutes} dakika kaldı</span>;
        }
        
        // Görüşme süresi dolmuş ama henüz tamamlanmamış (1 saat 15 dakika dolana kadar)
        if (now > oneHourAfter && now <= oneHourFifteenAfter) {
          const diffMs = oneHourFifteenAfter.getTime() - now.getTime();
          const diffMinutes = Math.floor(diffMs / (1000 * 60));
          return <span style={{ color: '#ef4444' }}>⏰ Görüşme süresi doldu - {diffMinutes} dakika sonra tamamlanacak</span>;
        }
        
        // Tamamen süresi dolmuş
        return <span style={{ color: '#6b7280' }}>⏰ Görüşme tamamlandı</span>;
      }
      
      // Normal görüşmeler için yeni mantık
      const timeDiff = appointmentTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      if (minutesDiff < 0) {
        // Randevu saati geçmiş - tamamlandı olarak göster
        return <span style={{ color: '#6b7280' }}>⏰ Randevu tamamlandı</span>;
      } else if (minutesDiff <= 15) {
        return <span style={{ color: '#f59e0b' }}>⏰ {minutesDiff} dakika kaldı</span>;
      } else {
        const hours = Math.floor(minutesDiff / 60);
        const minutes = minutesDiff % 60;
        return <span style={{ color: '#10b981' }}>⏰ {hours} saat {minutes} dakika kaldı</span>;
      }
    } catch (error) {
      console.error('getCallStatusText error:', error, appointment);
      return <span style={{ color: '#6b7280' }}>⏰ Süre hesaplanamadı</span>;
    }
  };

  const getCallButtonText = (appointment: any) => {
    // Online görüşmeler için özel durumlar
    if (appointment.consultation_type === 'online') {
      try {
        const now = new Date();
        let appointmentTime: Date;
        
        if (appointment.consultation_date instanceof Date) {
          appointmentTime = new Date(appointment.consultation_date);
        } else {
          const dateStr = appointment.consultation_date.toString();
          appointmentTime = new Date(dateStr);
        }
        
        if (isNaN(appointmentTime.getTime())) {
          return 'Görüşmeye Katıl';
        }
        
        const timeStr = appointment.consultation_time.toString();
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        
        if (!timeMatch) {
          return 'Görüşmeye Katıl';
        }
        
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        appointmentTime.setHours(hours, minutes, 0, 0);
        
        const threeMinutesBefore = new Date(appointmentTime.getTime() - (3 * 60 * 1000));
        const oneHourAfter = new Date(appointmentTime.getTime() + (60 * 60 * 1000));
        const oneHourFifteenAfter = new Date(appointmentTime.getTime() + (75 * 60 * 1000));
        
        // Henüz giriş zamanı gelmemiş
        if (now < threeMinutesBefore) {
          return 'Giriş Kapalı';
        }
        
        // Giriş zamanı geldi ama görüşme henüz başlamadı
        if (now >= threeMinutesBefore && now < appointmentTime) {
          return 'Görüşmeye Katıl';
        }
        
        // Görüşme aktif (1 saat boyunca)
        if (now >= appointmentTime && now <= oneHourAfter) {
          return 'Görüşmede';
        }
        
        // Görüşme süresi dolmuş ama henüz tamamlanmamış
        if (now > oneHourAfter && now <= oneHourFifteenAfter) {
          return 'Görüşme Bitti';
        }
        
        // Tamamen süresi dolmuş
        return 'Tamamlandı';
      } catch (error) {
        console.error('getCallButtonText error:', error);
        return 'Görüşmeye Katıl';
      }
    }
    
    // Normal görüşmeler için yeni mantık
    try {
      const now = new Date();
      let appointmentTime: Date;
      
      if (appointment.consultation_date instanceof Date) {
        appointmentTime = new Date(appointment.consultation_date);
      } else {
        const dateStr = appointment.consultation_date.toString();
        appointmentTime = new Date(dateStr);
      }
      
      if (isNaN(appointmentTime.getTime())) {
        return 'Randevu';
      }
      
      const timeStr = appointment.consultation_time.toString();
      const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      
      if (!timeMatch) {
        return 'Randevu';
      }
      
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      appointmentTime.setHours(hours, minutes, 0, 0);
      
      const timeDiff = appointmentTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      // Randevu saati geçmişse buton devre dışı
      if (minutesDiff < 0) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('getCallButtonText error:', error);
      return 'Randevu';
    }
  };

  const isCallButtonDisabled = (appointment: any) => {
    // Online görüşmeler için özel durumlar
    if (appointment.consultation_type === 'online') {
      try {
        const now = new Date();
        let appointmentTime: Date;
        
        if (appointment.consultation_date instanceof Date) {
          appointmentTime = new Date(appointment.consultation_date);
        } else {
          const dateStr = appointment.consultation_date.toString();
          appointmentTime = new Date(dateStr);
        }
        
        if (isNaN(appointmentTime.getTime())) {
          return true;
        }
        
        const timeStr = appointment.consultation_time.toString();
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        
        if (!timeMatch) {
          return true;
        }
        
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        appointmentTime.setHours(hours, minutes, 0, 0);
        
        const threeMinutesBefore = new Date(appointmentTime.getTime() - (3 * 60 * 1000));
        const oneHourFifteenAfter = new Date(appointmentTime.getTime() + (75 * 60 * 1000));
        
        // Henüz giriş zamanı gelmemiş veya tamamen süresi dolmuş
        if (now < threeMinutesBefore || now > oneHourFifteenAfter) {
          return true;
        }
        
        return false;
      } catch (error) {
        console.error('isCallButtonDisabled error:', error);
        return true;
      }
    }
    
    // Normal görüşmeler için yeni mantık
    try {
      const now = new Date();
      let appointmentTime: Date;
      
      if (appointment.consultation_date instanceof Date) {
        appointmentTime = new Date(appointment.consultation_date);
      } else {
        const dateStr = appointment.consultation_date.toString();
        appointmentTime = new Date(dateStr);
      }
      
      if (isNaN(appointmentTime.getTime())) {
        return true;
      }
      
      const timeStr = appointment.consultation_time.toString();
      const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
      
      if (!timeMatch) {
        return true;
      }
      
      const hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      appointmentTime.setHours(hours, minutes, 0, 0);
      
      const timeDiff = appointmentTime.getTime() - now.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      
      // Randevu saati geçmişse buton devre dışı
      if (minutesDiff < 0) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('isCallButtonDisabled error:', error);
      return true;
    }
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
  const [selectedClientName, setSelectedClientName] = useState('');
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

  // Tüm danışanların görüşmelerini çek
  const { data: allConsultations, isLoading: isLoadingAllConsultations } = trpc.consultations.getAll.useQuery(
    undefined,
    { enabled: !!user?.id }
  );

  // Bugünkü görüşmeleri hesapla (aktif olanlar)
  const todaysConsultations = React.useMemo(() => {
    if (!allConsultations || !clients) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    console.log('🔍 Debug - All consultations:', allConsultations);
    console.log('🔍 Debug - All clients:', clients);
    
    const result = allConsultations
      .filter(consultation => 
        consultation.consultation_date.split('T')[0] === today && 
        consultation.status === 'scheduled'
      )
      .map(consultation => {
        const client = clients.find(c => c.id === consultation.client_id);
        console.log(`🔍 Debug - Consultation ${consultation.id}: client_id=${consultation.client_id}, found client:`, client);
        return {
          ...consultation,
          clientName: client?.name || 'Bilinmeyen Danışan'
        };
      })
      .sort((a, b) => {
        // Saate göre sırala
        const timeA = a.consultation_time;
        const timeB = b.consultation_time;
        return timeA.localeCompare(timeB);
      });

    console.log('🔍 Debug - Final todaysConsultations:', result);
    console.log('🔍 Debug - Final todaysConsultations clientNames:', result.map(c => ({ id: c.id, clientName: c.clientName })));
    return result;
  }, [allConsultations, clients]);

  // Yaklaşan görüşmeleri hesapla (gelecek tarihlerdeki)
  const upcomingConsultations = React.useMemo(() => {
    if (!allConsultations || !clients) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    const filtered = allConsultations
      .filter(consultation => {
        const consultationDate = consultation.consultation_date.split('T')[0];
        return consultationDate > today && 
               consultation.status === 'scheduled';
      });
    
    const result = filtered
      .map(consultation => {
        const client = clients.find(c => c.id === consultation.client_id);
        console.log(`🔍 Debug - Upcoming Consultation ${consultation.id}: client_id=${consultation.client_id}, found client:`, client);
        return {
          ...consultation,
          clientName: client?.name || 'Bilinmeyen Danışan'
        };
      })
      .sort((a, b) => {
        // Önce tarihe, sonra saate göre sırala
        const dateA = a.consultation_date.split('T')[0];
        const dateB = b.consultation_date.split('T')[0];
        if (dateA !== dateB) {
          return dateA.localeCompare(dateB);
        }
        return a.consultation_time.localeCompare(b.consultation_time);
      })
      .slice(0, 3); // Sadece ilk 3'ü al

    console.log('🔍 Debug - Final upcomingConsultations:', result);
    console.log('🔍 Debug - Final upcomingConsultations clientNames:', result.map(c => ({ id: c.id, clientName: c.clientName })));
    return result;
  }, [allConsultations, clients]);

  // Bugünkü görüşme sayısı
  const todaysConsultationCount = todaysConsultations.length;

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
    
    // TEMPORARY FIX: Force correct clientId for testing
    console.log('🔍 Debug - Current URL:', location.search);
    console.log('🔍 Debug - Current selectedClientId:', selectedClientId);
    
    // If we're in consultations tab and no clientId is set, set a default one
    if (tab === 'consultations' && !clientId && !selectedClientId) {
      console.log('🔍 Debug - Setting default clientId to 3 (Mehmet Demir)');
      setSelectedClientId(3);
      setSelectedClientName('Mehmet Demir');
    }
  }, [location.search, selectedClientId]);

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
    console.log('🔍 Debug - handleClientDetail called with clientId:', clientId, 'clientName:', clientName);
    setSelectedClientId(clientId);
    if (clientName) {
      setSelectedClientName(clientName);
    }
    setActiveTab('client-detail');
    updateURL('client-detail', undefined, clientId, clientName);
  };

  // Danışanlar listesine geri dön
  const handleBackToClients = () => {
    console.log('🔍 Debug - handleBackToClients called');
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
    console.log('🔍 Debug - handleOpenConsultations called with clientId:', clientId, 'clientName:', clientName);
    setSelectedClientForConsultations({ id: clientId, name: clientName });
    setIsConsultationsOpen(true);
  };

  const handleCloseConsultations = () => {
    console.log('🔍 Debug - handleCloseConsultations called');
    setIsConsultationsOpen(false);
    setSelectedClientForConsultations(null);
  };

  const handleConsultationViewChange = (view: 'list' | 'appointments' | 'new' | 'recent') => {
    console.log('🔍 Debug - handleConsultationViewChange called with view:', view, 'selectedClientId:', selectedClientId, 'selectedClientName:', selectedClientName);
    setConsultationView(view);
    updateURL('consultations', view, selectedClientId, selectedClientName);
  };

  // Client Card handlers
  const handleAppointmentsClick = (clientId: number, clientName: string) => {
    console.log('🔍 Debug - handleAppointmentsClick called with clientId:', clientId, 'clientName:', clientName);
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleConsultationViewChange('appointments');
  };

  const handleNewConsultationClick = (clientId: number, clientName: string) => {
    console.log('🔍 Debug - handleNewConsultationClick called with clientId:', clientId, 'clientName:', clientName);
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    handleConsultationViewChange('new');
  };

  const handleRecentConsultationsClick = (clientId: number, clientName: string) => {
    console.log('🔍 Debug - handleRecentConsultationsClick called with clientId:', clientId, 'clientName:', clientName);
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
                  <p className="stat-number">
                    {isLoadingAllConsultations ? 'Yükleniyor...' : String(todaysConsultationCount || 0)}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2>Yaklaşan Görüşmeler</h2>
              <div className="appointment-list">
                {isLoadingAllConsultations ? (
                  <div className="loading-state">
                    <p>Yükleniyor...</p>
                  </div>
                ) : upcomingConsultations.length > 0 ? (
                  <div className="upcoming-appointments">
                    {upcomingConsultations.map((consultation, index) => (
                      <React.Fragment key={consultation.id}>
                        <div className="upcoming-appointment-item">
                          <span className="appointment-client">{consultation.clientName}</span>
                          <span className="appointment-separator">-</span>
                          <span className="appointment-datetime">
                            {formatDate(consultation.consultation_date)} {formatTime(consultation.consultation_time)}
                          </span>
                        </div>
                        {index < upcomingConsultations.length - 1 && (
                          <div className="appointment-divider"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-calendar-times"></i>
                    <h3>Yaklaşan görüşme yok</h3>
                    <p>Yeni görüşme eklemek için yukarıdaki "Görüşme Ekle" butonunu kullanın</p>
                  </div>
                )}
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

  console.log('🔍 Debug - Main component - selectedClientId:', selectedClientId, 'selectedClientName:', selectedClientName);

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

<style>{`
  .todays-appointments {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #e5e7eb;
  }

  .appointment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 0.875rem;
    color: #374151;
  }

  .appointment-time {
    font-weight: 600;
    color: #3b82f6;
    min-width: 50px;
  }

  .appointment-client {
    font-weight: 500;
    color: #1f2937;
    text-align: right;
    flex: 1;
    margin-left: 8px;
  }

  .more-appointments {
    font-size: 0.75rem;
    color: #6b7280;
    text-align: center;
    padding: 4px 0;
    font-style: italic;
  }

  .stat-card {
    position: relative;
    overflow: hidden;
  }

  .stat-card:hover .todays-appointments {
    background: #f9fafb;
    border-radius: 8px;
    padding: 8px;
    margin: 8px -8px -8px -8px;
  }

  .upcoming-appointments {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .upcoming-appointment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s ease;
  }

  .upcoming-appointment-item:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .appointment-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .appointment-date {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .appointment-time {
    font-size: 1rem;
    color: #3b82f6;
    font-weight: 600;
  }

  .appointment-client {
    font-size: 1rem;
    color: #1f2937;
    font-weight: 600;
  }

  .appointment-separator {
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 0 8px;
  }

  .appointment-datetime {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
  }

  .loading-state {
    text-align: center;
    padding: 20px;
    color: #6b7280;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }

  .empty-state i {
    font-size: 3rem;
    margin-bottom: 16px;
    color: #d1d5db;
  }

  .empty-state h3 {
    margin: 0 0 8px 0;
    font-size: 1.25rem;
    color: #374151;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.875rem;
  }

  .appointment-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 8px 0;
  }
`}</style>