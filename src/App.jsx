import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import { trpc, trpcClient } from '../apps/web/src/utils/trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <div className="app">
            <Navbar />
            {/* ... rest of your app components */}
          </div>
        </LanguageProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App; 