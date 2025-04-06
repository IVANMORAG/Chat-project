import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Chat App</Link>
        <nav>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Hola, {user.name}</span>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <button 
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login" className="hover:underline">Iniciar sesión</Link>
              <Link to="/register" className="hover:underline">Registrarse</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};