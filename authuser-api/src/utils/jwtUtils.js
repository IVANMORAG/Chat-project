// utils/jwtUtils.js
const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '1h') => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      email: user.email // Puedes incluir más información si lo necesitas
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: expiresIn 
    }
  );
};

// Función para generar tokens con diferentes duraciones
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      type: 'refresh' 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '7d' // Token de refresco válido por 7 días
    }
  );
};

module.exports = { 
  generateToken, 
  generateRefreshToken 
};