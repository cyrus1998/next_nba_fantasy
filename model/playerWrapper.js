const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const playedGameSchema = new mongoose.Schema({ 
    no_of_games: Number,
    games: [Number]
});

const playerSchema = new mongoose.Schema({
    player_id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    played_game: {
        type: playedGameSchema,
        required: false
    },
    selected: {
        type: Boolean,
        required: false
    }
});

const Player = mongoose.models.Player || mongoose.model('Player', playerSchema);

module.exports = Player;
