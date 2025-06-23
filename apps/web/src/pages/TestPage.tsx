import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f3f4f6', 
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ color: '#1f2937', marginBottom: '1rem' }}>Test Sayfası</h1>
        <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
          Bu sayfa CSS stillerinin doğru yüklenip yüklenmediğini test etmek için oluşturulmuştur.
        </p>
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Test Kartı</h3>
          <p style={{ color: '#64748b', margin: 0 }}>
            Eğer bu kart görünüyorsa, CSS stilleri doğru yüklenmiştir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 