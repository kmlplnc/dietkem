import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
// ... other imports

function App() {
  return (
    <LanguageProvider>
      <div className="app">
        <Navbar />
        {/* ... rest of your app components */}
      </div>
    </LanguageProvider>
  );
}

export default App; 