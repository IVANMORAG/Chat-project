require('dotenv').config();
const express = require('express');
const cors = require('cors');
const requestLogger = require('./utils/requestLogger');
const responseFormatter = require('./utils/responseFormatter');
const { notFoundHandler, errorHandler } = require('./utils/errorHandler');
const authService = require('./services/authService');
const roomService = require('./services/roomService');
const messageService = require('./services/messageService');

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-User-Id',
    'X-User-Role'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware para manejar preflight requests
app.options('*', cors(corsOptions));

// Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);
app.use(responseFormatter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Rutas de servicios
app.use(authService);
app.use(roomService);
app.use(messageService);

// Manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`API Gateway corriendo en http://${HOST}:${PORT}`);
});