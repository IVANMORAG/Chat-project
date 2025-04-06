import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { getMessages, sendMessage } from '../services/messageService';
import { getRoomDetails } from '../services/roomService';
import { MessagesList } from '../components/chat/MessagesList';
import { MessageForm } from '../components/chat/MessageForm';

export const ChatPage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomData, messagesData] = await Promise.all([
          getRoomDetails(roomId),
          getMessages(roomId)
        ]);
        setRoom(roomData.data);
        setMessages(messagesData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    if (socket) {
      socket.emit('joinRoom', roomId);
      socket.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
        socket.emit('leaveRoom', roomId);
      }
    };
  }, [roomId, socket]);

  const handleSendMessage = async (content) => {
    try {
      const { data } = await sendMessage(roomId, content);
      if (socket) {
        socket.emit('sendMessage', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="flex flex-col h-screen">
      <div className="bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">{room?.name}</h2>
        <p className="text-sm">{room?.description}</p>
      </div>
      <MessagesList messages={messages} />
      <MessageForm roomId={roomId} onSendMessage={handleSendMessage} />
    </div>
  );
};