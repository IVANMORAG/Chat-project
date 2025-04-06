const createError = require('http-errors');

// Error handler para enviar respuestas consistentes
const errorHandler = (err, req, res, next) => {
  // Si el error ya tiene un código de estado, usarlo, sino 500
  const status = err.status || 500;
  
  // En producción, no enviar detalles del error
  const message = req.app.get('env') === 'development' ? 
    err.message : 
    'Ocurrió un error en el servidor';

  // Responder con el error
  res.status(status).json({
    success: false,
    error: {
      status: status,
      message: message,
      ...(req.app.get('env') === 'development' && { stack: err.stack })
    }
  });
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Recurso no encontrado'));
};

module.exports = {
  errorHandler,
  notFoundHandler
};