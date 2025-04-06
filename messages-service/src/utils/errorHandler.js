const createError = require('http-errors');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = req.app.get('env') === 'development' ? 
    err.message : 
    'Ocurrió un error en el servidor';

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(req.app.get('env') === 'development' && { stack: err.stack })
    }
  });
};

const notFoundHandler = (req, res, next) => {
  next(createError(404, 'Recurso no encontrado'));
};

module.exports = {
  errorHandler,
  notFoundHandler
};