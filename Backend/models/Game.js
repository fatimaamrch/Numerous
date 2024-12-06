const db = require('./database');

// Créer une nouvelle partie
function createGame(secretNumber, callback) {
    db.run(`INSERT INTO games (secret_number) VALUES (?)`, [secretNumber], function (err) {
        callback(err, this.lastID);
    });
}

// Récupérer une partie
function getGame(gameId, callback) {
    db.get(`SELECT * FROM games WHERE id = ?`, [gameId], (err, row) => {
        callback(err, row);
    });
}

// Ajouter un joueur
function addPlayer(gameId, name, callback) {
    db.run(`INSERT INTO players (game_id, name) VALUES (?, ?)`, [gameId, name], function (err) {
        callback(err, this.lastID);
    });
}

// Mettre à jour le score
function updateScore(playerId, score, callback) {
    db.run(`UPDATE players SET score = ? WHERE id = ?`, [score, playerId], (err) => {
        callback(err);
    });
}

module.exports = { createGame, getGame, addPlayer, updateScore };
