import { Link } from 'react-router-dom';

export const RoomCard = ({ room }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <h3 className="font-bold text-lg">{room.name}</h3>
      <p className="text-gray-600 text-sm mb-2">{room.description || 'Sin descripción'}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Creada por: {room.createdBy.name}
        </span>
        <Link 
          to={`/rooms/${room._id}`}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
};