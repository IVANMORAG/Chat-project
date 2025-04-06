const createError = require('http-errors');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Ocurrió un error en el servidor';

  logger.error(`${status} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  res.status(status).json({
    success: false,
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
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