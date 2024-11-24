const mysql = require('mysql2');

// Configurar la conexión a la base de datos

const db = mysql.createConnection({
  host: '127.0.0.1',      // O 'localhost'
  user: 'root',           // Usuario root
  password: '1234',       // Contraseña
  database: 'tp_basededatos',  // Nombre de la base de datos
  port: 3306              // Puerto por defecto de MySQL
});



// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

module.exports = db; // Exportar la conexión
