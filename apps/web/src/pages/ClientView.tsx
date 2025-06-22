import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { toast } from '../components/Toast';
import './ClientView.css';

const ClientView = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const clientId = id ? parseInt(id) : null;

  // Video görüşme modal state'i
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Danışan verilerini çek
  const { data: client, isLoading, error } = trpc.clients.getById.useQuery(
    { id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Diyetisyen bilgilerini çek
  const { data: dietitian } = trpc.users.getById.useQuery(
    { id: Number(client?.user_id) },
    { enabled: !!client?.user_id }
  );

  // Ölçümleri çek
  const { data: measurements, isLoading: measurementsLoading } = trpc.measurements.getByClientId.useQuery(
    { client_id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Yaklaşan randevuları çek
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = trpc.consultations.getByClientId.useQuery(
    { client_id: Number(clientId) },
    { enabled: !!clientId }
  );

  console.log('ClientView - clientId:', clientId);
  console.log('ClientView - appointments data:', appointments);
  console.log('ClientView - appointments loading:', appointmentsLoading);
  console.log('ClientView - appointments error:', appointmentsError);

  // Yaklaşan randevuları filtrele
  const upcomingAppointments = React.useMemo(() => {
    if (!appointments) return [];
    const now = new Date();
    console.log('ClientView - filtering appointments, total:', appointments.length);
    console.log('ClientView - current time:', now);
    
    const filtered = appointments
      .filter(appointment => {
        const appointmentDate = new Date(appointment.consultation_date);
        const appointmentTime = appointment.consultation_time;
        const [hours, minutes] = appointmentTime.split(':');
        appointmentDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        console.log('ClientView - appointment:', {
          id: appointment.id,
          date: appointment.consultation_date,
          time: appointment.consultation_time,
          type: appointment.consultation_type,
          status: appointment.status,
          appointmentDateTime: appointmentDate,
          isFuture: appointmentDate > now,
          isScheduled: appointment.status === 'scheduled'
        });
        
        return appointmentDate > now && appointment.status === 'scheduled';
      })
      .sort((a, b) => {
        const dateA = new Date(a.consultation_date + ' ' + a.consultation_time);
        const dateB = new Date(b.consultation_date + ' ' + b.consultation_time);
        return dateA.getTime() - dateB.getTime();
      });
    
    console.log('ClientView - filtered upcoming appointments:', filtered);
    return filtered;
  }, [appointments]);

  // En son ölçümü bul
  const latestMeasurement = React.useMemo(() => {
    if (!measurements || measurements.length === 0) return null;
    const sorted = [...measurements].sort((a, b) => 
      new Date(b.measured_at as string).getTime() - new Date(a.measured_at as string).getTime()
    );
    return sorted[0];
  }, [measurements]);

  // Yaş hesaplama
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

  // BMI hesaplama
  const calculateBMI = (weight: number, height: number) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Görüntülü görüşmeye katıl
  const handleJoinVideoCall = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsVideoModalOpen(true);
  };

  // Video modal'ı kapat
  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedAppointment(null);
  };

  // Randevu formatı
  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(date);
    const day = appointmentDate.toLocaleDateString('tr-TR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    return `${day} - ${time}`;
  };

  // Görüşme türü metni
  const getConsultationTypeText = (type: string) => {
    const types: Record<string, string> = {
      'initial': 'İlk Görüşme',
      'follow-up': 'Takip Görüşmesi',
      'emergency': 'Acil Görüşme',
      'online': 'Online Görüşme'
    };
    return types[type] || type;
  };

  if (!clientId) {
    return (
      <div className="client-view-page">
        <div className="error-state">
          <h3>Danışan ID'si bulunamadı</h3>
          <p>Lütfen geçerli bir danışan seçin.</p>
        </div>
      </div>
    );
  }

  if (isLoading || appointmentsLoading) {
    return (
      <div className="client-view-page">
        <div className="loading-state">
          <h3>Bilgiler yükleniyor...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="client-view-page">
        <div className="error-state">
          <h3>Hata oluştu</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="client-view-page">
        <div className="error-state">
          <h3>Danışan bulunamadı</h3>
          <p>Belirtilen ID'ye sahip danışan bulunamadı.</p>
        </div>
      </div>
    );
  }

  const age = client.birth_date ? calculateAge(client.birth_date) : null;
  const currentWeight = latestMeasurement?.weight_kg;
  const bmi = currentWeight && client.height_cm ? calculateBMI(currentWeight, client.height_cm) : null;

  return (
    <div className="client-view-page">
      <div className="container">
        <div className="header">
          <h1>Danışan Bilgileri</h1>
          <p>Hoş geldiniz, {client.name}</p>
        </div>

        <div className="info-grid">
          {/* Temel Bilgiler */}
          <div className="info-section">
            <h2>👤 Temel Bilgiler</h2>
            <div className="info-items">
              <div className="info-item">
                <span className="label">Ad Soyad:</span>
                <span className="value">{client.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Cinsiyet:</span>
                <span className="value">
                  {client.gender === 'Female' ? 'Kadın' : client.gender === 'Male' ? 'Erkek' : 'Diğer'}
                </span>
              </div>
              {age && (
                <div className="info-item">
                  <span className="label">Yaş:</span>
                  <span className="value">{age} yaş</span>
                </div>
              )}
              <div className="info-item">
                <span className="label">Boy:</span>
                <span className="value">{client.height_cm} cm</span>
              </div>
            </div>
          </div>

          {/* Fiziksel Özellikler */}
          <div className="info-section">
            <h2>📏 Fiziksel Özellikler</h2>
            <div className="info-items">
              <div className="info-item">
                <span className="label">Güncel Kilo:</span>
                <span className="value">
                  {currentWeight ? `${currentWeight} kg` : 'Henüz ölçüm yapılmadı'}
                </span>
              </div>
              {bmi && (
                <div className="info-item">
                  <span className="label">BMI:</span>
                  <span className="value">{bmi}</span>
                </div>
              )}
            </div>
          </div>

          {/* Yaklaşan Randevular */}
          <div className="info-section">
            <h2>📅 Yaklaşan Randevular</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="appointments-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-item">
                    <div className="appointment-info">
                      <div className="appointment-date">
                        {formatDateTime(appointment.consultation_date, appointment.consultation_time)}
                      </div>
                      <div className="appointment-type">
                        {getConsultationTypeText(appointment.consultation_type)}
                      </div>
                      {appointment.notes && (
                        <div className="appointment-notes">
                          Not: {appointment.notes}
                        </div>
                      )}
                    </div>
                    {appointment.consultation_type === 'online' && (
                      <button 
                        className="join-video-btn"
                        onClick={() => handleJoinVideoCall(appointment)}
                      >
                        📹 Görüntülü Görüşmeye Katıl
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-appointments">
                <p>Yaklaşan randevunuz bulunmuyor.</p>
              </div>
            )}
          </div>

          {/* Diyetisyen Bilgileri */}
          {dietitian && (
            <div className="info-section">
              <h2>👨‍⚕️ Diyetisyen Bilgileri</h2>
              <div className="info-items">
                <div className="info-item">
                  <span className="label">Diyetisyen:</span>
                  <span className="value">
                    {dietitian.first_name && dietitian.last_name 
                      ? `${dietitian.first_name} ${dietitian.last_name}`
                      : dietitian.email || 'Bilinmiyor'
                    }
                  </span>
                </div>
                {dietitian.email && (
                  <div className="info-item">
                    <span className="label">Diyetisyen E-posta:</span>
                    <span className="value">{dietitian.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="actions">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            Geri Dön
          </button>
        </div>
      </div>

      {/* Video Görüşme Modal */}
      {isVideoModalOpen && selectedAppointment && (
        <div className="video-modal-overlay" onClick={handleCloseVideoModal}>
          <div className="video-modal" onClick={(e) => e.stopPropagation()}>
            <div className="video-modal-header">
              <h3>📹 Görüntülü Görüşme</h3>
              <button className="close-modal-btn" onClick={handleCloseVideoModal}>
                ✕
              </button>
            </div>
            <div className="video-modal-content">
              <div className="video-info">
                <p><strong>Randevu:</strong> {formatDateTime(selectedAppointment.consultation_date, selectedAppointment.consultation_time)}</p>
                <p><strong>Tür:</strong> {getConsultationTypeText(selectedAppointment.consultation_type)}</p>
                {selectedAppointment.notes && (
                  <p><strong>Not:</strong> {selectedAppointment.notes}</p>
                )}
              </div>
              <div className="video-placeholder">
                <div className="video-icon">📹</div>
                <p>Video görüşme başlatılıyor...</p>
                <p className="video-room">Oda: room_{selectedAppointment.id}_{selectedAppointment.client_id}</p>
              </div>
              <div className="video-actions">
                <button className="start-video-btn">
                  🎥 Görüşmeyi Başlat
                </button>
                <button className="cancel-video-btn" onClick={handleCloseVideoModal}>
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientView; 