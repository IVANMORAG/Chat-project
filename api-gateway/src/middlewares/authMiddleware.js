const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const axios = require('axios');

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw createError(401, 'Token de autenticación requerido');
    }

    try {
      // Verificar el token con el auth service
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        timeout: 5000 // 5 segundos de timeout
      });

      if (!response.data?.valid) {
        throw createError(401, 'Token inválido');
      }

      req.user = response.data.user;
      return next();
    } catch (error) {
      // Si falla la conexión con el auth service, verificar el token localmente
      if (error.code === 'ECONNABORTED' || error.code === 'ECONNREFUSED') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      }
      
      if (error.response) {
        throw createError(error.response.status, error.response.data?.message || 'Error de autenticación');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    try {
      if (roles.length && !roles.includes(req.user?.role)) {
        throw createError(403, 'No tienes permisos para esta acción');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  authenticate,
  authorize
};