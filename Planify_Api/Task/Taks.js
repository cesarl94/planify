const express = require("express");

const router = express.Router();

router.get("/estados/tareas", (req, res) => {
    const dbContainer = require("../db");
    const query = `
    SELECT  
        e.id_estado, 
        e.Nombre, 
        t.id_tarea, 
        t.nombre, 
        t.descripcion, 
        CONCAT(u.Nombre, ' ', u.apellido) AS 'Nombre_apellido'
    FROM estado e
    INNER JOIN tareas t ON t.id_estado = e.id_estado
    INNER JOIN usuarios_tareas ut ON ut.id_tarea = t.id_tarea
    INNER JOIN usuarios u ON u.id_usuario = ut.id_usuario
`;
    dbContainer.db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
