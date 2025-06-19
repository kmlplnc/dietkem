import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
import toast, { Toaster } from 'react-hot-toast';

const clientSchema = z.object({
  name: z.string().min(2, 'Ad en az 2 karakter olmalıdır'),
  gender: z.enum(["Male", "Female", "Other"]),
  birth_date: z.string().min(1, 'Doğum tarihi gereklidir'),
  height_cm: z.number().min(50, 'Boy en az 50 cm olmalıdır').max(250, 'Boy en fazla 250 cm olabilir'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  diseases: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  activity_level: z.string().min(1, 'Fiziksel aktivite oranı gereklidir'),
});

type ClientFormData = z.infer<typeof clientSchema>;

const CreateClientForm: React.FC = () => {
  const [phoneValue, setPhoneValue] = useState('+90 ');

  const createClientMutation = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success('Danışan başarıyla oluşturuldu!', {
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
      setDiseases([]);
      setAllergies([]);
      setMedications([]);
      setPhoneValue('+90 ');
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      gender: 'Male',
      birth_date: '',
      height_cm: 0,
      email: '',
      phone: '+90 ',
      notes: '',
      activity_level: 'sedentary',
    },
  });

  const [diseases, setDiseases] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [newDisease, setNewDisease] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const activityLevels = [
    { value: 'sedentary', label: 'Hareketsiz' },
    { value: 'light', label: 'Hafif Aktif' },
    { value: 'moderate', label: 'Orta Aktif' },
    { value: 'active', label: 'Aktif' },
    { value: 'very_active', label: 'Çok Aktif' },
  ];

  const addDisease = () => {
    if (newDisease.trim()) {
      const updated = [...diseases, newDisease.trim()];
      setDiseases(updated);
      setValue('diseases', updated);
      setNewDisease('');
    }
  };

  const removeDisease = (index: number) => {
    const updated = diseases.filter((_, i) => i !== index);
    setDiseases(updated);
    setValue('diseases', updated);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const updated = [...allergies, newAllergy.trim()];
      setAllergies(updated);
      setValue('allergies', updated);
      setNewAllergy('');
    }
  };

  const removeAllergy = (index: number) => {
    const updated = allergies.filter((_, i) => i !== index);
    setAllergies(updated);
    setValue('allergies', updated);
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      const updated = [...medications, newMedication.trim()];
      setMedications(updated);
      setValue('medications', updated);
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
    setValue('medications', updated);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    const numbers = value.replace(/\D/g, '');
    
    if (!value.startsWith('+90')) {
      if (numbers.length > 0) {
        value = `+90 ${numbers}`;
      } else {
        value = '+90 ';
      }
    }
    
    if (value.length <= 15) {
      setPhoneValue(value);
      setValue('phone', value);
    }
  };

  const onSubmit = (data: any) => {
    // Convert form data to match the expected type
    const clientData = {
      ...data,
      height_cm: data.height_cm || 0,
      diseases: JSON.stringify(diseases),
      allergies: JSON.stringify(allergies),
      medications: JSON.stringify(medications),
      activity_level: data.activity_level,
    };
    createClientMutation.mutate(clientData);
  };

  return (
    <div className="create-client-form">
      <Toaster />
      <div className="form-header">
        <h2>Yeni Danışan Oluştur</h2>
        <p>Danışan bilgilerini eksiksiz doldurunuz</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="client-form">
        <div className="form-section">
          <h3>Temel Bilgiler</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Ad Soyad *</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={errors.name ? 'error' : ''}
                placeholder="Ad Soyad"
              />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="gender">Cinsiyet *</label>
              <select
                id="gender"
                {...register('gender')}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Seçiniz</option>
                <option value="Male">Erkek</option>
                <option value="Female">Kadın</option>
                <option value="Other">Diğer</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birth_date">Doğum Tarihi *</label>
              <input
                type="date"
                id="birth_date"
                {...register('birth_date')}
                className={errors.birth_date ? 'error' : ''}
              />
              {errors.birth_date && <span className="error-message">{errors.birth_date.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={errors.email ? 'error' : ''}
                placeholder="ornek@email.com"
              />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="height_cm">Boy (cm) *</label>
              <input
                type="number"
                id="height_cm"
                {...register('height_cm', { valueAsNumber: true })}
                className={errors.height_cm ? 'error' : ''}
                placeholder="170"
                min="50"
                max="250"
              />
              {errors.height_cm && <span className="error-message">{errors.height_cm.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefon</label>
              <input
                type="tel"
                id="phone"
                className={errors.phone ? 'error' : ''}
                placeholder="+90 555 123 45 67"
                value={phoneValue}
                onChange={handlePhoneChange}
              />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="activity_level">Fiziksel Aktivite Oranı *</label>
            <select
              id="activity_level"
              {...register('activity_level')}
              className={errors.activity_level ? 'error' : ''}
            >
              {activityLevels.map((level) => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            {errors.activity_level && <span className="error-message">{errors.activity_level.message}</span>}
          </div>
        </div>

        <div className="form-section">
          <h3>Sağlık Bilgileri</h3>
          
          <div className="multi-select-group">
            <label>Hastalıklar</label>
            <div className="multi-select-input">
              <input
                type="text"
                value={newDisease}
                onChange={(e) => setNewDisease(e.target.value)}
                placeholder="Hastalık ekleyin"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDisease())}
              />
              <button type="button" onClick={addDisease} className="add-btn">+</button>
            </div>
            {diseases.length > 0 && (
              <div className="tags">
                {diseases.map((disease, index) => (
                  <span key={index} className="tag">
                    {disease}
                    <button type="button" onClick={() => removeDisease(index)} className="remove-btn">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="multi-select-group">
            <label>Alerjiler</label>
            <div className="multi-select-input">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Alerji ekleyin"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <button type="button" onClick={addAllergy} className="add-btn">+</button>
            </div>
            {allergies.length > 0 && (
              <div className="tags">
                {allergies.map((allergy, index) => (
                  <span key={index} className="tag">
                    {allergy}
                    <button type="button" onClick={() => removeAllergy(index)} className="remove-btn">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="multi-select-group">
            <label>İlaçlar</label>
            <div className="multi-select-input">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="İlaç ekleyin"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
              />
              <button type="button" onClick={addMedication} className="add-btn">+</button>
            </div>
            {medications.length > 0 && (
              <div className="tags">
                {medications.map((medication, index) => (
                  <span key={index} className="tag">
                    {medication}
                    <button type="button" onClick={() => removeMedication(index)} className="remove-btn">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <h3>Notlar</h3>
          <div className="form-group">
            <label htmlFor="notes">Ek Notlar</label>
            <textarea
              id="notes"
              {...register('notes')}
              className={errors.notes ? 'error' : ''}
              placeholder="Danışan hakkında ek notlar..."
              rows={4}
            />
            {errors.notes && <span className="error-message">{errors.notes.message}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </form>

      <style>{`
        .create-client-form {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .form-header p {
          color: #6b7280;
          font-size: 0.95rem;
        }

        .client-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 1.5rem;
          background: #f9fafb;
        }

        .form-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: border-color 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #ef4444;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }

        .multi-select-group {
          margin-bottom: 1.5rem;
        }

        .multi-select-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        .multi-select-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .multi-select-input input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .add-btn {
          padding: 0.75rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }

        .add-btn:hover {
          background: #2563eb;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #e0e7ff;
          color: #3730a3;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }

        .remove-btn:hover {
          background: #f3f4f6;
          color: #ef4444;
        }

        .form-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .submit-btn {
          padding: 1rem 2rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 150px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .submit-btn:hover:not(:disabled) {
          background: #0f172a;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .submit-btn:disabled {
          background: #64748b;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        @media (max-width: 768px) {
          .create-client-form {
            padding: 1rem;
            margin: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateClientForm; 