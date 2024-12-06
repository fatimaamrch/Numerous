const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const crypto = require('crypto');


const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(express.json());

mongoose.connect('mongodb://localhost/numerous')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const Game = require('./models/Game');


app.post('/create', async (req, res) => {
  const code = crypto.randomBytes(3).toString('hex'); 
  const secretNumber = Math.floor(Math.random() * 900000) + 100000;

  const newGame = new Game({ code, secretNumber });

  try {
    await newGame.save();
    res.status(201).json({ code });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});


app.post('/join', async (req, res) => {
  const { code, player } = req.body;

  const game = await Game.findOne({ code });
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }

  if (game.players.includes(player)) {
    return res.status(400).json({ error: 'Player already in the game' });
  }

  game.players.push(player);

  try {
    await game.save();
    res.status(200).json({ message: 'Joined game successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join game' });
  }
});

io.on('connection', (socket) => {
  console.log('A player connected:', socket.id); 

  socket.on('join_game', (gameCode, playerName) => {
    console.log(`${playerName} joined the game: ${gameCode}`);
    socket.join(gameCode);
    io.to(gameCode).emit('player_joined', `${playerName} has joined the game.`);
  });

  socket.on('disconnect', () => {
    console.log('A player disconnected:', socket.id); 
  });
});


server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
