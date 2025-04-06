import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Bienvenido al Chat App</h1>
        <p className="text-xl mb-8">
          Conéctate con tus amigos y colegas en salas de chat en tiempo real
        </p>
        {user ? (
          <Link
            to="/dashboard"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
          >
            Ir al Dashboard
          </Link>
        ) : (
          <div className="flex justify-center gap-4">
            <Link
              to="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};