const socketIO = require('socket.io');

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);

    // Unirse a una sala específica
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Cliente ${socket.id} se unió a la sala ${roomId}`);
    });

    // Salir de una sala
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`Cliente ${socket.id} salió de la sala ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO no inicializado');
  }
  return io;
};

module.exports = {
  initSocket,
  getIO
};