const express = require("express");
const cors = require("cors"); // Importar el paquete cors

const app = express();
const PORT = 4000;

const corsOptions = {
    origin: "http://localhost:3000",
};

// Middleware para habilitar CORS
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    require("./db");

    const router = require("./router");

    // Usar las rutas de estados
    app.use("/api", router);
});
