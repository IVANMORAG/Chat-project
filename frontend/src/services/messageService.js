import api from './api';

export const getMessages = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
};

export const sendMessage = async (roomId, content) => {
  const response = await api.post(`/rooms/${roomId}/messages`, { content });
  return response.data;
};