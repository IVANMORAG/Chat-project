const jwt = require('jsonwebtoken');
const createError = require('http-errors');

// Asegúrate de que esto sea una función middleware válida
const authenticate = (req, res, next) => {
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

// Exporta CORRECTAMENTE el middleware
module.exports = {
  authenticate,
  checkRoomPermissions: (roles = []) => (req, res, next) => {
    // Tu implementación de checkRoomPermissions
    try {
      if (roles.length && !roles.includes(req.user?.role)) {
        throw createError(403, 'No tienes permisos para esta acción');
      }
      next();
    } catch (error) {
      next(error);
    }
  }
};