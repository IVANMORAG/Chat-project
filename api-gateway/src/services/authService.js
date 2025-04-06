const express = require('express');
const router = express.Router();
const proxy = require('express-http-proxy');
const { authLimiter } = require('../middlewares/rateLimiter');

router.use(
  '/auth',
  authLimiter,
  proxy(process.env.AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/auth${req.url}`,
    limit: '10mb'
  })
);

module.exports = router;