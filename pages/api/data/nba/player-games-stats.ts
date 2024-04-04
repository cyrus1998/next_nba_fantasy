import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import player from '../../../../model/player';
import game from '@/model/game';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') { //get game id
        dbConnect();
        try{
          const latest_game = await game.find({ 'team.0': { $exists: true } }).sort('-game_id').limit(1).exec()
          console.log("late game",latest_game)
          const { start_date,end_date,reset } = req.body          
         let games;
          if(end_date !== undefined){
            games = await game.distinct("game_id").find({date:{$lte: new Date(end_date) ,$gte: new Date(start_date)}})
          }else{
             games = await game.distinct("game_id").find({game_id: {$lte: latest_game[0]?.game_id || 0}, date:{$gte: new Date(start_date)}})
          }
          if(reset){
            await game.bulkWrite([
              {
                updateMany: {
                  filter: {"team.0":{$exists:true}}, 
                  update: {
                    $set: {
                      "team.0.players" : [],
                      "team.1.players" : []
                    }
                  }
                }
              }
            ])
          }else{
            const game_ids = games.map(g => g.game_id) 
            for(const game_id of game_ids){
              const resp_game = await fetch(process.env.RAPID_API_HOST + "players/statistics?" + new URLSearchParams({
                game: String(game_id)
                }), {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "X-RapidAPI-Key" : process.env.RAPID_API_KEY || "",
                      "X-RapidAPI-Host" : process.env.X_RADID_API_HOST || "",
                    },
                  });
                const response = await resp_game.json();
                const result = response['response']
                const update_game = await game.findOne({game_id: game_id})
                for(const key in result){ //result[key] is each game result of a player
                  // if(update_game.team[0]?.players.some((player:any) => player.player_id === result[key].player.id)
                  // ||update_game.team[1]?.players.some((player:any) => player.player_id === result[key].player.id)){
                  //   console.log("updated",game_id)
                  // }
                  if(result[key].team.id===update_game.team[0].team_id){
                    console.log("result[key]",result[key])
                    const player_data = {
                      player_id: result[key].player.id,
                      name: result[key].player.firstname + " " + result[key].player.lastname,
                      min: result[key].min,
                      pts: result[key].points,
                      fgm: result[key].fgm,
                      fga: result[key].fga,
                      tpm: result[key].tpm,
                      tpa: result[key].tpa,
                      ofr: result[key].offReb,
                      dfr: result[key].defReb,
                      tor: result[key].totReb,
                      ast: result[key].assists,
                      pf: result[key].pFouls,
                      stl: result[key].steals,
                      to: result[key].turnovers,
                      blk: result[key].blocks,
                      eff:  result[key].plusMinus,
                  }
                  // console.log("player data",player_data)
                  //   update_game.team[0].players.$push(player_data) 
                  //   update_game.markModified('team[0].players') //for mixed property
                  //   console.log("Before save", update_game.team[0].players);
                  //   await update_game.save()
                  //   console.log("after save", update_game.team[0].players);
                  await game.updateOne({ _id: update_game._id }, { $push: { "team.0.players": player_data } });
                  }else{
                    const player_data = {
                      player_id: result[key].player.id,
                      name: result[key].player.firstname + " " + result[key].player.lastname,
                      min: result[key].min,
                      pts: result[key].points,
                      fgm: result[key].fgm,
                      fga: result[key].fga,
                      tpm: result[key].tpm,
                      tpa: result[key].tpa,
                      ofr: result[key].offReb,
                      dfr: result[key].defReb,
                      tor: result[key].totReb,
                      ast: result[key].assists,
                      pf: result[key].pFouls,
                      stl: result[key].steals,
                      to: result[key].turnovers,
                      blk: result[key].blocks,
                      eff:  result[key].plusMinus,
                  }
                  await game.updateOne({ _id: update_game._id }, { $push: { "team.1.players": player_data } });
                  //   update_game.team[1].players.push(player_data)
                  //   update_game.markModified('team[1].players')
                  // console.log("Before save", update_game.team[1].players);
                  // await update_game.save()
                  // console.log("after save", update_game.team[1].players);
                  }
          }
                }

            }
            res.status(200).json("success");
            }
      catch(err: any) {
        console.log("error",err)
        res.status(500).json({ error: err.errors })
      }
}
}
    

