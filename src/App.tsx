import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store';

// Public Pages
import Home from './pages/public/Home';
import PortfolioDetail from './pages/public/PortfolioDetail';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import PortfolioList from './pages/admin/PortfolioList';
import PortfolioForm from './pages/admin/PortfolioForm';
import AdminSettings from './pages/admin/Settings';
import AdminLayout from './components/admin/AdminLayout';

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/dashboard-portfolio/login" replace />;
  
  return <>{children}</>;
};

function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetail />} />

          {/* Admin Routes */}
          <Route path="/dashboard-portfolio/login" element={<AdminLogin />} />
          <Route 
            path="/dashboard-portfolio" 
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="portfolio" element={<PortfolioList />} />
            <Route path="portfolio/new" element={<PortfolioForm />} />
            <Route path="portfolio/edit/:id" element={<PortfolioForm />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
