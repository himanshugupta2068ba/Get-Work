import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const initSocket = (userId) => {
  const socket = io(API_URL, {
    withCredentials: true,
  });

  // Join user-specific room
  if (userId) {
    socket.emit('join', `user_${userId}`);
  }

  return socket;
};

