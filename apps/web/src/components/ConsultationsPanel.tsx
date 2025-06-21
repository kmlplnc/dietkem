import React, { useState } from 'react';
import './ConsultationsPanel.css';

interface Consultation {
  id: number;
  date: string;
  duration?: number;
  notes: string;
  isVisibleToClient: boolean;
}

interface ConsultationsPanelProps {
  clientId: number;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ConsultationsPanel: React.FC<ConsultationsPanelProps> = ({
  clientId,
  clientName,
  isOpen,
  onClose
}) => {
  const [consultations, setConsultations] = useState<Consultation[]>([
    {
      id: 1,
      date: '2025-06-20',
      duration: 45,
      notes: 'İlk görüşme. Danışanın mevcut beslenme alışkanlıkları değerlendirildi. Hedefler belirlendi ve ilk beslenme planı oluşturuldu.',
      isVisibleToClient: true
    },
    {
      id: 2,
      date: '2025-06-15',
      duration: 30,
      notes: 'Kontrol görüşmesi. Plana uyum iyi, kilo kaybı 2kg. Motivasyon yüksek.',
      isVisibleToClient: true
    },
    {
      id: 3,
      date: '2025-06-10',
      duration: 60,
      notes: 'Detaylı beslenme analizi yapıldı. Yeni hedefler belirlendi.',
      isVisibleToClient: false
    }
  ]);

  const [newConsultation, setNewConsultation] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    notes: '',
    isVisibleToClient: true
  });

  const handleSaveConsultation = () => {
    if (newConsultation.notes.trim()) {
      const consultation: Consultation = {
        id: Date.now(),
        date: newConsultation.date,
        duration: newConsultation.duration ? parseInt(newConsultation.duration) : undefined,
        notes: newConsultation.notes,
        isVisibleToClient: newConsultation.isVisibleToClient
      };
      
      setConsultations([consultation, ...consultations]);
      setNewConsultation({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        notes: '',
        isVisibleToClient: true
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    return `${duration} dk`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`consultations-backdrop ${isOpen ? 'consultations-backdrop--open' : ''}`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`consultations-panel ${isOpen ? 'consultations-panel--open' : ''}`}>
        {/* Header */}
        <div className="consultations-header">
          <h2 className="consultations-title">Görüşmeler</h2>
          <button className="consultations-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="consultations-content">
          {/* Client Info */}
          <div className="consultations-client-info">
            <h3>{clientName}</h3>
            <p>Danışan ID: {clientId}</p>
          </div>

          {/* Recent Consultations */}
          <section className="consultations-section">
            <h3 className="section-title">Son Görüşmeler</h3>
            {consultations.length > 0 ? (
              <div className="consultations-list">
                {consultations.map((consultation) => (
                  <div key={consultation.id} className="consultation-item">
                    <div className="consultation-header">
                      <span className="consultation-date">{formatDate(consultation.date)}</span>
                      {consultation.duration && (
                        <span className="consultation-duration">{formatDuration(consultation.duration)}</span>
                      )}
                      <span className={`consultation-visibility ${consultation.isVisibleToClient ? 'visible' : 'hidden'}`}>
                        {consultation.isVisibleToClient ? 'Görünür' : 'Gizli'}
                      </span>
                    </div>
                    <p className="consultation-notes">{consultation.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="consultations-empty">
                <p>Henüz görüşme eklenmedi</p>
              </div>
            )}
          </section>

          {/* Add New Consultation */}
          <section className="consultations-section">
            <h3 className="section-title">Yeni Görüşme Ekle</h3>
            <form className="consultation-form" onSubmit={(e) => { e.preventDefault(); handleSaveConsultation(); }}>
              <div className="form-group">
                <label htmlFor="consultation-date">Tarih</label>
                <input
                  type="date"
                  id="consultation-date"
                  value={newConsultation.date}
                  onChange={(e) => setNewConsultation({...newConsultation, date: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="consultation-duration">Süre (dk)</label>
                <input
                  type="number"
                  id="consultation-duration"
                  value={newConsultation.duration}
                  onChange={(e) => setNewConsultation({...newConsultation, duration: e.target.value})}
                  className="form-input"
                  placeholder="30"
                  min="1"
                  max="180"
                />
              </div>

              <div className="form-group">
                <label htmlFor="consultation-notes">Notlar</label>
                <textarea
                  id="consultation-notes"
                  value={newConsultation.notes}
                  onChange={(e) => setNewConsultation({...newConsultation, notes: e.target.value})}
                  className="form-textarea"
                  placeholder="Görüşme notlarınızı buraya yazın..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={newConsultation.isVisibleToClient}
                    onChange={(e) => setNewConsultation({...newConsultation, isVisibleToClient: e.target.checked})}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                  <span className="toggle-text">Danışana görünür mü?</span>
                </label>
              </div>

              <button type="submit" className="save-button">
                Kaydet
              </button>
            </form>
          </section>
        </div>
      </div>
    </>
  );
};

export default ConsultationsPanel; 