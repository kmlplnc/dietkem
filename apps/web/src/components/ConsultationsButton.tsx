import React, { useState } from 'react';
import ConsultationsPanel from './ConsultationsPanel';

interface ConsultationsButtonProps {
  clientId: number;
  clientName: string;
}

const ConsultationsButton: React.FC<ConsultationsButtonProps> = ({ clientId, clientName }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleOpenPanel = () => {
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  return (
    <>
      <button 
        className="consultations-button"
        onClick={handleOpenPanel}
        title="Görüşmeleri Görüntüle"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Görüşmeler
      </button>

      <ConsultationsPanel
        clientId={clientId}
        clientName={clientName}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
      />

      <style jsx>{`
        .consultations-button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .consultations-button:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .consultations-button:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  );
};

export default ConsultationsButton; 