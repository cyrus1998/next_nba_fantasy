import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../../utils/dbConnect"
import nbaTeam from '../../../../model/nbaTeam';
export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        dbConnect();
        try{
            const resp_teams = await fetch(process.env.RAPID_API_HOST + "teams", {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "X-RapidAPI-Key" : process.env.RAPID_API_KEY || "",
                  "X-RapidAPI-Host" : process.env.X_RADID_API_HOST || "",
                },
              });
            const response = await resp_teams.json();
            // var team_id: number[] = []
            for (const key in response['response']){
              const newTeam = response['response'][key]
              const team = await nbaTeam.findOne({name: newTeam.name})
              console.log("team",team)
              if (response['response'][key]['nbaFranchise'] === true){
                // team_id.push(newTeam.id)
                if(!team){ // insert new team
                  const item = new nbaTeam({
                    id: newTeam.id,
                    name: newTeam.name,
                    conference: newTeam.leagues.standard.conference,
                    division: newTeam.leagues.standard.division,
                    abbreviation: newTeam.code,
                    logo: newTeam.logo
                  })
                  item.save()
                }
              }
            }
            const teamIdString = process.env.TEAM_ID || "";
              const team_id: number[] = teamIdString?.split(",").map(Number)
              for(const id of team_id){
                var players: String[] = []
                const resp_players = await fetch(process.env.RAPID_API_HOST + "players?" + new URLSearchParams({
                  season: String(2022),
                  team: String(id)
                }), {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Key" : process.env.RAPID_API_KEY || "",
                    "X-RapidAPI-Host" : process.env.X_RADID_API_HOST || "",
                  },
                });
                const response = await resp_players.json();
                // console.log("player response",response)
                for (const key in response['response']) {
                  players.push(response['response'][key].firstname + " "+ response['response'][key].lastname)
                }
                console.log("players array",players)
                await nbaTeam.updateOne({ id: id}, {players: players})
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
    

