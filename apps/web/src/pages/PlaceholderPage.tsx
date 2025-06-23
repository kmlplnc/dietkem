import React from 'react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
  backPath?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, backPath = '/' }) => {
  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        padding: '3rem 2rem',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          {title}
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          {description}
        </p>
        <Link 
          to={backPath}
          style={{
            display: 'inline-block',
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default PlaceholderPage; 