import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import player from '../../../../model/player';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        dbConnect();
        try{
            const teamIdString = process.env.TEAM_ID || "";
            const team_id: number[] = teamIdString?.split(",").map(Number)
            for(const id of team_id){
                const resp_teams = await fetch(process.env.RAPID_API_HOST + "players?" + new URLSearchParams({
                    season: String(2023),
                    team: String(id)
                  }), {
                    method: "GET",
                    headers: {
                      "Content-Type": "application/json",
                      "X-RapidAPI-Key" : process.env.RAPID_API_KEY || "",
                      "X-RapidAPI-Host" : process.env.X_RADID_API_HOST || "",
                    },
                  });
                const response = await resp_teams.json();
                const res = response['response']
                for(const key in res){
                    const nba_player = await player.findOne({name: res[key].firstname + " " + res[key].lastname})
                    if (!nba_player){
                        const res_player = res[key]
                        const insert_player = new player({
                            player_id: res_player.id,
                            name: res_player.firstname + " " + res_player.lastname,
                            height: res_player.height.feets!==null ? res_player.height.feets + " ft " + res_player.height.inches : null,
                            weight: res_player.weight.pounds!==null ? res_player.weight.pounds : null,
                            team: [id],
                            played_season: res_player.nba.pro
                        })
                        insert_player.save()
                    }else if(!nba_player.team.includes(id)){
                        await nba_player.updateOne({team: [nba_player.team.push(id)]}) //traded player
                    }
                }
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
    

