const express = require("express");
const { validateEmail, validateName } = require("../playnify_shared/utils");
const dbContainer = require("./db");
const apiutils = require("./apiutils");

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

router.post("/newregister", (req, res) => {
    const correo = req.body.correo;
    const hash = req.body.hash;
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;

    if (correo == undefined || hash == undefined || nombre == undefined || apellido == undefined) {
        res.status(400).json({ error: "Missing data. Required data: correo, hash, nombre, apellido" });
        return;
    }

    const mailValidation = validateEmail(correo);
    if (!mailValidation.valid) {
        res.status(400).json({ error: mailValidation.error });
        return;
    }

    if (!apiutils.isValidBcryptHash(hash)) {
        res.status(400).json({ error: `The provided password hash is not in the correct format.` });
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

    const mysqlDate = apiutils.getMySQLDateFormat(new Date());

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
            mysqlDate,
        });
    });
});

router.put("/updatestate", (req, res) => {
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
        if (results.affectedRows === 0) {
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

module.exports = router;
