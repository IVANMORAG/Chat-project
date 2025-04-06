import api from './api';

export const createRoom = async (roomData) => {
  const response = await api.post('/rooms', roomData);
  return response.data;
};

export const getRooms = async () => {
  const response = await api.get('/rooms');
  return response.data;
};

export const joinRoom = async (roomId) => {
  const response = await api.post(`/rooms/${roomId}/join`);
  return response.data;
};

export const getRoomDetails = async (roomId) => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data;
};