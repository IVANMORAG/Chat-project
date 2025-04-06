import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
import { Loader } from './components/ui/Loader';
import { Navigate } from 'react-router-dom';

// Componente para rutas de invitados (no autenticados)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const App = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <Routes>
      {/* Ruta pública principal */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rutas para invitados (solo accesibles sin autenticación) */}
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />
      
      {/* Rutas protegidas (requieren autenticación) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      } />
      <Route path="/rooms/:roomId" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
      
      {/* Ruta de fallback (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;