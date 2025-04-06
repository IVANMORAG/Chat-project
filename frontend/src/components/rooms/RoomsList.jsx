import { RoomCard } from './RoomCard';

export const RoomsList = ({ rooms }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {rooms.length > 0 ? (
        rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))
      ) : (
        <p className="text-gray-500">No hay salas disponibles</p>
      )}
    </div>
  );
};