const express = require('express');
const router = express.Router();
const proxy = require('express-http-proxy');
const { authenticate } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimiter');

router.use(
  '/messages',
  apiLimiter,
  authenticate,
  proxy(process.env.MESSAGES_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api${req.url}`,
    limit: '10mb',
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Copia todos los headers originales
      proxyReqOpts.headers = { ...srcReq.headers };
      
      // Asegura los headers importantes
      if (srcReq.headers.authorization) {
        proxyReqOpts.headers.authorization = srcReq.headers.authorization;
      }
      
      // Agrega información del usuario
      if (srcReq.user) {
        proxyReqOpts.headers['X-User-Id'] = srcReq.user.id;
        proxyReqOpts.headers['X-User-Role'] = srcReq.user.role || 'user';
      }
      
      console.log('Headers enviados al servicio de salas:', proxyReqOpts.headers);
      return proxyReqOpts;
    }
  })
);

module.exports = router;