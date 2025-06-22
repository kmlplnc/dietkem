import React from 'react';
import './ConfirmationModal.css';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-container">
            <AlertTriangle size={24} className="modal-icon" />
          </div>
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <X size={20} />
          </button>
        </div>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            İptal
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Onayla ve Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; 