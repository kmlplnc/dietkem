import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ClerkLocalizationProvider } from './components/ClerkLocalization';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// Debug environment variables
console.log('All env vars:', import.meta.env);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log('Clerk key:', clerkPubKey);

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root
const root = ReactDOM.createRoot(rootElement);

// Render app with error boundary
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <ClerkLocalizationProvider>
        <App />
      </ClerkLocalizationProvider>
    </LanguageProvider>
  </React.StrictMode>
);
