const express = require('express');
const cors = require('cors');  // Importar el paquete cors
const EstadosRoutes = require('./Estados/Estados'); // Importar las rutas de usuarios
const TaskRoutes = require('./Task/Taks'); // Importar las rutas de usuarios

const app = express();
const PORT = 4000;


const corsOptions = {
    origin: 'http://localhost:3000'
  };

// Middleware para habilitar CORS
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas de estados
app.use('/api', EstadosRoutes);
app.use('/api', TaskRoutes);
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
