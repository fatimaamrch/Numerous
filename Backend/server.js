require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const gameRoutes = require('./routes/game');

// Initialisation de l'application
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});

// Utiliser le middleware CORS
app.use(cors({
    origin: "http://localhost:3001"
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/game', gameRoutes);

// WebSocket pour la collaboration
io.on('connection', (socket) => {
    console.log('Client connecté via WebSocket');
    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Client a rejoint la partie : ${gameId}`);
    });

    socket.on('sendGuess', ({ gameId, guess }) => {
        io.to(gameId).emit('newGuess', guess);
    });

    socket.on('disconnect', () => {
        console.log('Client déconnecté');
    });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
