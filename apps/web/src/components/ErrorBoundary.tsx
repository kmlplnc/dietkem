import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            width: '100%'
          }}>
            <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>🚨 Bir Hata Oluştu</h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Uygulama beklenmeyen bir hatayla karşılaştı. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#1e293b',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginRight: '1rem'
              }}
            >
              Sayfayı Yenile
            </button>
            
            <button 
              onClick={() => window.history.back()}
              style={{
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Geri Dön
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ marginTop: '2rem', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#374151', fontWeight: '600' }}>
                  Hata Detayları (Geliştirici Modu)
                </summary>
                <div style={{ 
                  backgroundColor: '#f3f4f6', 
                  padding: '1rem', 
                  borderRadius: '6px', 
                  marginTop: '0.5rem',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  overflow: 'auto'
                }}>
                  <p><strong>Hata:</strong> {this.state.error.toString()}</p>
                  <p><strong>Stack:</strong></p>
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.error.stack}</pre>
                  {this.state.errorInfo && (
                    <>
                      <p><strong>Component Stack:</strong></p>
                      <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 