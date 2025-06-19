import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
import toast, { Toaster } from 'react-hot-toast';

const measurementSchema = z.object({
  weight_kg: z.number().min(0, 'Kilo 0\'dan büyük olmalı').max(500, 'Kilo 500\'den küçük olmalı'),
  waist_cm: z.number().min(0).max(300).optional().or(z.literal('')),
  hip_cm: z.number().min(0).max(300).optional().or(z.literal('')),
  neck_cm: z.number().min(0).max(100).optional().or(z.literal('')),
  chest_cm: z.number().min(0).max(300).optional().or(z.literal('')),
  arm_cm: z.number().min(0).max(100).optional().or(z.literal('')),
  thigh_cm: z.number().min(0).max(200).optional().or(z.literal('')),
  body_fat_percent: z.number().min(0).max(100).optional().or(z.literal('')),
  measured_at: z.string(),
  note: z.string().max(1000).optional(),
});

type MeasurementFormData = z.infer<typeof measurementSchema>;

interface AddMeasurementModalProps {
  clientId: number;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
}

const AddMeasurementModal: React.FC<AddMeasurementModalProps> = ({
  clientId,
  clientName,
  isOpen,
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<MeasurementFormData>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      measured_at: new Date().toISOString().split('T')[0],
      note: ''
    }
  });

  const addMeasurementMutation = trpc.measurements.add.useMutation({
    onSuccess: () => {
      toast.success('Ölçüm başarıyla eklendi!', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#10b981',
        },
      });
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(`Hata: ${error.message}`, {
        duration: 5000,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '14px',
          fontWeight: '500',
        },
        iconTheme: {
          primary: '#fff',
          secondary: '#ef4444',
        },
      });
    }
  });

  const onSubmit = async (data: MeasurementFormData) => {
    setIsSubmitting(true);
    
    try {
      const measurementData = {
        client_id: clientId,
        weight_kg: data.weight_kg,
        waist_cm: data.waist_cm || undefined,
        hip_cm: data.hip_cm || undefined,
        neck_cm: data.neck_cm || undefined,
        chest_cm: data.chest_cm || undefined,
        arm_cm: data.arm_cm || undefined,
        thigh_cm: data.thigh_cm || undefined,
        body_fat_percent: data.body_fat_percent || undefined,
        measured_at: data.measured_at,
        note: data.note || undefined,
      };

      await addMeasurementMutation.mutateAsync(measurementData);
    } catch (error) {
      console.error('Ölçüm eklenirken hata:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <Toaster />
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Yeni Ölçüm Ekle</h2>
            <button onClick={handleCancel} className="close-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="client-info-section">
            <h3 className="client-name">{clientName}</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="measurement-form">
            <div className="form-grid">
              {/* Kilo - Zorunlu */}
              <div className="form-group required">
                <label htmlFor="weight_kg">Kilo *</label>
                <input
                  type="number"
                  step="0.1"
                  id="weight_kg"
                  {...register('weight_kg', { valueAsNumber: true })}
                  className={errors.weight_kg ? 'error' : ''}
                  placeholder="0.0"
                />
                <span className="unit">kg</span>
                {errors.weight_kg && <span className="error-message">{errors.weight_kg.message}</span>}
              </div>

              {/* Bel */}
              <div className="form-group">
                <label htmlFor="waist_cm">Bel</label>
                <input
                  type="number"
                  step="0.1"
                  id="waist_cm"
                  {...register('waist_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Kalça */}
              <div className="form-group">
                <label htmlFor="hip_cm">Kalça</label>
                <input
                  type="number"
                  step="0.1"
                  id="hip_cm"
                  {...register('hip_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Boyun */}
              <div className="form-group">
                <label htmlFor="neck_cm">Boyun</label>
                <input
                  type="number"
                  step="0.1"
                  id="neck_cm"
                  {...register('neck_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Göğüs */}
              <div className="form-group">
                <label htmlFor="chest_cm">Göğüs</label>
                <input
                  type="number"
                  step="0.1"
                  id="chest_cm"
                  {...register('chest_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Kol */}
              <div className="form-group">
                <label htmlFor="arm_cm">Kol</label>
                <input
                  type="number"
                  step="0.1"
                  id="arm_cm"
                  {...register('arm_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Bacak */}
              <div className="form-group">
                <label htmlFor="thigh_cm">Bacak</label>
                <input
                  type="number"
                  step="0.1"
                  id="thigh_cm"
                  {...register('thigh_cm', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">cm</span>
              </div>

              {/* Yağ Oranı */}
              <div className="form-group">
                <label htmlFor="body_fat_percent">Yağ Oranı</label>
                <input
                  type="number"
                  step="0.1"
                  id="body_fat_percent"
                  {...register('body_fat_percent', { valueAsNumber: true })}
                  placeholder="0.0"
                />
                <span className="unit">%</span>
              </div>

              {/* Tarih */}
              <div className="form-group">
                <label htmlFor="measured_at">Ölçüm Tarihi</label>
                <input
                  type="date"
                  id="measured_at"
                  {...register('measured_at')}
                />
              </div>
            </div>

            {/* Not */}
            <div className="form-group full-width">
              <label htmlFor="note">Not</label>
              <textarea
                id="note"
                {...register('note')}
                placeholder="Ölçüm hakkında notlar..."
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleCancel} className="cancel-btn">
                İptal
              </button>
              <button type="submit" className="save-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  'Kaydet'
                )}
              </button>
            </div>
          </form>

          <style>{`
            .modal-overlay {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 1000;
              padding: 1rem;
            }

            .modal-content {
              background: white;
              border-radius: 12px;
              max-width: 600px;
              width: 100%;
              max-height: 90vh;
              overflow-y: auto;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            }

            .modal-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 1.5rem 1.5rem 0 1.5rem;
              border-bottom: 1px solid #e5e7eb;
              position: relative;
            }

            .modal-header h2 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #1e293b;
              margin: 0;
            }

            .client-info-section {
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 1rem 1.5rem;
              background: #f8fafc;
              border-bottom: 1px solid #e5e7eb;
            }

            .client-name {
              color: #1e293b;
              font-size: 1.1rem;
              font-weight: 600;
              margin: 0;
              text-align: center;
            }

            .close-button {
              background: none;
              border: none;
              color: #6b7280;
              cursor: pointer;
              padding: 0.5rem;
              border-radius: 6px;
              transition: all 0.2s ease;
            }

            .close-button:hover {
              background: #f3f4f6;
              color: #1e293b;
            }

            .measurement-form {
              padding: 1.5rem;
            }

            .form-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1rem;
              margin-bottom: 1.5rem;
            }

            .form-group {
              position: relative;
            }

            .form-group.full-width {
              grid-column: 1 / -1;
            }

            .form-group.required label::after {
              content: ' *';
              color: #dc2626;
            }

            .form-group label {
              display: block;
              font-size: 0.9rem;
              font-weight: 600;
              color: #374151;
              margin-bottom: 0.5rem;
            }

            .form-group input,
            .form-group textarea {
              width: 100%;
              padding: 0.75rem;
              border: 1px solid #d1d5db;
              border-radius: 8px;
              font-size: 0.9rem;
              transition: border-color 0.2s ease;
              box-sizing: border-box;
            }

            .form-group input:focus,
            .form-group textarea:focus {
              outline: none;
              border-color: #1e293b;
              box-shadow: 0 0 0 3px rgba(30, 41, 59, 0.1);
            }

            .form-group input.error {
              border-color: #dc2626;
            }

            .unit {
              position: absolute;
              right: 0.75rem;
              top: 2.5rem;
              color: #6b7280;
              font-size: 0.8rem;
              pointer-events: none;
            }

            .error-message {
              color: #dc2626;
              font-size: 0.8rem;
              margin-top: 0.25rem;
              display: block;
            }

            .form-actions {
              display: flex;
              gap: 1rem;
              justify-content: flex-end;
              padding-top: 1rem;
              border-top: 1px solid #e5e7eb;
            }

            .cancel-btn,
            .save-btn {
              padding: 0.75rem 1.5rem;
              border: none;
              border-radius: 8px;
              font-size: 0.9rem;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              display: flex;
              align-items: center;
              gap: 0.5rem;
            }

            .cancel-btn {
              background: #f3f4f6;
              color: #374151;
            }

            .cancel-btn:hover {
              background: #e5e7eb;
            }

            .save-btn {
              background: #1e293b;
              color: white;
            }

            .save-btn:hover:not(:disabled) {
              background: #334155;
            }

            .save-btn:disabled {
              opacity: 0.6;
              cursor: not-allowed;
            }

            .loading-spinner-small {
              width: 16px;
              height: 16px;
              border: 2px solid transparent;
              border-top: 2px solid currentColor;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }

            @media (max-width: 768px) {
              .modal-content {
                margin: 1rem;
                max-height: calc(100vh - 2rem);
              }

              .form-grid {
                grid-template-columns: 1fr;
              }

              .form-actions {
                flex-direction: column-reverse;
              }
            }
          `}</style>
        </div>
      </div>
    </>
  );
};

export default AddMeasurementModal; 