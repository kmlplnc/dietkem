import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from './utils/TRPCProvider';
import { AuthProvider } from './lib/auth.tsx';
import './index.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root
const root = ReactDOM.createRoot(rootElement);

// Create query client
const queryClient = new QueryClient();

// Render app with all providers
root.render(
  <React.StrictMode>
    <TRPCProvider queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </TRPCProvider>
  </React.StrictMode>
);
