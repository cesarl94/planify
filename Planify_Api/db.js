const mysql = require("mysql2");
const readline = require("readline");
const sqlParser = require("./sqlParser");
const flags = require("./flags.js");

const dbContainer = {
    db: Object,
};

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
    // Configurar la conexión a la base de datos
    dbContainer.db = mysql.createConnection({
        host: flags.SQLServerHost, // O 'localhost'
        user: flags.SQLServerUser, // Usuario root
        password: rootPassword, // Contraseña
        database: flags.SQLServerDatabase, // Nombre de la base de datos
        port: flags.SQLServerPort, // Puerto por defecto de MySQL
    });

    // Conectar a la base de datos
    dbContainer.db.connect((err) => {
        if (err) {
            console.error("Error al conectar a la base de datos:", err.message);
            return;
        }

        console.log("Conexión exitosa a la base de datos MySQL");

        if (flags.ExecuteSQLSentences) {
            dbContainer.db.query(`CREATE DATABASE IF NOT EXISTS ${flags.TestDBName}`, (err) => {
                if (err) {
                    console.error("Error al crear la base de datos:", err);
                    dbContainer.db.end();
                    return;
                }

                console.log("Base de datos creada o ya existía.");

                // Cambiar a la base de datos y ejecutar el script SQL
                dbContainer.db.changeUser({ database: flags.TestDBName }, (err) => {
                    if (err) {
                        console.error("Error al seleccionar la base de datos:\n", err);
                        dbContainer.db.end();
                        return;
                    }

                    const sqlSentences = sqlParser.getSqlSentences("basedepruebas.sql");

                    executeSqlSentences(dbContainer.db, sqlSentences)
                        .then(() => {
                            //dbContainer.db.end();
                        }) // Cerrar conexión al terminar
                        .catch((err) => {
                            console.error("Error durante la ejecución:", err);
                            dbContainer.db.end(); // Asegurarse de cerrar la conexión en caso de error
                        });
                });
            });
        }
    });

    rl.close();
});

module.exports = dbContainer; // Exportar el container de la conexión
