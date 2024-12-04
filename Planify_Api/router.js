const { validateEmail, validateName, sortByProp, parseSecureInt } = require("../playnify_shared/utils");
const { getMySQLDateFormat, isValidBcryptHash } = require("./apiutils");
const express = require("express");
const bcrypt = require("bcrypt");
const dbContainer = require("./db");

const router = express.Router();

router.get("/estados", (req, res) => {
    const query = "SELECT * FROM estados";
    dbContainer.db.query(query, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get("/estados/tareas", (req, res) => {
    const query = `
        SELECT  
            e.id_estado, 
            e.Nombre, 
            t.id_tarea, 
            t.nombre, 
            t.descripcion, 
            CONCAT(u.Nombre, ' ', u.apellido) AS 'Nombre_apellido'
        FROM estados e
        INNER JOIN tareas t ON t.id_estado = e.id_estado
        INNER JOIN usuarios_tareas ut ON ut.id_tarea = t.id_tarea
        INNER JOIN usuarios u ON u.id_usuario = ut.id_usuario
    `;
    dbContainer.db.query(query, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get("/board", async (httpReq, httpRes) => {
    const estados = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM estados`, (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
            } else {
                promRes(sqlRes);
            }
        });
    }).catch((promErr) => {
        httpRes.status(400).json({ error: promErr });
        return null;
    });

    if (estados == null) {
        return;
    }

    const tareas = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM tareas`, (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
            } else {
                promRes(sqlRes);
            }
        });
    }).catch((promErr) => {
        httpRes.status(400).json({ error: promErr });
        return null;
    });

    if (tareas == null) {
        return;
    }

    const usuarios_tareas = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM usuarios_tareas`, (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
            } else {
                promRes(sqlRes);
            }
        });
    }).catch((promErr) => {
        httpRes.status(400).json({ error: promErr });
        return null;
    });

    if (usuarios_tareas == null) {
        return;
    }

    const usuarios = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM usuarios`, (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
            } else {
                promRes(sqlRes);
            }
        });
    }).catch((promErr) => {
        httpRes.status(400).json({ error: promErr });
        return null;
    });

    if (usuarios == null) {
        return;
    }

    sortByProp(estados, "orden");

    const returnValue = { estados: [] };

    for (let i = 0; i < estados.length; i++) {
        const estadoSQL = estados[i];
        const tareas_estadoSQL = sortByProp(
            tareas.filter((task) => task.id_estado == estadoSQL.id_estado),
            "orden"
        );

        const tareas_estado = [];

        for (let j = 0; j < tareas_estadoSQL.length; j++) {
            const tarea = tareas_estadoSQL[j];
            const usuarios_tarea = usuarios_tareas.filter((usuario_tarea) => usuario_tarea.id_tarea == tarea.id_tarea);
            const usuarios_filtered = usuarios.filter((usuario) => usuarios_tarea.some((usuario_tarea) => usuario_tarea.id_usuario == usuario.id_usuario));

            const tareaJSON = {
                id_tarea: tarea.id_tarea,
                nombre: tarea.nombre,
                prioridad: tarea.prioridad,
                orden: tarea.orden,
                usuarios: usuarios_filtered.map((usuario) => usuario.id_usuario),
            };

            tareas_estado.push(tareaJSON);
        }

        const estadoJSON = {
            id_estado: estadoSQL.id_estado,
            nombre: estadoSQL.nombre,
            orden: estadoSQL.orden,
            tareas: tareas_estado,
        };

        returnValue.estados.push(estadoJSON);
    }

    httpRes.status(200).json(returnValue);
});

router.get("/task/:id", async (req, res) => {
    const id_tarea = req.params.id;

    const id_tarea_integer = parseSecureInt(id_tarea);

    if (isNaN(id_tarea_integer)) {
        res.status(400).json({ error: "Provided task_id is invalid" });
        return;
    }

    const task = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM tareas WHERE id_tarea = ?`, [id_tarea_integer], (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
                return;
            }

            if (sqlRes.length == 0) {
                promRej(`There isn't any task with the id: ${id_tarea_integer}`);
                return;
            }

            promRes(sqlRes[0]);
        });
    }).catch((promErr) => {
        res.status(400).json({ error: promErr });
        return null;
    });

    if (task == null) {
        return;
    }

    const task_users_ids = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT id_usuario FROM usuarios_tareas WHERE id_tarea = ?`, [id_tarea_integer], (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
                return;
            }

            promRes(sqlRes.map((userStruct) => userStruct.id_usuario));
        });
    }).catch((promErr) => {
        res.status(400).json({ error: promErr });
        return null;
    });

    if (task_users_ids == null) {
        return;
    }

    task.usuarios = task_users_ids;
    res.status(200).json(task);
});

router.get("/users", (req, res) => {
    const query = "SELECT id_usuario, nombre, apellido, foto_perfil FROM usuarios";
    dbContainer.db.execute(query, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(200).json(results);
        }
    });
});

router.get("/user/:id", (req, res) => {
    const user_id = req.params.id;

    const user_id_integer = parseSecureInt(user_id);

    if (isNaN(user_id_integer)) {
        res.status(400).json({ error: "Provided user_id is invalid" });
        return;
    }

    dbContainer.db.execute(`SELECT id_usuario, nombre, apellido, foto_perfil FROM usuarios WHERE id_usuario = ?`, [user_id_integer], (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        if (results.length == 0) {
            res.status(400).json({ error: `There isn't any user with the id: ${user_id_integer}` });
            return;
        }

        res.status(200).json(results[0]);
    });
});

router.post("/newstate", (req, res) => {
    const nombre = req.body.nombre;
    const orden = req.body.orden;

    if (nombre == undefined || orden == undefined) {
        res.status(400).json({ error: "Missing data. Required data: nombre, orden" });
        return;
    }

    const nameValidation = validateName(nombre, 1, 50, true);
    if (!nameValidation.valid) {
        res.status(400).json({ error: nameValidation.error });
        return;
    }

    dbContainer.db.execute(`INSERT INTO estados (nombre, orden) VALUES (?, ?)`, [nombre, orden], (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const id_estado = results.insertId;

        res.status(201).json({ id_estado, nombre, orden });
    });
});

router.post("/newregister", async (req, res) => {
    const correo = req.body.correo;
    const password = req.body.password;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;

    if (correo == undefined || password == undefined || nombre == undefined || apellido == undefined) {
        res.status(400).json({ error: "Missing data. Required data: correo, password, nombre, apellido" });
        return;
    }

    const mailValidation = validateEmail(correo);
    if (!mailValidation.valid) {
        res.status(400).json({ error: mailValidation.error });
        return;
    }

    if (password.length < 8) {
        res.status(400).json({ error: "password must be at least 8 characters long" });
        return;
    }

    const hash = await new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                reject(err.message); // handle error
            } else {
                resolve(hash);
            }
        });
    }).catch((error) => {
        console.log("bcrypt error:", error);
        res.status(400).json({ error: "There was a problem with your password" });
        return null;
    });

    if (hash === null) {
        return;
    }

    const nameValidation = validateName(nombre, 3, 100, false);
    if (!nameValidation.valid) {
        res.status(400).json({ error: nameValidation.error });
        return;
    }

    const lastNameValidation = validateName(apellido, 3, 100, false);
    if (!lastNameValidation.valid) {
        res.status(400).json({ error: lastNameValidation.error });
        return;
    }

    dbContainer.db.execute(`INSERT INTO usuarios (correo, hash, nombre, apellido) VALUES (?, ?, ?, ?)`, [correo, hash, nombre, apellido], (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            const id_usuario = results.insertId;
            res.status(201).json({ id_usuario, correo, nombre, apellido });
        }
    });
});

router.post("/newtask", (req, res) => {
    const nombre = req.body.nombre;
    const orden = req.body.orden;
    const id_estado = req.body.id_estado;

    if (nombre == undefined || orden == undefined || id_estado == undefined) {
        res.status(400).json({ error: "Missing data. Required data: nombre, orden, id_estado" });
        return;
    }

    const nameValidation = validateName(nombre, 1, 100, true);
    if (!nameValidation.valid) {
        res.status(400).json({ error: nameValidation.error });
        return;
    }

    const mysqlDate = getMySQLDateFormat(new Date());

    dbContainer.db.execute(`INSERT INTO tareas (nombre, orden, id_estado, fecha_creacion) VALUES (?, ?, ?, ?)`, [nombre, orden, id_estado, mysqlDate], (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        const id_tarea = results.insertId;

        res.status(201).json({
            id_tarea,
            nombre,
            orden,
            id_estado,
            fecha_creacion: mysqlDate,
        });
    });
});

router.patch("/updatestate", (req, res) => {
    const id_estado = req.body.id_estado;
    const orden = req.body.orden;
    const nombre = req.body.nombre;

    if (id_estado == undefined || (orden == undefined && nombre == undefined)) {
        res.status(400).json({ error: "Missing data. Required data: id_estado && (orden || nombre)" });
        return;
    }

    if (id_estado < 1) {
        res.status(400).json({ error: "The value 'id_estado' can't be less than 1" });
        return;
    }

    if (nombre != undefined) {
        const nameValidation = validateName(nombre, 1, 50, true);
        if (!nameValidation.valid) {
            res.status(400).json({ error: nameValidation.error });
            return;
        }
    }

    const ordenQuery = orden != undefined ? ` orden = ? ` : ``;
    const nombreQuery = nombre != undefined ? ` nombre = ? ` : ``;
    const optionalComma = orden != undefined && nombre != undefined ? `,` : ``;
    const params = [];
    if (orden != undefined) {
        params.push(orden);
    }
    if (nombre != undefined) {
        params.push(nombre);
    }
    params.push(id_estado);

    dbContainer.db.execute(`UPDATE estados SET ${ordenQuery}${optionalComma}${nombreQuery} WHERE id_estado = ?`, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }

        // It verifies if no one row was updated
        if (results.affectedRows == 0) {
            res.status(400).json({ error: "Provided value 'id_estado' isn't in our data base." });
            return;
        }

        res.status(200).json({
            id_estado,
            nombre,
            orden,
        });
    });
});

router.patch("/updatetask", async (req, res) => {
    const id_tarea = req.body.id_tarea;

    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const fecha_limite = req.body.fecha_limite;
    const orden = req.body.orden;
    const prioridad = req.body.prioridad;
    const id_estado = req.body.id_estado;
    const usuarios = req.body.usuarios;

    if (
        id_tarea == undefined ||
        (nombre == undefined && descripcion == undefined && fecha_limite == undefined && orden == undefined && prioridad == undefined && id_estado == undefined && usuarios == undefined)
    ) {
        res.status(400).json({ error: "Missing data. Required data: id_tarea && (nombre || descripcion || fecha_limite || orden || prioridad || id_estado || usuarios)" });
        return;
    }

    const saved_task = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT * FROM tareas WHERE id_tarea = ?`, [id_tarea], (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
                return;
            }

            // It verifies if no one task were found
            if (sqlRes.length == 0) {
                promRej("Provided value 'id_tarea' isn't in our data base.");
                return;
            }

            promRes(sqlRes[0]);
        });
    }).catch((promErr) => {
        res.status(400).json({ error: promErr });
        return null;
    });

    if (saved_task == null) {
        return;
    }

    const new_task_values = {};
    if (nombre != undefined) {
        const nameValidation = validateName(nombre, 1, 100, true);
        if (!nameValidation.valid) {
            res.status(400).json({ error: nameValidation.error });
            return;
        }

        new_task_values.nombre = nombre;
    }
    if (descripcion != undefined) {
        const descripcionValidation = validateName(descripcion, 0, 250, true);
        if (!descripcionValidation.valid) {
            res.status(400).json({ error: descripcionValidation.error });
            return;
        }

        new_task_values.descripcion = descripcion;
    }
    if (fecha_limite != undefined) {
        new_task_values.fecha_limite = getMySQLDateFormat(fecha_limite);
    }
    if (orden != undefined) {
        new_task_values.orden = orden;
    }
    if (prioridad != undefined) {
        if (prioridad < 0 || prioridad > 5) {
            res.status(400).json({ error: "Value 'prioridad' must be between 0 and 5" });
            return;
        }
        new_task_values.prioridad = prioridad;
    }
    if (id_estado != undefined) {
        new_task_values.id_estado = id_estado;
    }

    const keys = Object.keys(new_task_values);
    if (keys.length > 0) {
        let keysString = "";
        const params = [];

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = new_task_values[key];

            keysString += ` ${key} = ? `;
            if (i != keys.length - 1) {
                keysString += " , ";
            }

            params.push(value);
        }
        params.push(id_tarea);

        const sql_response = await new Promise((promRes, promRej) => {
            dbContainer.db.execute(`UPDATE tareas SET ${keysString} WHERE id_tarea = ?`, params, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    promRej(sqlErr.message);
                    return;
                }

                promRes(sqlRes);
            });
        }).catch((promErr) => {
            res.status(400).json({ error: promErr });
            return null;
        });

        if (sql_response == null) {
            return;
        }
    }

    const task_users_ids = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT id_usuario FROM usuarios_tareas WHERE id_tarea = ?`, [id_tarea], (sqlErr, sqlRes) => {
            if (sqlErr) {
                promRej(sqlErr.message);
                return;
            }

            promRes(sqlRes.map((userStruct) => userStruct.id_usuario));
        });
    }).catch((promErr) => {
        res.status(400).json({ error: promErr });
        return null;
    });

    if (task_users_ids == null) {
        return;
    }

    if (usuarios == undefined) {
        Object.assign(saved_task, new_task_values);
        saved_task.usuarios = task_users_ids;
        res.status(200).json(saved_task);
        return;
    }

    const usersToDelete = task_users_ids.filter((task_user_id) => !usuarios.some((usuario) => usuario == task_user_id));
    const usersToCreate = usuarios.filter((usuario) => !task_users_ids.some((task_user_id) => task_user_id == usuario));

    // Inserción de usuarios
    if (usersToCreate.length > 0) {
        const insertQuery = `
            INSERT INTO Usuarios_Tareas (id_usuario, id_tarea) 
            VALUES ${usersToCreate.map(() => "(?, ?)").join(" , ")}
        `;
        const insertParams = usersToCreate.flatMap((usuario) => [usuario, id_tarea]);

        const insertResponse = await new Promise((promRes, promRej) => {
            dbContainer.db.execute(insertQuery, insertParams, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    promRej(sqlErr.message);
                    return;
                }
                promRes(sqlRes);
            });
        }).catch((promErr) => {
            res.status(400).json({ error: promErr });
            return null;
        });

        if (insertResponse == null) {
            return;
        }
    }

    // Eliminación de usuarios
    if (usersToDelete.length > 0) {
        const deleteQuery = `
            DELETE FROM Usuarios_Tareas
            WHERE id_tarea = ? AND id_usuario IN (${usersToDelete.map(() => "?").join(" , ")})
        `;
        const deleteParams = [id_tarea, ...usersToDelete];

        const deleteResponse = await new Promise((promRes, promRej) => {
            dbContainer.db.execute(deleteQuery, deleteParams, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    promRej(sqlErr.message);
                    return;
                }
                promRes(sqlRes);
            });
        }).catch((promErr) => {
            res.status(400).json({ error: promErr });
            return null;
        });

        if (deleteResponse == null) {
            return;
        }
    }

    Object.assign(saved_task, new_task_values);
    saved_task.usuarios = usuarios;
    res.status(200).json(saved_task);
});

router.delete("/task/:id", async (req, res) => {
    const id_tarea = req.params.id;

    const id_tarea_integer = parseSecureInt(id_tarea);

    if (isNaN(id_tarea_integer)) {
        res.status(400).json({ error: "Provided task_id is invalid" });
        return;
    }

    const deleteTaskResponse = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`DELETE FROM tareas WHERE id_tarea = ?`, [id_tarea_integer], (sqlErr, sqlRes) => {
            if (sqlErr) {
                const errorMessage = sqlErr.message;
                res.status(400).json({ error: errorMessage });
                promRej(errorMessage);
                return;
            }

            if (sqlRes.affectedRows == 0) {
                const errorMessage = `There isn't any task with the id: ${id_tarea_integer}`;
                res.status(404).json({ error: errorMessage });
                promRej(errorMessage);
                return;
            }

            promRes(sqlRes);
        });
    }).catch((errorMessage) => {
        console.log("Error on DELETE /task/:id from TAREAS:", errorMessage);
        return null;
    });

    if (deleteTaskResponse == null) {
        return;
    }

    dbContainer.db.execute(`DELETE FROM usuarios_tareas WHERE id_tarea = ?`, [id_tarea_integer], (sqlErr, sqlRes) => {
        if (sqlErr) {
            res.status(400).json({ error: sqlErr.message });
            return;
        }

        res.status(200).json({ message: "Resource sucessfully deleted" });
    });
});

router.delete("/state/:id", async (req, res) => {
    const id_estado = req.params.id;

    const id_estado_integer = parseSecureInt(id_estado);

    if (isNaN(id_estado_integer)) {
        res.status(400).json({ error: "Provided state_id is invalid" });
        return;
    }

    const tasksInState = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`SELECT id_tarea FROM tareas WHERE id_estado = ?`, [id_estado_integer], (sqlErr, sqlRes) => {
            if (sqlErr) {
                const errorMessage = sqlErr.message;
                res.status(400).json({ error: errorMessage });
                promRej(errorMessage);
                return;
            }

            promRes(sqlRes.map((task) => task.id_tarea));
        });
    }).catch((errorMessage) => {
        console.log("Error on DELETE /state/:id from SELECT TAREAS:", errorMessage);
        return null;
    });

    if (tasksInState == null) {
        return;
    }

    if (tasksInState.length > 0) {
        const values = `(${tasksInState.map(() => "?").join(" , ")})`;

        const deleteUsersTasksResponse = await new Promise((promRes, promRej) => {
            dbContainer.db.execute(`DELETE FROM usuarios_tareas WHERE id_tarea IN ${values}`, tasksInState, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    const errorMessage = sqlErr.message;
                    res.status(400).json({ error: errorMessage });
                    promRej(errorMessage);
                    return;
                }
                promRes(sqlRes);
            });
        }).catch((errorMessage) => {
            console.log("Error on DELETE /state/:id from DELETE USUARIOS_TAREAS:", errorMessage);
            return null;
        });

        if (deleteUsersTasksResponse == null) {
            return;
        }

        const deleteTaskResponse = await new Promise((promRes, promRej) => {
            dbContainer.db.execute(`DELETE FROM tareas WHERE id_tarea IN ${values}`, tasksInState, (sqlErr, sqlRes) => {
                if (sqlErr) {
                    const errorMessage = sqlErr.message;
                    res.status(400).json({ error: errorMessage });
                    promRej(errorMessage);
                    return;
                }

                promRes(sqlRes);
            });
        }).catch((errorMessage) => {
            console.log("Error on DELETE /state/:id from DELETE TAREAS:", errorMessage);
            return null;
        });

        if (deleteTaskResponse == null) {
            return;
        }
    }

    const deleteStateResponse = await new Promise((promRes, promRej) => {
        dbContainer.db.execute(`DELETE FROM estados WHERE id_estado = ?`, [id_estado_integer], (sqlErr, sqlRes) => {
            if (sqlErr) {
                const errorMessage = sqlErr.message;
                res.status(400).json({ error: errorMessage });
                promRej(errorMessage);
                return;
            }

            if (sqlRes.affectedRows == 0) {
                const errorMessage = `There isn't any state with the id: ${id_estado_integer}`;
                res.status(404).json({ error: errorMessage });
                promRej(errorMessage);
                return;
            }

            promRes(sqlRes);
        });
    }).catch((errorMessage) => {
        console.log("Error on DELETE /state/:id from DELETE ESTADOS:", errorMessage);
        return null;
    });

    if (deleteStateResponse == null) {
        return;
    }

    res.status(200).json({ message: "Resource sucessfully deleted" });
});

module.exports = router;
