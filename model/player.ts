import mongoose, { Schema } from 'mongoose'


export interface player {
    player_id: number
    name: string
    height: string
    weight: string
    team: Array<number>
    played_season: number
    avg_pts: number
    avg_min: string //mm:ss
    avg_fgm: number
    avg_fga: number
    avg_fgp: string //87.2
    avg_ftm: number
    avg_fta: number
    avg_ftg: string
    avg_tpm: number
    avg_tpa: number
    avg_tpp: string
    avg_ofr: number
    avg_dfr: number
    avg_tor: number
    avg_ast: number
    avg_pf: number
    avg_stl: number
    avg_to: number
    avg_blk: number 
    avg_eff: string //+12
    played_game: Iplayed_game,
    selected: boolean
}

export interface Iplayed_game {
    no_of_games: number
    games: Array<number>
}

const playedGameSchema = new mongoose.Schema<Iplayed_game>({ 
    //need to define after defining the interface 
    //so that it can be used as type inside main schema
    no_of_games: Number,
    games: [Number]
});

const playerSchema:Schema = new mongoose.Schema<player>({
    player_id: {
        type: Number,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true,
    },
    height: {
        type: String,
        required: false,
    },
    weight: {
        type: String,
        required: false,
    },
    team: Array({
        type:Number,
        required: true
    }),
    played_season:{
        type:Number,
        required: false
    },
    avg_pts:{
        type: Number,
        required: false
    },
    avg_min:{
        type: String,
        required: false
    },
    avg_fgm:{
        type: Number,
        required: false
    },
    avg_fga:{
        type: Number,
        required: false
    },
    avg_fgp:{
        type: String,
        required: false
    },
    avg_ftm:{
        type: Number,
        required: false
    },
    avg_fta:{
        type: Number,
        required: false
    },
    avg_ftg:{
        type: String,
        required: false
    },
    avg_tpm:{
        type: Number,
        required: false
    },
    avg_tpa:{
        type: Number,
        required: false
    },
    avg_tpp:{
        type: String,
        required: false
    },
    avg_ofr:{
        type: Number,
        required: false
    },
    avg_dfr:{
        type: Number,
        required: false
    },
    avg_tor:{
        type: Number,
        required: false
    },
    avg_ast:{
        type: Number,
        required: false
    },
    avg_pf:{
        type: Number,
        required: false
    },
    avg_stl:{
        type: Number,
        required: false
    },
    avg_to:{
        type: Number,
        required: false
    },
    avg_blk:{
        type: Number,
        required: false
    },
    avg_eff:{
        type: String,
        required: false
    },
    played_game: {
        type:playedGameSchema,
        required: false
    },
    selected:{
        type: Boolean,
        required: false
    }
})



export default mongoose.models.Player || mongoose.model('Player', playerSchema)