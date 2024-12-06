const express = require('express');
const router = express.Router();

// Exemple de route pour créer une partie
router.post('/', (req, res) => {
    // Logique pour créer une partie
    res.status(201).json({ message: 'Partie créée' });
});

module.exports = router;
