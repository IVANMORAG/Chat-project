// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  // Obtener el token de diferentes formas posibles
  const token = 
    req.headers.authorization?.split(' ')[1] || // Bearer Token
    req.query.token || // Token por query string
    req.body.token;    // Token en el cuerpo de la petición

  if (!token) {
    return res.status(401).json({ 
      message: 'No se proporcionó token de autenticación' 
    });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adjuntar la información del usuario decodificada a la solicitud
    req.user = decoded;
    
    next();
  } catch (error) {
    // Manejar diferentes tipos de errores de token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'El token ha expirado' 
      });
    }
    
    return res.status(401).json({ 
      message: 'Token inválido' 
    });
  }
};

// Middleware adicional para roles (opcional)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tienes permisos para realizar esta acción' 
      });
    }
    next();
  };
};