const express = require('express');
const EstadosRoutes = require('./Estados/Estados'); // Importar las rutas de usuarios

const app = express();
const PORT = 4000;

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de usuarios
app.use('/api', EstadosRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
