import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "./context/LanguageContext";
// CLERK_DISABLED_TEMP: import { useAuth, useUser } from "@clerk/clerk-react";
import './styles/animations.css';
import LandingPage from "./pages/landing";
import SignInPage from "./pages/auth/sign-in";
import SignUpPage from "./pages/auth/sign-up";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import VerifyEmailPage from "./pages/auth/verify-email";
import WelcomePage from "./pages/welcome";
import Dashboard from "./pages/dashboard";
import ProfilePage from "./pages/profile";
import SettingsPage from "./pages/settings";
import NotFoundPage from "./pages/404";
import CompleteProfilePage from "./pages/auth/complete-profile";
import SSOCallbackPage from "./pages/auth/sso-callback";
import AdminUsers from './pages/admin/users';
import AdminBlogs from './pages/admin/blogs';
import PendingPosts from './pages/admin/pending-posts';
import AdminRecipesPage from './pages/admin/recipes';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin';
import BlogManagement from './pages/admin/blog-management';
import BlogEdit from './pages/admin/blog-edit';
import BlogPage from './pages/blog';
import BlogPost from './pages/blog-post';
import Footer from './components/Footer';
import Hakkimizda from './pages/hakkimizda';
import RealNavbar from './components/RealNavbar.tsx';
import Layout from "./components/Layout";
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import CookiesPolicy from './pages/CookiesPolicy';
import KvkkInfo from './pages/KvkkInfo';
import PrivacyPreferences from './pages/PrivacyPreferences';
import DietitianInfo from './pages/DietitianInfo';
import ClientInfo from './pages/ClientInfo';
import ClinicInfo from './pages/ClinicInfo';
import SubscriptionPage from './pages/subscription';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import CalorieCalculator from './pages/calorie-calculator';
import DietitianPanel from './pages/dietitian-panel';
import ClientsPage from './pages/ClientsPage';
import ClientDetail from './pages/ClientDetail';

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hakkimizda" element={<Hakkimizda />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/sign-up/verify-email-address" element={<VerifyEmailPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dietitian-panel" element={<DietitianPanel />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/complete-profile" element={<CompleteProfilePage />} />
        <Route path="/sign-in/sso-callback" element={<SSOCallbackPage />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blogs" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminBlogs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/pending-posts" 
          element={
            <ProtectedRoute requiredRole="admin">
              <PendingPosts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/recipes" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminRecipesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blog-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <BlogManagement />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/blogs/edit/:id"
          element={
            <ProtectedRoute requiredRole="admin">
              <BlogEdit />
            </ProtectedRoute>
          } 
        />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/cookies" element={<CookiesPolicy />} />
        <Route path="/kvkk" element={<KvkkInfo />} />
        <Route path="/privacy-preferences" element={<PrivacyPreferences />} />
        <Route path="/dietitian-info" element={<DietitianInfo />} />
        <Route path="/client-info" element={<ClientInfo />} />
        <Route path="/clinic-info" element={<ClinicInfo />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/abonelikler" element={<SubscriptionPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
        <Route path="/calorimatik" element={<CalorieCalculator />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/client-detail/:id" element={<ClientDetail />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <AppRoutes />
      </Router>
    </ClerkProvider>
  );
}

export default App; 