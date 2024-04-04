import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import game from '@/model/game';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') { //get game id  
    dbConnect();
    try {
      const { start_date,end_date } = req.body
      // const latest_game = await game.find({ team: { $exists: true } }).sort('-game_id').limit(1).exec()
      let today = new Date()
      // const games = await game.distinct("game_id").find({date:{$gt: new Date('2023-10-01'), $lte: today}})
      const games = await game.distinct("game_id").find({date:{$gte: new Date(start_date), $lte: new Date(end_date)}})
      const game_ids = games.map(g => g.game_id) 
      console.log("game_ids",game_ids)
      for (const game_id of game_ids) {
        const resp_game = await fetch(process.env.RAPID_API_HOST + "games/statistics?" + new URLSearchParams({
          id: String(game_id)
        }), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": process.env.RAPID_API_KEY || "",
            "X-RapidAPI-Host": process.env.X_RADID_API_HOST || "",
          },
        });
        const response = await resp_game.json();
        const result = response['response']
        // console.log("result",result)
        for (const key in result) {
          const update_game = await game.findOne({ game_id: game_id,"team.1": { $exists: false} })
          // console.log("team here",result[key].team)
          // console.log("stats here",result[key].statistics)
          if (update_game === null){
            console.log("game already udpated",game_id)
            continue //skip updating if record exists
          } 
          console.log("trying to update this game",game_id)
          update_game.team[key] = {
            team_id: result[key].team.id,
            name: result[key].team.name,
            fbp: result[key].statistics[0].fastBreakPoints,
            pip: result[key].statistics[0].pointInPaint,
            scp: result[key].statistics[0].secondChancePoints,
            pot: result[key].statistics[0].pointsOffTurnovers,
            pts: result[key].statistics[0].points,
            fgm: result[key].statistics[0].fgm,
            fga: result[key].statistics[0].fga,
            tpm: result[key].statistics[0].tpm,
            tpa: result[key].statistics[0].tpa,
            ofr: result[key].statistics[0].offReb,
            dfr: result[key].statistics[0].dffReb,
            tor: result[key].statistics[0].totReb,
            ast: result[key].statistics[0].assists,
            pf: result[key].statistics[0].pFouls,
            stl: result[key].statistics[0].steals,
            to: result[key].statistics[0].turnovers,
            blk: result[key].statistics[0].blocks
          }
          await update_game.save()
          console.log("finish updating",game_id)
        }
      }
      res.status(200).json("success");
    }
    catch (err: any) {
      console.log("error", err)
      res.status(500).json({ error: err.errors })
    }
  }
}


