const mongoose = require('mongoose');


const gameSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  secretNumber: { type: Number, required: true },
  players: [String], 
  responses: [
    {
      player: String,
      guess: Number, 
      isCorrect: Boolean,
    },
  ],
  winner: String, 
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Game', gameSchema);
