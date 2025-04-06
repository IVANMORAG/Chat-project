import { useAuth } from '../../contexts/AuthContext';

export const Message = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.sender._id === user?.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
        <div className="font-semibold">{message.sender.name}</div>
        <p>{message.content}</p>
        <div className="text-xs opacity-70 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};