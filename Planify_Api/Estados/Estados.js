const express = require('express');
const db = require('../db'); 

const router = express.Router();



router.get('/estados', (req, res) => {
    const query = 'SELECT * FROM estado';
    db.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(results);
      }
    });
});

module.exports = router; 