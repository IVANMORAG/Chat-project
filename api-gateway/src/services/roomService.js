const express = require('express');
const router = express.Router();
const proxy = require('express-http-proxy');
const { authenticate } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimiter');
const createError = require('http-errors');

router.use(
  '/rooms',
  apiLimiter,
  authenticate,
  proxy(process.env.ROOMS_SERVICE_URL, {
    proxyReqPathResolver: (req) => {
      // Mantén la estructura de rutas esperada por el servicio de salas
      return `/api${req.originalUrl}`;
    },
    limit: '10mb',
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Clona todos los headers importantes
      const headers = {
        ...srcReq.headers,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      // Asegura que el header de autorización se mantenga
      if (srcReq.headers.authorization) {
        headers['Authorization'] = srcReq.headers.authorization;
      }
      
      // Agrega headers de usuario
      if (srcReq.user) {
        headers['X-User-Id'] = srcReq.user.id;
        headers['X-User-Role'] = srcReq.user.role || 'user';
      }
      
      console.log('Headers enviados al servicio de salas:', headers);
      return { ...proxyReqOpts, headers };
    },
    proxyErrorHandler: (err, res, next) => {
      console.error('Error en proxy de rooms:', err);
      if (err.code === 'ECONNREFUSED') {
        next(createError(503, 'Servicio de salas no disponible'));
      } else {
        next(createError(502, 'Error al conectar con el servicio de salas'));
      }
    }
  })
);

module.exports = router;