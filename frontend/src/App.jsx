import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import CookieBanner from './components/CookieBanner';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ObjectsPage from './pages/ObjectsPage';
import ContactPage from './pages/ContactPage';
import { DamageReportPage, KeyOrderPage, TenantChangePage } from './pages/FormsPages';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PortalPage from './pages/PortalPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/portal" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/portal'} replace />;
  return children;
}

function MainLayout({ children }) {
  return (<><Navbar /><div className="min-h-screen">{children}</div><Footer /><Chatbot /><CookieBanner /></>);
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-24">
      <div className="text-center">
        <p className="text-8xl font-black text-amber-500 mb-4">404</p>
        <h1 className="font-serif text-3xl font-bold text-slate-900 mb-4">Page Not Found</h1>
        <a href="/" className="bg-slate-900 text-white font-bold px-7 py-3 text-sm uppercase tracking-widest hover:bg-slate-700 transition-all inline-block">← Back to Home</a>
      </div>
    </div>
  );
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/services" element={<MainLayout><ServicesPage /></MainLayout>} />
        <Route path="/objects" element={<MainLayout><ObjectsPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />
        <Route path="/forms/damage" element={<MainLayout><DamageReportPage /></MainLayout>} />
        <Route path="/forms/key" element={<MainLayout><KeyOrderPage /></MainLayout>} />
        <Route path="/forms/tenant-change" element={<MainLayout><TenantChangePage /></MainLayout>} />
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/portal" element={<ProtectedRoute><PortalPage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="/admin/*" element={<AdminRoute><AdminPage /></AdminRoute>} />
        <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </AuthProvider>
    </LangProvider>
  );
}
