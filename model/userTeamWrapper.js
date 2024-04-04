const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userTeamSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    players: {
        type: [Number],
        required: false,
    },
    pts: {
        type: Number,
        required: false,
        default: 0
    },
    ast: {
        type: Number,
        required: false,
        default: 0
    },
    tor: {
        type: Number,
        required: false,
        default: 0
    },
    to: {
        type: Number,
        required: false,
        default: 0
    },
    tp: {
        type: Number,
        required: false,
        default: 0
    },
    blk: {
        type: Number,
        required: false,
        default: 0
    },
    pts_score: {
        type: Number,
        required: false,
        default: 0
    },
    ast_score: {
        type: Number,
        required: false,
        default: 0
    },
    to_score: {
        type: Number,
        required: false,
        default: 0
    },
    tor_score: {
        type: Number,
        required: false,
        default: 0
    },
    tp_score: {
        type: Number,
        required: false,
        default: 0
    },
    blk_score: {
        type: Number,
        required: false,
        default: 0
    },
    total_score: {
        type: Number,
        required: false,
        default: 0
    },
});

module.exports = mongoose.models.UserTeam || mongoose.model('UserTeam', userTeamSchema);
