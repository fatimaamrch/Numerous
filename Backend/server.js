
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


let games = {}; 


app.use(express.static('public'));


app.post('/create-game', (req, res) => {
    
    const gameId = Math.random().toString(36).substring(7); 
    const secretNumber = Math.floor(Math.random() * 900000) + 100000;

    
    games[gameId] = {
        secretNumber,
        players: []  
    };

    
    const gameLink = `http://localhost:3000/join-game/${gameId}`;

    
    res.json({
        success: true,
        gameId,
        message: `Partie créée avec succès ! Partagez ce lien pour inviter d'autres joueurs : ${gameLink}`
    });
});


app.get('/join-game/:gameId', (req, res) => {
    const gameId = req.params.gameId;

    
    if (games[gameId]) {
        res.sendFile(__dirname + '/public/index.html');  
    } else {
        res.status(404).send('Partie non trouvée');
    }
});



server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
