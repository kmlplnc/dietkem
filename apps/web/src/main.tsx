import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Debug environment variables
console.log('All env vars:', import.meta.env);
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log('Clerk key:', clerkPubKey);

if (!clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

// Initialize Clerk with proper configuration
const clerkOptions = {
  publishableKey: clerkPubKey,
  appearance: {
    layout: {
      socialButtonsVariant: "iconButton",
      logoPlacement: "inside",
      showOptionalFields: true,
    },
  },
  routing: "path",
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  afterSignInUrl: "/dashboard",
  afterSignUpUrl: "/dashboard",
};

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root
const root = ReactDOM.createRoot(rootElement);

// Render app with error boundary
root.render(
  <React.StrictMode>
    <ClerkProvider {...clerkOptions}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
); 