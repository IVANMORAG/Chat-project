const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin'
};

mongoose.connect(MONGO_URI, connectionOptions)
  .then(() => {
    console.log('Conexión a MongoDB exitosa');
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err);
    console.error('Detalles del error:', err.message);
  });