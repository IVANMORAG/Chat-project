const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const axios = require('axios');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError(401, 'Token de autenticación requerido');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(createError(401, 'Token inválido o expirado'));
  }
};

const checkRoomMembership = async (req, res, next) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.user.id;

    // Verificar con el rooms-service si el usuario es miembro
    const response = await axios.get(`${process.env.ROOMS_SERVICE_URL}/${roomId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    const room = response.data.data;
    const isMember = room.members.some(member => member.user._id === userId);

    if (!isMember) {
      throw createError(403, 'No eres miembro de esta sala');
    }

    req.room = room;
    next();
  } catch (error) {
    if (error.response) {
      // Error de la API de rooms
      next(createError(error.response.status, error.response.data.error?.message || 'Error al verificar membresía'));
    } else {
      next(error);
    }
  }
};

module.exports = {
  authenticate,
  checkRoomMembership
};