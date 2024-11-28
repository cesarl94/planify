const express = require("express");
const { validateEmail, validateName, countCharacterOccurrences } = require("../playnify_shared/utils");
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

    if (hash.length != 60 || countCharacterOccurrences(hash, "$") < 3) {
        res.status(400).json({ error: `The provided password hash is not in the correct format${hash.length}${countCharacterOccurrences(hash, "$")}` });
        return;
    }

    const nameValidation = validateName(nombre);
    if (!nameValidation.valid) {
        res.status(400).json({ error: nameValidation.error });
        return;
    }

    const lastNameValidation = validateName(apellido);
    if (!lastNameValidation.valid) {
        res.status(400).json({ error: lastNameValidation.error });
        return;
    }

    dbContainer.db.execute(`INSERT INTO usuarios (correo, hash, nombre, apellido) VALUES (?, ?, ?, ?)`, [correo, hash, nombre, apellido], (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(201).json(results);
        }
    });
});

module.exports = router;
