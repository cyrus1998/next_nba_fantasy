import mongoose, { Schema } from 'mongoose'


export interface Nbateam {
    nba_team_id: number
    name: string
    conference: string
    division: string
    abbreviation: string
    players: Array<string>
    logo: string
}

const NbateamSchema:Schema = new mongoose.Schema<Nbateam>({
    nba_team_id: {
        type: Number,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true,
    },
    conference: {
        type: String,
        required: true,
    },
    division: {
        type: String,
        required: true,
    },
    abbreviation: {
        type: String,
        required: true,
    },
    players: Array({
        type:String,
        required: false
    }),
    logo: {
        type: String,
        require: false
    }
})



export default mongoose.models.Nbateam || mongoose.model('Nbateam', NbateamSchema)