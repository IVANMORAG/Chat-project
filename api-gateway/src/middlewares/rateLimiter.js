const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    success: false,
    error: {
      message: 'Demasiadas solicitudes desde esta IP, por favor intenta nuevamente más tarde'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: {
      message: 'Demasiados intentos de autenticación, por favor intenta nuevamente en una hora'
    }
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};