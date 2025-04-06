import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RoomsList } from '../components/rooms/RoomsList';
import { CreateRoomModal } from '../components/rooms/CreateRoomModal';
import { getRooms } from '../services/roomService';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hola, {user?.name}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Crear Sala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-4">Tus Salas</h2>
          <RoomsList 
            rooms={rooms.filter(room => room.createdBy._id === user?.id)} 
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Salas Unidas</h2>
          <RoomsList 
            rooms={rooms.filter(room => 
              room.members.some(member => member.user._id === user?.id) && 
              room.createdBy._id !== user?.id
            )} 
          />
        </div>
      </div>

      <CreateRoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onRoomCreated={(newRoom) => setRooms([...rooms, newRoom])}
      />
    </div>
  );
};