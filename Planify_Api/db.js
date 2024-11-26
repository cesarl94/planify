const mysql = require("mysql2");
const readline = require("readline");
const sqlParser = require("./sqlParser");
const flags = require("./flags.js");

// Configurar la conexión a la base de datos

// Función para convertir la ejecución de db.query en una promesa
function executeQuery(db, sqlSentence) {
    return new Promise((resolve, reject) => {
        db.query(sqlSentence, (err) => {
            if (err) {
                console.error("Error al ejecutar el script SQL:", sqlSentence, " ", err);
                reject(err);
            } else {
                console.log("Script SQL ejecutado correctamente.");
                resolve();
            }
        });
    });
}

// Función principal para ejecutar todas las sentencias en orden
async function executeSqlSentences(db, sqlSentences) {
    for (const sentence of sqlSentences) {
        try {
            await executeQuery(db, sentence); // Espera a que la query actual termine
        } catch (err) {
            console.error("Se detuvo la ejecución debido a un error.");
            return; // Detenemos el proceso si hay un error
        }
    }
    console.log("Todas las sentencias SQL se ejecutaron correctamente.");
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question("Ingrese root password: ", (rootPassword) => {
    const db = mysql.createConnection({
        host: flags.SQLServerHost, // O 'localhost'
        user: flags.SQLServerUser, // Usuario root
        password: rootPassword, // Contraseña
        database: flags.SQLServerDatabase, // Nombre de la base de datos
        port: flags.SQLServerPort, // Puerto por defecto de MySQL
    });

    // Conectar a la base de datos
    db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos:", err.message);
            return;
        }

        console.log("Conexión exitosa a la base de datos MySQL");

        if (flags.ExecuteSQLSentences) {
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

                    const sqlSentences = sqlParser.getSqlSentences("tp_basededatos.sql");

                    executeSqlSentences(db, sqlSentences)
                        .then(() => {
                            db.end();
                        }) // Cerrar conexión al terminar
                        .catch((err) => {
                            console.error("Error durante la ejecución:", err);
                            db.end(); // Asegurarse de cerrar la conexión en caso de error
                        });
                });
            });
        }
    });

    module.exports = db; // Exportar la conexión

    rl.close();
});
