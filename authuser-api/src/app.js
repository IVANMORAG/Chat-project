// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Configuración de CORS más permisiva
app.use(cors({
  origin: '*', // Permite solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'] // Cabeceras permitidas
}));

// Middlewares
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

module.exports = app;