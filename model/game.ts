import mongoose, { Schema, Document } from 'mongoose';


export interface ITeam {
    team_id: number,
    name: string,
    fbp: number, //fast break point
    pip: number, //point in paint
    scp: number, //second chance point
    pot: number, //point off turnover
    pts: number,
    fgm: number,
    fga: number,
    tpm: number,
    tpa: number,
    ofr: number,
    dfr: number,
    pf: number,
    stl: number,
    to: number,
    blk: number,
    players: IPlayer[]
}

export interface IPlayer {
    player_id: { type: number, required: true,unique: true },
    name: { type: string, required: true },
    min: string, // 21:22
    pts: number,
    fgm: number,
    fga: number,
    tpm: number,
    tpa: number,
    ofr: number,
    dfr: number,
    pf: number,
    stl: number,
    to: number,
    ast: number,
    blk: number,
    eff: string
}

const gamePlayerSchema: Schema = new Schema<IPlayer>({
    player_id: { type: Number, required: true },
    name: { type: String, required: true },
    pts: Number,
    fgm: Number,
    fga: Number,
    tpm: Number,
    min: String,
    ast: Number,
    tpa: Number,
    ofr: Number,
    dfr: Number,
    pf: Number,
    stl: Number,
    to: Number,
    blk: Number,
    eff: String
});

export interface game extends Document {
    game_id: number,
    date: string,
    team: {
        0: ITeam, //home
        1: ITeam //guest
    },
    preseason: boolean
}

const teamSchema: Schema = new Schema<ITeam>({
    team_id: { type: Number, required: true },
    name: { type: String, required: true },
    fbp: Number,
    pip: Number,
    scp: Number,
    pot: Number,
    pts: Number,
    fgm: Number,
    fga: Number,
    tpm: Number,
    tpa: Number,
    ofr: Number,
    dfr: Number,
    pf: Number,
    stl: Number,
    to: Number,
    blk: Number,
    players: [gamePlayerSchema]
});


const gameSchema: Schema = new mongoose.Schema<game>({
    game_id: {
        type: Number,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
    },
    team: {
        0: { type: teamSchema, required: false },
        1: { type: teamSchema, required: false }
    },
    preseason:{
        type: Boolean,
        required:true
    }
});

export default mongoose.models.Game || mongoose.model('Game', gameSchema);
