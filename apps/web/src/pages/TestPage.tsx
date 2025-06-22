import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#333', fontSize: '2.5rem', marginBottom: '20px' }}>
        🧪 Test Sayfası
      </h1>
      
      <p style={{ color: '#666', fontSize: '1.2rem', marginBottom: '30px' }}>
        React uygulaması çalışıyor mu test ediyoruz
      </p>
      
      <div style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#4CAF50', marginBottom: '20px' }}>✅ Başarılı!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Bu sayfa görünüyorsa React uygulaması düzgün çalışıyor demektir.
        </p>
        
        <div style={{
          backgroundColor: '#E8F5E8',
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
      </div>
      
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            backgroundColor: '#2196F3',
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
      
      <div style={{ marginTop: '30px', color: '#999', fontSize: '14px' }}>
        <p>Bu test sayfası React uygulamasının temel işlevselliğini kontrol eder.</p>
        <p>Eğer bu sayfa görünüyorsa, beyaz ekran sorunu çözülmüş demektir! 🎉</p>
      </div>
    </div>
  );
};

export default TestPage; 