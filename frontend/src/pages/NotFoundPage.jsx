import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Página no encontrada</p>
      <Link
        to="/"
        className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;