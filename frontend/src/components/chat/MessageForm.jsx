import { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';

export const MessageForm = ({ roomId, onSendMessage }) => {
  const [content, setContent] = useState('');
  const socket = useSocket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      if (socket) {
        socket.emit('sendMessage', { roomId, content });
      }
      
      // También llamamos a onSendMessage si está definido
      if (onSendMessage) {
        onSendMessage(content);
      }
      
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4 p-4 bg-white border-t">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 p-2 border rounded-lg"
        placeholder="Escribe un mensaje..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Enviar
      </button>
    </form>
  );
};