import React, { useState } from 'react';
import VideoCallPanel from '../components/VideoCallPanel';

const TestJitsiPage: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [consultationId, setConsultationId] = useState(11);

  const handleStartCall = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Jitsi Meet Test Sayfası</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>
          Consultation ID:
          <input
            type="number"
            value={consultationId}
            onChange={(e) => setConsultationId(Number(e.target.value))}
            style={{ marginLeft: '10px', padding: '5px' }}
          />
        </label>
      </div>

      <button
        onClick={handleStartCall}
        style={{
          background: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
      >
        Video Görüşme Başlat
      </button>

      <div style={{ marginTop: '20px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
        <h3>Test Bilgileri:</h3>
        <ul>
          <li>Consultation ID: {consultationId}</li>
          <li>Jitsi Meet Room: dietkem-consultation-{consultationId}</li>
          <li>Room URL: https://meet.jit.si/dietkem-consultation-{consultationId}</li>
        </ul>
      </div>

      <VideoCallPanel
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        consultationId={consultationId}
        roomUrl={`https://meet.jit.si/dietkem-consultation-${consultationId}`}
        isClient={false}
      />
    </div>
  );
};

export default TestJitsiPage; 