import mongoose, { Schema } from 'mongoose'


export interface userTeam {
    email: String
    players: Array<number>
    pts: number
    ast: number
    tor: number
    to: number
    tp: number 
    blk: number
    pts_score: number
    ast_score: number
    tor_score: number
    to_score: number
    tp_score: number
    blk_score: number
    total_score: number
}



const userTeamSchema:Schema = new mongoose.Schema<userTeam>({
    email: {
        type: String,
        required: true,
        unique:true
    },
    players: Array({
        type: Number,
        required: false,
    }),
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
    blk: {
        type: Number,
        require: false,
        default: 0
    },
    tp: {
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
    tor_score: {
        type: Number,
        required: false,
        default: 0
    },
    to_score: {
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
})



export default mongoose.models.Userteam || mongoose.model('Userteam', userTeamSchema)