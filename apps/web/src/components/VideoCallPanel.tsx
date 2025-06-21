import React, { useState, useEffect } from 'react';
import { trpc } from '../utils/trpc';
import './VideoCallPanel.css';

interface VideoCallPanelProps {
  isOpen: boolean;
  onClose: () => void;
  dietitianId: number;
}

interface VideoAppointment {
  id: number;
  client_name: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
  room_id: string;
}

const VideoCallPanel: React.FC<VideoCallPanelProps> = ({ isOpen, onClose, dietitianId }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<VideoAppointment | null>(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // Fetch video-enabled appointments for today
  const { data: appointments, isLoading } = trpc.consultations.getVideoAppointments.useQuery({
    dietitian_id: dietitianId,
    date: new Date().toISOString().split('T')[0]
  });

  const formatTime = (timeString: string) => {
    return timeString;
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

  const handleJoinCall = (appointment: VideoAppointment) => {
    setSelectedAppointment(appointment);
    setIsVideoVisible(true);
  };

  const handleLeaveCall = () => {
    setIsVideoVisible(false);
    setSelectedAppointment(null);
  };

  const generateRoomId = (appointment: VideoAppointment) => {
    return `dietkem-${appointment.client_name.toLowerCase().replace(/\s+/g, '')}-${appointment.id}`;
  };

  if (!isOpen) return null;

  return (
    <div className="video-call-panel-overlay">
      <div className="video-call-panel">
        {/* Header */}
        <div className="video-call-panel-header">
          <h2>Görüntülü Görüşmeler</h2>
          <button onClick={onClose} className="video-call-panel-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="video-call-panel-content">
          {isLoading ? (
            <div className="video-call-loading">
              <div className="loading-spinner"></div>
              <p>Görüşmeler yükleniyor...</p>
            </div>
          ) : !appointments || appointments.length === 0 ? (
            <div className="video-call-empty">
              <div className="empty-icon">📹</div>
              <h3>Görüntülü Görüşme Yok</h3>
              <p>Bugün için görüntülü görüşmeniz bulunmamaktadır.</p>
            </div>
          ) : (
            <>
              {/* Appointments List */}
              <div className="video-appointments-list">
                <h3>Bugünkü Görüntülü Görüşmeler</h3>
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="video-appointment-item">
                    <div className="appointment-info">
                      <div className="client-name">{appointment.client_name}</div>
                      <div className="appointment-details">
                        <span className="appointment-time">
                          🕐 {formatTime(appointment.consultation_time)}
                        </span>
                        <span className="appointment-type">
                          🏥 {getConsultationTypeText(appointment.consultation_type)}
                        </span>
                      </div>
                    </div>
                    <button
                      className={`join-call-btn ${selectedAppointment?.id === appointment.id && isVideoVisible ? 'active' : ''}`}
                      onClick={() => handleJoinCall(appointment)}
                    >
                      {selectedAppointment?.id === appointment.id && isVideoVisible ? 'Görüşmede' : 'Görüşmeye Katıl'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Video Call Section */}
              {selectedAppointment && isVideoVisible && (
                <div className="video-call-section">
                  <div className="video-call-header">
                    <h4>📹 {selectedAppointment.client_name} ile Görüşme</h4>
                    <button onClick={handleLeaveCall} className="leave-call-btn">
                      Görüşmeyi Sonlandır
                    </button>
                  </div>
                  <div className="video-call-container">
                    <iframe
                      src={`https://meet.jit.si/${generateRoomId(selectedAppointment)}`}
                      allow="camera; microphone; fullscreen; speaker; display-capture"
                      width="100%"
                      height="400"
                      style={{ border: 'none', borderRadius: '10px' }}
                      title="Video Call"
                    />
                  </div>
                  <div className="video-call-info">
                    <p>🔗 Oda ID: {generateRoomId(selectedAppointment)}</p>
                    <p>⏰ Başlangıç: {formatTime(selectedAppointment.consultation_time)}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCallPanel; 