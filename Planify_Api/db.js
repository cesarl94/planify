const mysql = require("mysql2");
const fs = require("fs");
const readline = require("readline");

// Configurar la conexión a la base de datos

let sqlScript = fs.readFileSync("tp_basededatos.sql", "utf8");
sqlScript = sqlScript.replaceAll("\n", "");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Ingrese root password: ", (rootPassword) => {
    const db = mysql.createConnection({
        host: "127.0.0.1", // O 'localhost'
        user: "root", // Usuario root
        password: rootPassword, // Contraseña
        database: "tp_basededatos", // Nombre de la base de datos
        port: 3306, // Puerto por defecto de MySQL
    });

    // Conectar a la base de datos
    db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos:", err.message);
            return;
        }

        console.log("Conexión exitosa a la base de datos MySQL");

        db.query("CREATE DATABASE IF NOT EXISTS tp_basededatos", (err) => {
            if (err) {
                console.error("Error al crear la base de datos:", err);
                db.end();
                return;
            }

            console.log("Base de datos creada o ya existía.");

            // Cambiar a la base de datos y ejecutar el script SQL
            db.changeUser({ database: "tp_basededatos" }, (err) => {
                if (err) {
                    console.error("Error al seleccionar la base de datos:\n", err);
                    db.end();
                    return;
                }

                db.query(sqlScript, (err) => {
                    if (err) {
                        console.error("Error al ejecutar el script SQL:", err);
                    } else {
                        console.log("Script SQL ejecutado correctamente.");
                    }
                    db.end();
                });
            });
        });
    });

    module.exports = db; // Exportar la conexión

    rl.close();
});
