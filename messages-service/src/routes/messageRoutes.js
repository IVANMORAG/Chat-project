const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getRoomMessages,
  editMessage,
  deleteMessage
} = require('../controllers/messageController');
const { authenticate, checkRoomMembership } = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para mensajes en una sala específica
router.post('/:roomId/messages', checkRoomMembership, sendMessage);
router.get('/:roomId/messages', checkRoomMembership, getRoomMessages);

// Rutas para operaciones específicas en mensajes
router.put('/messages/:messageId', checkRoomMembership, editMessage);
router.delete('/messages/:messageId', checkRoomMembership, deleteMessage);

module.exports = router;