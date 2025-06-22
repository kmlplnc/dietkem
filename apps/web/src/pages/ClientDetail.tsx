import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { trpc } from '../utils/trpc';
import { toast } from 'react-hot-toast';
import ClientProgress from './ClientProgress';

interface ClientDetailProps {
  clientId?: number | null;
  onBack?: () => void;
}

const ClientDetail = ({ clientId: propClientId, onBack }: ClientDetailProps) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // URL parametresinden veya prop'tan clientId'yi al
  const clientId = propClientId || (id ? parseInt(id) : null);
  
  console.log('ClientDetail - propClientId:', propClientId);
  console.log('ClientDetail - URL id param:', id);
  console.log('ClientDetail - Final clientId:', clientId);
  console.log('ClientDetail - clientId type:', typeof clientId);
  console.log('ClientDetail - clientId truthy:', !!clientId);
  
  const [isActive, setIsActive] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  
  // Düzenlenebilir alanlar için state'ler
  const [editableName, setEditableName] = useState('');
  const [editableGender, setEditableGender] = useState('');
  const [editableWeight, setEditableWeight] = useState('');
  const [editableHeight, setEditableHeight] = useState('');
  const [editableEmail, setEditableEmail] = useState('');
  const [editablePhone, setEditablePhone] = useState('');
  const [editableDiseases, setEditableDiseases] = useState('');
  const [editableAllergies, setEditableAllergies] = useState('');
  const [editableMedications, setEditableMedications] = useState('');
  const [editableActivityLevel, setEditableActivityLevel] = useState('');

  // Gerçek danışan verilerini çek
  const { data: client, isLoading, error, refetch } = trpc.clients.getById.useQuery(
    { id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Ölçümleri çek
  const { data: measurements, isLoading: measurementsLoading } = trpc.measurements.getByClientId.useQuery(
    { client_id: Number(clientId) },
    { enabled: !!clientId }
  );

  // Update mutation
  const updateClientMutation = trpc.clients.update.useMutation();

  console.log('ClientDetail - measurementsData:', measurements);
  console.log('ClientDetail - clientId:', clientId);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Standalone sayfa olarak açıldıysa önceki sayfaya dön
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // Fallback: Diyetisyen paneline dön
        navigate('/dietitian-panel?tab=clients');
      }
    }
  };

  // clientId null kontrolü
  if (!clientId) {
    return (
      <div className="client-detail-page">
        <div className="error-state">
          <h3>Danışan ID'si bulunamadı</h3>
          <p>Lütfen geçerli bir danışan seçin.</p>
          <button onClick={handleBack} className="back-button">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // En son ölçümü bul (tarih bazında)
  const latestMeasurement = React.useMemo(() => {
    if (!measurements || measurements.length === 0) {
      console.log('ClientDetail - No measurements data');
      return null;
    }
    
    console.log('ClientDetail - Raw measurements:', measurements);
    
    const sorted = [...measurements].sort((a, b) => 
      new Date(b.measured_at as string).getTime() - new Date(a.measured_at as string).getTime()
    );
    
    console.log('ClientDetail - Sorted measurements:', sorted);
    console.log('ClientDetail - Latest measurement:', sorted[0]);
    
    return sorted[0];
  }, [measurements]);

  // Status güncelleme mutation'ı
  const updateStatusMutation = trpc.clients.updateStatus.useMutation({
    onSuccess: () => {
      // Başarılı güncelleme sonrası verileri yeniden çek
      refetch();
    },
    onError: (error) => {
      alert(`Hata: ${error.message}`);
    }
  });

  // Component mount olduğunda notes'ları ve düzenlenebilir alanları set et
  React.useEffect(() => {
    if (client) {
      setEditableName(client.name || '');
      setEditableGender(client.gender || '');
      setEditableHeight(client.height_cm?.toString() || '');
      setEditableEmail(client.email || '');
      setEditablePhone(client.phone || '');
      setEditableDiseases(client.diseases || '');
      setEditableAllergies(client.allergies || '');
      setEditableMedications(client.medications || '');
      setEditableActivityLevel(client.activity_level || 'sedentary');
    }
  }, [client]);

  // Kilo değerini ölçümlerden güncelle
  React.useEffect(() => {
    if (latestMeasurement && latestMeasurement.weight_kg !== null && latestMeasurement.weight_kg !== undefined) {
      setEditableWeight(latestMeasurement.weight_kg.toString());
    }
  }, [latestMeasurement]);

  // Yaş hesaplama fonksiyonu
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

  // BMR hesaplama
  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'Male') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  // TDEE hesaplama
  const calculateTDEE = (bmr: number, activityLevel: string) => {
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,      // Hareketsiz
      light: 1.375,        // Hafif aktif
      moderate: 1.55,      // Orta aktif
      active: 1.725,       // Aktif
      very_active: 1.9,    // Çok aktif
    };
    
    const multiplier = activityMultipliers[activityLevel] || 1.55; // Varsayılan orta aktif
    return Math.round(bmr * multiplier);
  };

  // Danışan erişim kodu oluşturma fonksiyonu
  const generateAccessCode = (clientId: number) => {
    // Basit bir hash algoritması - gerçek uygulamada daha güvenli olmalı
    const salt = 'DIETKEM2024'; // Salt değeri
    const combined = `${clientId}${salt}`;
    
    // Basit hash oluştur
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32-bit integer'a çevir
    }
    
    // Hash'i pozitif yap ve 6 haneli koda çevir
    const positiveHash = Math.abs(hash);
    const base36 = positiveHash.toString(36).toUpperCase();
    
    // 6 haneli kod oluştur (sayı ve harf karışımı)
    let code = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    // Hash'ten 6 karakter seç
    for (let i = 0; i < 6; i++) {
      const index = (positiveHash + i * 7) % chars.length;
      code += chars[index];
    }
    
    return code;
  };

  // Danışan erişim kodunu oluştur
  const accessCode = client ? generateAccessCode(client.id) : '';

  const handleShowProgress = () => {
    setShowProgress(true);
  };

  const handleBackFromProgress = () => {
    setShowProgress(false);
  };

  const handleDeleteClient = () => {
    if (window.confirm('Bu danışanı silmek istediğinizden emin misiniz?')) {
      // UI only - no actual deletion
      alert('Danışan silindi (UI only)');
    }
  };

  const handleToggleStatus = async () => {
    if (!client) return;
    
    const newStatus = client.status === 'active' ? 'passive' : 'active';
    
    try {
      await updateStatusMutation.mutateAsync({
        id: client.id,
        status: newStatus
      });
    } catch (error: any) {
      console.error('Status güncellenirken hata:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    
    // Düzenleme moduna geçerken mevcut verileri doğru formatta yükle
    if (client) {
      setEditableName(client.name || '');
      setEditableGender(client.gender || '');
      setEditableWeight(latestMeasurement?.weight_kg?.toString() || '');
      setEditableHeight(client.height_cm?.toString() || '');
      setEditableEmail(client.email || '');
      setEditablePhone(client.phone || '');
      
      // JSON string'leri parse et ve virgülle ayrılmış string'e çevir
      try {
        const diseasesArray = client.diseases ? JSON.parse(client.diseases) : [];
        const allergiesArray = client.allergies ? JSON.parse(client.allergies) : [];
        const medicationsArray = client.medications ? JSON.parse(client.medications) : [];
        
        setEditableDiseases(Array.isArray(diseasesArray) ? diseasesArray.join(', ') : '');
        setEditableAllergies(Array.isArray(allergiesArray) ? allergiesArray.join(', ') : '');
        setEditableMedications(Array.isArray(medicationsArray) ? medicationsArray.join(', ') : '');
      } catch (error) {
        console.error('JSON parse error:', error);
        setEditableDiseases('');
        setEditableAllergies('');
        setEditableMedications('');
      }
      
      setEditableActivityLevel(client.activity_level || 'sedentary');
    }
  };

  const handleSave = async () => {
    if (!client) return;
    
    try {
      // Virgülle ayrılmış string'leri array'e çevir
      const diseasesArray = editableDiseases.split(',').map(d => d.trim()).filter(d => d.length > 0);
      const allergiesArray = editableAllergies.split(',').map(a => a.trim()).filter(a => a.length > 0);
      const medicationsArray = editableMedications.split(',').map(m => m.trim()).filter(m => m.length > 0);

      // API'ye gönderilecek veriyi hazırla
      const updateData = {
        id: client.id,
        name: editableName,
        gender: editableGender,
        height_cm: editableHeight,
        email: editableEmail,
        phone: editablePhone,
        notes: '',
        diseases: JSON.stringify(diseasesArray),
        allergies: JSON.stringify(allergiesArray),
        medications: JSON.stringify(medicationsArray),
        activity_level: editableActivityLevel,
      };

      // tRPC mutation'ı çağır
      await updateClientMutation.mutateAsync(updateData);

      toast.success('Danışan bilgileri başarıyla güncellendi', {
        duration: 3000,
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

      setIsEditing(false);
      
      // Verileri yeniden çek (sayfa yenileme yerine)
      refetch();
    } catch (error: any) {
      console.error('Danışan güncellenirken hata:', error);
      toast.error('Danışan güncellenirken hata oluştu', {
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
  };

  const handleCancel = () => {
    setIsEditing(false);
    
    // Düzenlenebilir alanları orijinal değerlerine geri döndür
    if (client) {
      setEditableName(client.name || '');
      setEditableGender(client.gender || '');
      setEditableWeight(latestMeasurement?.weight_kg?.toString() || '');
      setEditableHeight(client.height_cm?.toString() || '');
      setEditableEmail(client.email || '');
      setEditablePhone(client.phone || '');
      
      // JSON string'leri parse et ve virgülle ayrılmış string'e çevir
      try {
        const diseasesArray = client.diseases ? JSON.parse(client.diseases) : [];
        const allergiesArray = client.allergies ? JSON.parse(client.allergies) : [];
        const medicationsArray = client.medications ? JSON.parse(client.medications) : [];
        
        setEditableDiseases(Array.isArray(diseasesArray) ? diseasesArray.join(', ') : '');
        setEditableAllergies(Array.isArray(allergiesArray) ? allergiesArray.join(', ') : '');
        setEditableMedications(Array.isArray(medicationsArray) ? medicationsArray.join(', ') : '');
      } catch (error) {
        console.error('JSON parse error:', error);
        setEditableDiseases('');
        setEditableAllergies('');
        setEditableMedications('');
      }
      
      setEditableActivityLevel(client.activity_level || 'sedentary');
    }
  };

  const activityLevelLabels: Record<string, string> = {
    sedentary: 'Hareketsiz',
    light: 'Hafif Aktif',
    moderate: 'Orta Aktif',
    active: 'Aktif',
    very_active: 'Çok Aktif',
  };

  // Loading durumu
  if (isLoading) {
    return (
      <div className="client-detail-page">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Danışan bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className="client-detail-page">
        <div className="error-state">
          <h3>Hata oluştu</h3>
          <p>{error.message}</p>
          <button onClick={handleBack} className="back-button">
            Geri Dön
          </button>
        </div>
      </div>
    );
  }

  // Danışan bulunamadı
  if (!client) {
    return (
      <div className="client-detail-page">
        <div className="error-state">
          <h3>Danışan bulunamadı</h3>
          <p>Belirtilen ID'ye sahip danışan bulunamadı.</p>
        </div>
      </div>
    );
  }

  // JSON string'leri parse et
  const diseases = client.diseases ? JSON.parse(client.diseases) : [];
  const allergies = client.allergies ? JSON.parse(client.allergies) : [];
  const medications = client.medications ? JSON.parse(client.medications) : [];

  const age = client.birth_date ? calculateAge(client.birth_date) : 0;
  
  // Son ölçümden kiloyu al
  const currentWeight = latestMeasurement?.weight_kg;
  console.log('ClientDetail - currentWeight:', currentWeight);
  console.log('ClientDetail - latestMeasurement:', latestMeasurement);
  
  // BMI, BMR ve TDEE hesaplamaları
  const heightNumber = client.height_cm ? parseFloat(String(client.height_cm)) : null;
  const weightNumber = currentWeight !== null && currentWeight !== undefined ? parseFloat(String(currentWeight)) : null;
  const bmi = weightNumber !== null && !isNaN(weightNumber) && heightNumber !== null && !isNaN(heightNumber) ? calculateBMI(weightNumber, heightNumber) : null;
  const bmr = weightNumber !== null && !isNaN(weightNumber) && heightNumber !== null && !isNaN(heightNumber) && client.birth_date && client.gender ? 
    calculateBMR(weightNumber, heightNumber, calculateAge(client.birth_date), client.gender) : null;
  const tdee = bmr ? calculateTDEE(bmr, client.activity_level || 'sedentary') : null;

  if (showProgress && client) {
    return (
      <ClientProgress 
        clientId={client.id} 
        clientName={client.name || undefined}
        onBack={handleBackFromProgress}
      />
    );
  }

  return (
    <div className="client-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>Danışan Detayı</h1>
        </div>

        <div className="header-actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="save-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17,21 17,13 7,13 7,21"/>
                  <polyline points="7,3 7,8 15,8"/>
                </svg>
                Kaydet
              </button>
              <button onClick={handleCancel} className="cancel-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                İptal
              </button>
            </>
          ) : (
            <>
              <button onClick={handleShowProgress} className="progress-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="m9 9 3 3 3-3"/>
                  <path d="M12 12v6"/>
                </svg>
                İlerleme
              </button>
              <button onClick={handleEdit} className="edit-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Düzenle
              </button>
              <button onClick={handleDeleteClient} className="delete-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
                Sil
              </button>
            </>
          )}
        </div>
      </div>

      <div className="content-grid">
        {/* Kişisel Bilgiler Kartı */}
        <div className="personal-info-card">
          <div className="card-header">
            <div className="avatar-section">
              <div className="avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div className="avatar-info">
                <h3 className="client-name">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableName}
                      onChange={(e) => setEditableName(e.target.value)}
                      className="editable-input"
                      placeholder="Danışan adı"
                    />
                  ) : (
                    client.name
                  )}
                </h3>
                <div className="status-info">
                  <span className={`status-dot ${client.status === 'active' ? 'active' : 'passive'}`}></span>
                  <span className="status-text">{client.status === 'active' ? 'Aktif Danışan' : 'Pasif Danışan'}</span>
                </div>
              </div>
            </div>
            <div className="status-toggle">
              <span className={`status-badge ${client.status === 'active' ? 'active' : 'passive'}`}>
                {client.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
              <button 
                onClick={handleToggleStatus} 
                className="toggle-button"
                disabled={updateStatusMutation.isLoading}
              >
                {updateStatusMutation.isLoading ? (
                  <>
                    <div className="loading-spinner-small"></div>
                    Güncelleniyor...
                  </>
                ) : (
                  client.status === 'active' ? 'Pasifleştir' : 'Aktifleştir'
                )}
              </button>
            </div>
          </div>

          <div className="info-content">
            <div className="info-grid">
              <div className="info-group">
                <h4 className="group-title">📋 Temel Bilgiler</h4>
                <div className="info-items">
                  <div className="info-item">
                    <span className="item-label">Danışan Kodu</span>
                    <span className="item-value access-code">
                      <span className="code-display">{accessCode}</span>
                      <button
                        className="copy-btn"
                        onClick={async () => {
                          try {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                              await navigator.clipboard.writeText(accessCode);
                              toast.success('Kod kopyalandı!');
                            } else {
                              // Fallback for older browsers
                              const textArea = document.createElement('textarea');
                              textArea.value = accessCode;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand('copy');
                              document.body.removeChild(textArea);
                              toast.success('Kod kopyalandı!');
                            }
                          } catch (error) {
                            console.error('Copy failed:', error);
                            toast.error('Kopyalama başarısız oldu');
                          }
                        }}
                        title="Kodu kopyala"
                      >
                        📋
                      </button>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">Cinsiyet</span>
                    <span className="item-value">
                      {isEditing ? (
                        <select
                          value={editableGender}
                          onChange={(e) => setEditableGender(e.target.value)}
                          className="editable-select"
                        >
                          <option value="">Seçiniz</option>
                          <option value="Male">Erkek</option>
                          <option value="Female">Kadın</option>
                          <option value="Other">Diğer</option>
                        </select>
                      ) : (
                        client.gender === 'Female' ? 'Kadın' : client.gender === 'Male' ? 'Erkek' : 'Diğer'
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">Yaş</span>
                    <span className="item-value">{age} yaş</span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">Kayıt Tarihi</span>
                    <span className="item-value">{client.created_at ? new Date(client.created_at).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</span>
                  </div>
                </div>
              </div>

              <div className="info-group">
                <h4 className="group-title">📏 Fiziksel Özellikler</h4>
                <div className="info-items">
                  <div className="info-item">
                    <span className="item-label">Kilo</span>
                    <span className="item-value">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editableWeight}
                          onChange={(e) => setEditableWeight(e.target.value)}
                          className="editable-input small-input"
                          placeholder="Kilo (kg)"
                          step="0.1"
                        />
                      ) : (
                        currentWeight ? `${currentWeight} kg` : 'Henüz ölçüm yapılmadı'
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">Boy</span>
                    <span className="item-value">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editableHeight}
                          onChange={(e) => setEditableHeight(e.target.value)}
                          className="editable-input small-input"
                          placeholder="Boy (cm)"
                          step="0.1"
                        />
                      ) : (
                        `${client.height_cm} cm`
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">BMI</span>
                    <span className="item-value bmi-value">
                      {bmi !== null && bmi !== undefined ? String(bmi) : 'Henüz ölçüm yapılmadı'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">PAL</span>
                    <span className="item-value">
                      {isEditing ? (
                        <select
                          value={editableActivityLevel}
                          onChange={e => setEditableActivityLevel(e.target.value)}
                          className="editable-select"
                        >
                          {Object.entries(activityLevelLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      ) : (
                        activityLevelLabels[client.activity_level || 'sedentary']
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="info-group contact-group">
                <h4 className="group-title">📞 İletişim Bilgileri</h4>
                <div className="info-items">
                  <div className="info-item">
                    <span className="item-label">E-posta</span>
                    <span className="item-value">
                      {isEditing ? (
                        <input
                          type="email"
                          value={editableEmail}
                          onChange={(e) => setEditableEmail(e.target.value)}
                          className="editable-input"
                          placeholder="E-posta adresi"
                        />
                      ) : (
                        client.email || 'Belirtilmemiş'
                      )}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="item-label">Telefon</span>
                    <span className="item-value">
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editablePhone}
                          onChange={(e) => setEditablePhone(e.target.value)}
                          className="editable-input"
                          placeholder="Telefon numarası"
                        />
                      ) : (
                        client.phone || 'Belirtilmemiş'
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sağlık Bilgileri */}
        <div className="health-info-grid">
          <div className="health-card">
            <h3>🛡️ Hastalıklar</h3>
            {isEditing ? (
              <div className="editable-list">
                <textarea
                  value={editableDiseases}
                  onChange={(e) => setEditableDiseases(e.target.value)}
                  placeholder="Hastalıkları virgülle ayırarak yazın (örn: Diyabet, Hipertansiyon, Astım)..."
                  className="editable-textarea"
                  rows={3}
                />
                <small className="input-hint">Virgülle ayırarak birden fazla hastalık ekleyebilirsiniz</small>
              </div>
            ) : (
              <div className="badge-list">
                {diseases.length > 0 ? (
                  diseases.map((disease: string, index: number) => (
                    <span key={index} className="badge disease">{disease}</span>
                  ))
                ) : (
                  <span className="no-data">Hastalık bilgisi yok</span>
                )}
              </div>
            )}
          </div>

          <div className="health-card">
            <h3>⚠️ Alerjiler</h3>
            {isEditing ? (
              <div className="editable-list">
                <textarea
                  value={editableAllergies}
                  onChange={(e) => setEditableAllergies(e.target.value)}
                  placeholder="Alerjileri virgülle ayırarak yazın (örn: Fındık, Süt, Gluten)..."
                  className="editable-textarea"
                  rows={3}
                />
                <small className="input-hint">Virgülle ayırarak birden fazla alerji ekleyebilirsiniz</small>
              </div>
            ) : (
              <div className="badge-list">
                {allergies.length > 0 ? (
                  allergies.map((allergy: string, index: number) => (
                    <span key={index} className="badge allergy">{allergy}</span>
                  ))
                ) : (
                  <span className="no-data">Alerji bilgisi yok</span>
                )}
              </div>
            )}
          </div>

          <div className="health-card">
            <h3>💊 İlaçlar</h3>
            {isEditing ? (
              <div className="editable-list">
                <textarea
                  value={editableMedications}
                  onChange={(e) => setEditableMedications(e.target.value)}
                  placeholder="İlaçları virgülle ayırarak yazın (örn: Metformin, Aspirin, Vitamin D)..."
                  className="editable-textarea"
                  rows={3}
                />
                <small className="input-hint">Virgülle ayırarak birden fazla ilaç ekleyebilirsiniz</small>
              </div>
            ) : (
              <div className="badge-list">
                {medications.length > 0 ? (
                  medications.map((medication: string, index: number) => (
                    <span key={index} className="badge medication">{medication}</span>
                  ))
                ) : (
                  <span className="no-data">İlaç bilgisi yok</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ölçümler */}
        <div className="measurements-grid">
          <div className="measurement-card">
            <div className="measurement-icon">🧮</div>
            <h3>BMR</h3>
            <div className="measurement-value">
              {bmr !== null && bmr !== undefined ? String(bmr) : 'Henüz ölçüm yapılmadı'}
            </div>
            <p className="measurement-description">
              Bazal Metabolizma Hızı - Dinlenirken harcanan enerji
            </p>
          </div>

          <div className="measurement-card">
            <div className="measurement-icon">⚡</div>
            <h3>TDEE</h3>
            <div className="measurement-value">
              {tdee !== null && tdee !== undefined ? String(tdee) : 'Henüz ölçüm yapılmadı'}
            </div>
            <p className="measurement-description">
              Toplam Günlük Enerji Harcaması - Bu danışanın ideal enerji ihtiyacı
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .client-detail-page {
          width: 100%;
          margin-left: 106px;
          margin-right: 0;
          min-height: 100vh;
          background: #f8fafc;
          padding: 2rem;
        }
        .client-detail-content-container {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.07);
          padding: 2rem;
        }
        @media (max-width: 1024px) {
          .client-detail-page {
            margin-left: 0;
            padding: 1rem 0;
          }
          .client-detail-content-container {
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
            border-radius: 10px;
            padding: 1rem;
          }
        }
        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #1e293b;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state h3 {
          color: #dc2626;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .error-state p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .back-button {
          background: #1e293b;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-button:hover {
          background: #334155;
          transform: translateY(-1px);
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .header-content {
          text-align: right;
        }

        .header-content h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .edit-button, .delete-button, .save-button, .cancel-button, .progress-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .edit-button {
          background: #1e293b;
          color: white;
        }

        .progress-button {
          background: #3b82f6;
          color: white;
        }

        .delete-button {
          background: #dc2626;
          color: white;
        }

        .save-button {
          background: #10b981;
          color: white;
        }

        .cancel-button {
          background: #6b7280;
          color: white;
        }

        .edit-button:hover, .save-button:hover, .progress-button:hover {
          background: #334155;
          transform: translateY(-1px);
        }

        .progress-button:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        .delete-button:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .cancel-button:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .content-grid {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .personal-info-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .avatar-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          min-width: 250px;
        }

        .avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(30, 41, 59, 0.2);
          flex-shrink: 0;
        }

        .avatar-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .client-name {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.active {
          background: #10b981;
        }

        .status-dot.passive {
          background: #9ca3af;
        }

        .status-text {
          color: #6b7280;
          font-size: 0.8rem;
        }

        .status-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.active {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.passive {
          background: #f3f4f6;
          color: #9ca3af;
        }

        .toggle-button {
          padding: 0.5rem 1rem;
          background: #1e293b;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .toggle-button:hover:not(:disabled) {
          background: #334155;
        }

        .toggle-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .loading-spinner-small {
          width: 12px;
          height: 12px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .info-content {
          display: flex;
          gap: 2rem;
        }

        .info-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1.5fr 1fr;
          gap: 1.5rem;
        }

        .info-group {
          background: white;
          border-radius: 10px;
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .contact-group {
          grid-column: span 1;
        }

        .group-title {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .info-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f8fafc;
          border-left: none !important;
          background: transparent !important;
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .info-item::before,
        .info-item::after {
          display: none !important;
        }

        .item-label {
          font-weight: 500;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .item-value {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .item-value::before,
        .item-value::after {
          display: none !important;
        }

        .bmi-value {
          color: #dc2626;
          font-weight: 700;
        }

        .health-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .health-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .health-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .badge-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .badge.disease {
          background: #fef2f2;
          color: #dc2626;
        }

        .badge.allergy {
          background: #fffbeb;
          color: #d97706;
        }

        .badge.medication {
          background: #f0f9ff;
          color: #0284c7;
        }

        .no-data {
          color: #9ca3af;
          font-style: italic;
          font-size: 0.9rem;
        }

        .notes-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .notes-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .notes-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .notes-textarea {
          width: 100%;
          min-height: 120px;
          padding: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          background: #f9fafb;
        }

        .notes-textarea:focus {
          outline: none;
          border-color: #1e293b;
          background: white;
        }

        .measurements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .measurement-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          text-align: center;
        }

        .measurement-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .measurement-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.5rem 0;
        }

        .measurement-value {
          font-size: 2rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .measurement-description {
          font-size: 0.8rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.4;
        }

        .editable-input, .editable-select, .editable-textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.9rem;
          font-family: inherit;
          background: white;
          transition: border-color 0.2s ease;
        }

        .editable-input.small-input {
          max-width: 80px;
          text-align: center;
        }

        .editable-input:focus, .editable-select:focus, .editable-textarea:focus {
          outline: none;
          border-color: #1e293b;
          box-shadow: 0 0 0 2px rgba(30, 41, 59, 0.1);
        }

        .editable-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .editable-select {
          cursor: pointer;
        }

        .access-code {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .code-display {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .copy-btn {
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          font-size: 1rem;
          color: #6b7280;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .copy-btn:hover {
          background: #f3f4f6;
          color: #374151;
          transform: scale(1.1);
        }

        .dietitian-info {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .dietitian-info h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 1rem 0;
        }

        .flex {
          display: flex;
        }

        .items-center {
          align-items: center;
        }

        .space-x-4 {
          gap: 1rem;
        }

        .w-16 {
          width: 4rem;
        }

        .h-16 {
          height: 4rem;
        }

        .rounded-full {
          border-radius: 9999px;
        }

        .object-cover {
          object-fit: cover;
        }

        .border-2 {
          border-width: 2px;
        }

        .border-white {
          border-color: white;
        }

        .shadow-md {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .font-semibold {
          font-weight: 600;
        }

        .text-lg {
          font-size: 1.25rem;
        }

        .text-gray-800 {
          color: #1e293b;
        }

        .text-sm {
          font-size: 0.875rem;
        }

        .text-gray-500 {
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ClientDetail; 