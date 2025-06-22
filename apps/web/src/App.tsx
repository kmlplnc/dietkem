import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import DietitianPanel from './pages/dietitian-panel';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dietitian-panel" element={<DietitianPanel />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 