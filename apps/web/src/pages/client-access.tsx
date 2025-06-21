import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import '../styles/client-access.css';

const ClientAccess: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Danışan erişim kodu oluşturma fonksiyonu (ClientDetail ile aynı)
  const generateAccessCode = (clientId: number) => {
    const salt = 'DIETKEM2024';
    const combined = `${clientId}${salt}`;
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    const positiveHash = Math.abs(hash);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    
    let code = '';
    for (let i = 0; i < 6; i++) {
      const index = (positiveHash + i * 7) % chars.length;
      code += chars[index];
    }
    
    return code;
  };

  // Kod doğrulama fonksiyonu
  const validateAccessCode = async (code: string) => {
    try {
      // Tüm olası client ID'lerini kontrol et (1-1000 arası)
      for (let clientId = 1; clientId <= 1000; clientId++) {
        const generatedCode = generateAccessCode(clientId);
        if (generatedCode === code.toUpperCase()) {
          return clientId;
        }
      }
      return null;
    } catch (error) {
      console.error('Kod doğrulama hatası:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accessCode.trim()) {
      setError('Lütfen danışan kodunu girin');
      return;
    }

    if (accessCode.length !== 6) {
      setError('Danışan kodu 6 karakter olmalıdır');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const clientId = await validateAccessCode(accessCode);
      
      if (clientId) {
        // Kod geçerli, client dashboard sayfasına yönlendir
        localStorage.setItem('clientAccessCode', accessCode);
        toast.success('Kod doğrulandı! Danışan bilgileri yükleniyor...');
        navigate(`/client/${clientId}`);
      } else {
        setError('Geçersiz danışan kodu. Lütfen tekrar deneyin.');
        toast.error('Geçersiz kod!');
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
      toast.error('Doğrulama hatası!');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan kodu al
    const savedCode = localStorage.getItem('clientAccessCode');
    if (savedCode) {
      setAccessCode(savedCode);
    }
  }, []);

  return (
    <div className="client-access-container">
      <div className="client-access-card">
        <div className="client-access-header">
          <h1>Danışan Paneli</h1>
          <p>Danışan kodunuzu girerek bilgilerinize erişin</p>
        </div>

        <form onSubmit={handleSubmit} className="client-access-form">
          <div className="form-group">
            <label htmlFor="accessCode">Danışan Kodu</label>
            <input
              type="text"
              id="accessCode"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Örn: A7B2X9"
              maxLength={6}
              className={error ? 'error' : ''}
              disabled={isLoading}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading || !accessCode.trim()}
          >
            {isLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="client-access-info">
          <h3>Nasıl Çalışır?</h3>
          <ul>
            <li>Diyetisyeninizden aldığınız 6 haneli kodu girin</li>
            <li>Kod otomatik olarak doğrulanacak</li>
            <li>Başarılı girişte bilgilerinize erişebilirsiniz</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ClientAccess; 