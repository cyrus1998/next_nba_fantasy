import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import game from '@/model/game';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') { //get game id
        dbConnect();
        try{
                const res_games = await fetch(process.env.RAPID_API_HOST + "games?season=2023&league=standard", {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "X-RapidAPI-Key" : process.env.RAPID_API_KEY || "",
                      "X-RapidAPI-Host" : process.env.X_RADID_API_HOST || "",
                    },
                  });
                const response = await res_games.json();
                const result = response['response']
                for(const key in result){
                    const res_game = result[key]
                    const update_game = await game.findOne({game_id: res_game.id})
                    if(!update_game && res_game.date.start<"2023-10-25"){
                        const insert_game = new game({
                            game_id: res_game.id,
                            date : new Date(res_game.date.start.slice(0,10)),
                            preseason: true
                        })
                        insert_game.save()
                    }else if(!update_game){
                      const insert_game = new game({
                        game_id: res_game.id,
                        date : res_game.date.start.slice(0,10),
                        preseason: false
                    })
                    insert_game.save()
                    }
                    // else{
                    //     update_game.date = res_game.date.start.slice(0,10)
                    //     update_game.save()
                    //     }
                        
                }
            // console.log("res", response);
            res.status(200).json("success");
            }
      catch(err: any) {
        console.log("error",err)
        res.status(500).json({ error: err.errors })
      }
}
}
    

