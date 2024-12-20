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
        players: {}, 
        leaderboard: []
    };

    const gameLink = `http://localhost:3000/join-game/${gameId}`;

    res.json({
        success: true,
        gameId,
        message: `Partie créée avec succès ! Partagez ce lien pour inviter d'autres joueurs : ${gameLink}`
    });

    io.emit('game-info', { message: `La partie avec l'ID ${gameId} a été créée. Lien pour rejoindre : ${gameLink}` });
});

app.get('/join-game/:gameId', (req, res) => {
    const gameId = req.params.gameId;

    if (games[gameId]) {
        res.sendFile(__dirname + '/public/game.html');  
    } else {
        res.status(404).send('Partie non trouvée');
    }
});

const updateLeaderboard = (game) => {
    game.leaderboard = Object.values(game.players)
        .sort((a, b) => a.attempts - b.attempts)  
        .map(player => ({ name: player.name, attempts: player.attempts,  lastGuess: player.lastGuess !== null ? player.lastGuess : 'Aucune' })); 
    
    io.to(game.id).emit('leaderboard-update', game.leaderboard); 
};

io.on('connection', (socket) => {
    console.log("Un joueur est connecté");

    socket.on('join-game', (gameId) => {
        if (games[gameId]) {
            const playerId = socket.id;
            games[gameId].players[playerId] = {
                name: `Joueur ${playerId.substring(0, 4)}`,
                attempts: 0,
                lastGuess: null
            };
            socket.join(gameId);  
            socket.emit('game-info', { message: `Vous avez rejoint la partie ${gameId}.` });
            
            updateLeaderboard(games[gameId]);
            io.to(gameId).emit('leaderboard-update', games[gameId].leaderboard);

            console.log(`Un joueur a rejoint la partie ${gameId}`);
        } else {
            socket.emit('game-info', { message: 'Partie non trouvée.' });
        }
    });

    socket.on('guess', (data) => {
        const { gameId, guess } = data;
        const game = games[gameId];

        if (game) {
            const guessNumber = parseInt(guess); 
            let message = '';
            let success = false;

            if (isNaN(guessNumber)) {
                message = "Veuillez entrer un nombre valide.";
            } else {
                const player = game.players[socket.id];
                if (guessNumber === game.secretNumber) {
                    message = `${player.name} a trouvé le bon nombre ! Félicitations `;
                    success = true;
                    player.attempts += 1;
                } else {
                    if (guessNumber > game.secretNumber) {
                        message = `${player.name} a deviné trop grand.`;
                    } else {
                        message = `${player.name} a deviné trop petit.`;
                    }

                    const guessStr = guessNumber.toString();
                    const secretStr = game.secretNumber.toString();

                    let correctDigitsCount = 0;
                    let secretNumberCopy = secretStr.split('');

                    for (let i = 0; i < 6; i++) {
                        const guessDigit = guessStr[i];
                        const index = secretNumberCopy.indexOf(guessDigit);

                        if (index !== -1) {
                            correctDigitsCount++;
                            secretNumberCopy.splice(index, 1);
                        }
                    }

                    message += ` Vous avez trouvé ${correctDigitsCount} chiffre(s) correct(s) parmi les 6.`;
                    player.attempts += 1;
                    player.lastGuess = guessNumber;
                }
            }

            io.to(gameId).emit('result', { success, message });

            updateLeaderboard(game);
            io.to(gameId).emit('leaderboard-update', game.leaderboard);

        } else {
            socket.emit('game-info', { message: 'Partie non trouvée.' });
        }
    });

    socket.on('disconnect', () => {
        console.log('Un joueur s\'est déconnecté');
        for (const gameId in games) {
            if (games[gameId].players[socket.id]) {
                delete games[gameId].players[socket.id];
                updateLeaderboard(games[gameId]);
                io.to(gameId).emit('leaderboard-update', games[gameId].leaderboard); 
            }
        }
    });
}); 

server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
