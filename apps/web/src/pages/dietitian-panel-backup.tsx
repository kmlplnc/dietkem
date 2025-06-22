import React from 'react';

const DietitianPanel: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem', marginBottom: '20px' }}>
        👨‍⚕️ Diyetisyen Paneli
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#2196F3', marginBottom: '20px' }}>✅ Diyetisyen Paneli Çalışıyor!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Bu basit diyetisyen paneli sayfası. Eğer bu görünüyorsa, temel yapı çalışıyor demektir.
        </p>
        
        <div style={{
          backgroundColor: '#E3F2FD',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>Test Bilgileri:</h3>
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0 }}>
            <li>🕒 Zaman: {new Date().toLocaleString('tr-TR')}</li>
            <li>🌐 URL: {window.location.href}</li>
            <li>📱 Tarayıcı: {navigator.userAgent.substring(0, 50)}...</li>
          </ul>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🏠 Ana Sayfa
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard'}
            style={{
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            📊 Dashboard
          </button>
          
          <button 
            onClick={() => window.history.back()}
            style={{
              backgroundColor: '#9C27B0',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ⬅️ Geri Dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default DietitianPanel;