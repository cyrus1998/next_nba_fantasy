import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect"
import Userteam from '@/model/userTeam';
import Player from '@/model/player';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            dbConnect();
            const userTeams = await Userteam.find()
            for (const team of userTeams) {
                team.pts = 0
                team.ast = 0
                team.tor = 0
                team.tp = 0
                team.blk = 0
                team.to = 0
                for (const player of team.players) {
                    // console.log("player is calcing",player)
                    const playerDoc = await Player.findOne({ player_id: player })
                    const played_games = playerDoc.played_game.no_of_games
                    team.pts += playerDoc.avg_pts * played_games
                    team.ast += playerDoc.avg_ast * played_games
                    team.tor += playerDoc.avg_tor * played_games
                    team.tp += playerDoc.avg_tpm * played_games
                    team.blk += playerDoc.avg_blk * played_games
                    team.to += playerDoc.avg_to * played_games
                }
                team.save()
            }
            const result = await Userteam.find().lean()
            res.status(200).json({
                "result": result
            })
        }
        catch (err: any) {
            console.log("error", err)
            res.status(500).json({ error: err.errors })
        }
    }
}

