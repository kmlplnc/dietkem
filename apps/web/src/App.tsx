import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/landing";
import Dashboard from "./pages/dashboard";
import DietitianPanel from './pages/dietitian-panel';
import TestPage from './pages/TestPage';
import NotFoundPage from './pages/404';
import BlogPage from './pages/blog';
import BlogPostPage from './pages/blog-post';
import HakkimizdaPage from './pages/hakkimizda';
import PrivacyPolicyPage from './pages/PrivacyPolicy';
import TermsOfUsePage from './pages/TermsOfUse';
import KvkkInfoPage from './pages/KvkkInfo';
import CookiesPolicyPage from './pages/CookiesPolicy';
import ClientInfoPage from './pages/ClientInfo';
import ClientAccessPage from './pages/client-access';
import ClientDashboardPage from './pages/client-dashboard';
import WelcomePage from './pages/welcome';
import ProfilePage from './pages/profile';
import CalorieCalculatorPage from './pages/calorie-calculator';
import SubscriptionPage from './pages/subscription';
import SettingsPage from './pages/settings';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import SignInPage from './pages/auth/sign-in';
import SignUpPage from './pages/auth/sign-up';
import CompleteProfilePage from './pages/auth/complete-profile';
import VerifyEmailPage from './pages/auth/verify-email';
import SSOCallbackPage from './pages/auth/sso-callback';
import AdminDashboardPage from './pages/admin/index';
import AdminUsersPage from './pages/admin/users';
import AdminBlogManagementPage from './pages/admin/blog-management';
import AdminPendingPostsPage from './pages/admin/pending-posts';
import AdminRecipesPage from './pages/admin/recipes';
import AdminBlogsPage from './pages/admin/blogs';
import AdminBlogEditPage from './pages/admin/blog-edit';
import RecipesPage from './pages/recipes/RecipesPage';
import RecipeDetailPage from './pages/recipes/RecipeDetailPage';
import ClientDetailPage from './pages/ClientDetail';
import ClientProgressPage from './pages/ClientProgress';
import ClientsPage from './pages/ClientsPage';
import ClinicInfoPage from './pages/ClinicInfo';
import DietitianInfoPage from './pages/DietitianInfo';
import PrivacyPreferencesPage from './pages/PrivacyPreferences';
import FullScreenCallPage from './pages/FullScreenCallPage';
import PlaceholderPage from './pages/PlaceholderPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Ana Sayfalar */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dietitian-panel" element={<DietitianPanel />} />
          <Route path="/test" element={<TestPage />} />
          
          {/* Blog Sayfaları */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          
          {/* Bilgi Sayfaları */}
          <Route path="/hakkimizda" element={<HakkimizdaPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfUsePage />} />
          <Route path="/kvkk" element={<KvkkInfoPage />} />
          <Route path="/cookies" element={<CookiesPolicyPage />} />
          <Route path="/client-info" element={<ClientInfoPage />} />
          <Route path="/clinic-info" element={<ClinicInfoPage />} />
          <Route path="/dietitian-info" element={<DietitianInfoPage />} />
          <Route path="/privacy-preferences" element={<PrivacyPreferencesPage />} />
          
          {/* Müşteri Sayfaları */}
          <Route path="/client-access" element={<ClientAccessPage />} />
          <Route path="/client-dashboard" element={<ClientDashboardPage />} />
          <Route path="/client-detail/:id" element={<ClientDetailPage />} />
          <Route path="/client-progress/:id" element={<ClientProgressPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          
          {/* Kullanıcı Sayfaları */}
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/calorie-calculator" element={<CalorieCalculatorPage />} />
          <Route path="/calorimatik" element={<CalorieCalculatorPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/abonelikler" element={<SubscriptionPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/ai-plan" element={<PlaceholderPage title="AI Planı" description="Bu sayfa yakında eklenecek. Yapay zeka destekli beslenme planı oluşturma özelliği geliştiriliyor." />} />
          
          {/* Auth Sayfaları */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/sso-callback" element={<SSOCallbackPage />} />
          
          {/* Admin Sayfaları */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/blog-management" element={<AdminBlogManagementPage />} />
          <Route path="/admin/pending-posts" element={<AdminPendingPostsPage />} />
          <Route path="/admin/recipes" element={<AdminRecipesPage />} />
          <Route path="/admin/blogs" element={<AdminBlogsPage />} />
          <Route path="/admin/blog-edit/:id" element={<AdminBlogEditPage />} />
          
          {/* Tarif Sayfaları */}
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          
          {/* Video Görüşme Sayfaları */}
          <Route path="/fullscreen-call" element={<FullScreenCallPage />} />
          
          {/* 404 Sayfası */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App; 