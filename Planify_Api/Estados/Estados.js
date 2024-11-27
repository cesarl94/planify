const express = require("express");

const router = express.Router();

router.get("/estados", (req, res) => {
    const dbContainer = require("../db");
    const query = "SELECT * FROM Estados ";
    dbContainer.db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
