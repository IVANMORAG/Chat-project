import { useEffect, useRef } from 'react';
import { Message } from './Message';
import { useSocket } from '../../contexts/SocketContext';

export const MessagesList = ({ messages }) => {
  const messagesEndRef = useRef(null);
  const socket = useSocket();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-2">
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};