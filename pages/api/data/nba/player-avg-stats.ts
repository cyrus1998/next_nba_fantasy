import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import Player from '@/model/player';
import game from '@/model/game';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        dbConnect();
        try{
          const { start_date,end_date,reset } = req.body
          if(reset){
            await Player.bulkWrite([
              {
                updateMany: {
                  filter: {}, 
                  update: {
                    $set: {
                      avg_pts: 0, 
                      avg_fgm: 0.0,
                      avg_fga: 0.0,
                      avg_fgp: "0",
                      avg_tpm: 0.0,
                      avg_tpa: 0.0,
                      avg_tpp: "0",
                      avg_tor: 0.0,
                      avg_ast: 0.0,
                      avg_pf: 0.0,
                      avg_to: 0.0,
                      avg_blk: 0.0,
                      "played_game.no_of_games": 0,
                      "played_game.games": []
                    }
                  }
                }
              }
            ]);

          }else{
            const games = await game.find({date:{$gte: new Date(start_date), $lte: new Date(end_date)}, preseason: false})
          // console.log("games",games)
            for(const game of games){
              console.log("game.team",game.team)
              for (const [k,v] of Object.entries(game.team)){
                const team = game.team[k]
                console.log("team loop",team)
                if(team===null){ //upcoming games
                  continue
                }
                try{
                  for (const p of team.players){
                    // console.log('id',p.player_id)
                    const update_player = await Player.findOne({player_id: p.player_id})
                    if (update_player?.played_game?.games.includes(game.game_id)||update_player===null){
                      console.log("this player already update with this game",update_player.name,game.game_id)
                      continue
                    }
                    console.log("update_player",update_player)
                    const no_of_games = update_player?.played_game?.no_of_games ? update_player?.played_game?.no_of_games + 1 : 1;
                    const games = update_player?.played_game?.games ? [...update_player.played_game.games, game.game_id] : [game.game_id];
  
                    const avgCalc = (currentAvg: number | null, newValue: number, totalGames: number) => {
                      // Treat null as 0 for the purpose of this calculation
                      currentAvg = currentAvg ?? 0;
                    
                      // Calculate the new average
                      return currentAvg
                        ? Math.round((((currentAvg * (totalGames - 1)) + newValue) * 100) / totalGames) /100
                        : newValue ? Math.round(newValue * 100) / 100 : 0;
                    };
                    
  
                    const avg_pts = avgCalc(update_player.avg_pts, p.pts, no_of_games);
                    const avg_fgm = avgCalc(update_player.avg_fgm, p.fgm, no_of_games);
                    const avg_fga = avgCalc(update_player.avg_fga, p.fga, no_of_games);
                    const avg_fgp = avg_fga !== 0 ? (avg_fgm / avg_fga) * 100 : 0;
                    const avg_tpm = avgCalc(update_player.avg_tpm, p.tpm, no_of_games);
                    const avg_tpa = avgCalc(update_player.avg_tpa, p.tpa, no_of_games);
                    const avg_tpp = avg_tpa !== 0 ? (avg_tpm / avg_tpa) * 100 : 0;
                    const avg_tor = avgCalc(update_player.avg_tor, p.dfr + p.ofr, no_of_games);
                    const avg_ast = avgCalc(update_player.avg_ast, p.ast, no_of_games);
                    const avg_pf = avgCalc(update_player.avg_pf, p.pf, no_of_games);
                    const avg_to = avgCalc(update_player.avg_to, p.to, no_of_games);
                    const avg_blk = avgCalc(update_player.avg_blk, p.blk, no_of_games);
  
                    // Updating the player document
                    update_player.avg_pts = avg_pts;
                    update_player.avg_fgm = avg_fgm;
                    update_player.avg_fga = avg_fga;
                    update_player.avg_fgp = avg_fgp;
                    update_player.avg_tpm = avg_tpm;
                    update_player.avg_tpa = avg_tpa;
                    update_player.avg_tpp = avg_tpp;
                    update_player.avg_tor = avg_tor;
                    update_player.avg_ast = avg_ast;
                    update_player.avg_pf = avg_pf;
                    update_player.avg_to = avg_to;
                    update_player.avg_blk = avg_blk;
                    update_player.played_game = {
                        no_of_games: no_of_games,
                        games: games
                    };
                    console.log("update player before save",update_player)
  
                    await update_player.save();
  
                    console.log("player updated",update_player.name)
                  }
                }catch(err: any){
                  console.log("error",err)
                }
          }
          
              }
            }
            res.status(200).json("success");
            }
      catch(err: any) {
        console.log("error",err)
        res.status(500).json({ error: err })
      }
}
}
    

