const express = require('express');
const router = express.Router();

// Importa CORRECTAMENTE los middlewares
const { authenticate, checkRoomPermissions } = require('../middlewares/authMiddleware');

// Importa los controladores
const {
  createRoom,
  getAllRooms,
  getRoomDetails,
  updateRoom,
  deleteRoom,
  joinRoom,
  leaveRoom
} = require('../controllers/roomController');

// Aplica autenticación a TODAS las rutas
router.use(authenticate);  // Esto ahora debería funcionar

// Configuración de rutas
router.post('/', createRoom);
router.get('/', getAllRooms);

router.get('/:id', checkRoomPermissions(), getRoomDetails);
router.put('/:id', checkRoomPermissions(['admin']), updateRoom);
router.delete('/:id', checkRoomPermissions(['admin']), deleteRoom);

router.post('/:id/join', joinRoom);
router.post('/:id/leave', checkRoomPermissions(), leaveRoom);

module.exports = router;