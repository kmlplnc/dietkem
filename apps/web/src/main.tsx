import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// CLERK_DISABLED_TEMP: import { ClerkLocalizationProvider } from './components/ClerkLocalization';
import { LanguageProvider } from './context/LanguageContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TRPCProvider } from './utils/TRPCProvider';
import { AuthProvider } from './lib/auth.tsx';
import './index.css';

// Debug environment variables
console.log('All env vars:', import.meta.env);
// CLERK_DISABLED_TEMP: const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
// CLERK_DISABLED_TEMP: console.log('Clerk key:', clerkPubKey);

// CLERK_DISABLED_TEMP: if (!clerkPubKey) {
// CLERK_DISABLED_TEMP:   throw new Error('Missing Clerk Publishable Key');
// CLERK_DISABLED_TEMP: }

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root
const root = ReactDOM.createRoot(rootElement);

// Create query client
const queryClient = new QueryClient();

// Render app with error boundary
root.render(
  <React.StrictMode>
    <TRPCProvider queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            {/* CLERK_DISABLED_TEMP: <ClerkLocalizationProvider> */}
              <App />
            {/* CLERK_DISABLED_TEMP: </ClerkLocalizationProvider> */}
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </TRPCProvider>
  </React.StrictMode>
);
