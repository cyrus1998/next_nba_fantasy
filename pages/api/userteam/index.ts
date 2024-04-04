import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect"
import Userteam,{ userTeam } from '@/model/userTeam';
import Player,{ player } from '@/model/player';
import User from '@/model/user';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'GET') {
        try{
            const query = req.query;
            const { email, multi } = query; 
            console.log("email in userteam",email)
            dbConnect();
            if (multi){
                const result = await Userteam.find()
                .select('ast blk pts to tor tp ast_score blk_score pts_score to_score tor_score tp_score total_score')
                .populate({
                    path: 'email',
                    model: User,
                    select: 'name',
                    localField: 'email',  // Field in the Userteam model
                    foreignField: 'email' // Field in the User model
                })
                .lean();

                const transformedResult = result.map((item) => ({
                    _id: item._id,
                    email: item.email.email,
                    name: item.email.name,
                    ast: item.ast,
                    blk: item.blk,
                    pts: item.pts,
                    to: item.to,
                    tor: item.tor,
                    tp: item.tp,
                    ast_score: item.ast_score,
                    blk_score: item.blk_score,
                    pts_score: item.pts_score,
                    to_score: item.to_score,
                    tor_score: item.tor_score,
                    tp_score: item.tp_score,
                    total_score: item.total_score
                }));
                
                res.status(200).json({
                    result: transformedResult
                })
            }else{ //single user team data with player
                const result = await Userteam.findOne({email: email}).lean() as userTeam;
            let playerStats = []
            if(result === undefined){
                return res.status(500).json({ error: "unbale to get userteam" })
            }
            for (const player of result?.players) {
                const playerStat = await Player.findOne({player_id: player}).lean() as player;
                const playedGames = playerStat.played_game.no_of_games;
                playerStats.push(
                    {
                        "player_id" : player,
                        "name" : playerStat.name,
                        "total_blk": playerStat.avg_blk? playerStat.avg_blk * playedGames : 0,
                        "total_pts": playerStat.avg_pts? playerStat.avg_pts * playedGames : 0,
                        "total_ast": playerStat.avg_ast? playerStat.avg_ast * playedGames: 0,
                        "total_tp": playerStat.avg_tpm? playerStat.avg_tpm * playedGames : 0,
                        "total_to": playerStat.avg_to? playerStat.avg_to * playedGames: 0,
                        "total_tor": playerStat.avg_tor? playerStat.avg_tor * playedGames : 0,
                    }
                )
            }
            res.status(200).json({
                "result": {...result, ...{
                    "player_stats" : playerStats
                }}
            })
            }
            
      
}
catch(err: any) {
    console.log("error",err)
    res.status(500).json({ error: err.errors })
  }
}
}

