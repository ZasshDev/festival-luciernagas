import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import MyReservations from './pages/MyReservations';
import ReservationPage from './pages/ReservationPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Rules from './pages/Rules';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'CLIENT' | 'ADMIN' }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/rules" element={<Rules />} />
          <Route 
            path="/my-reservations" 
            element={
              <ProtectedRoute role="CLIENT">
                <MyReservations />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book/:id" 
            element={
              <ProtectedRoute role="CLIENT">
                <ReservationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
