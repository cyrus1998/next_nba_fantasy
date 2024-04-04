import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect"
import Userteam from '@/model/userTeam';


const getSundays = (startDate: Date, endDate: Date) :number => {
    let count = 0;
    while(startDate <= endDate){
        if(startDate.getDay() == 0){
            count ++;
        }
        startDate.setDate(startDate.getDate() + 1);
    }
    return count;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { reset } = req.body;
            dbConnect();
            const userTeams = await Userteam.find()
            const categories = ['ast', 'blk', 'pts', 'to', 'tor', 'tp'];
            if(reset){
                for(let userteam of userTeams){
                    for (let category of categories) {
                        userteam[`${category}_score`] = 0
                    }
                    userteam["total_score"] = 0
                }
            }else{
                for (let category of categories) {
                    if (category !== 'to') {
                        userTeams.sort((a, b) => a[category] - b[category]);
                    }else{
                        userTeams.sort((a, b) => b[category] - a[category]);
                    }
                    // Update scores based on rank
                    userTeams[0][`${category}_score`] += 3
                    userTeams[0]["total_score"] += 3
                    userTeams[1][`${category}_score`] += 2
                    userTeams[1]["total_score"] += 2
                    userTeams[2][`${category}_score`] += 1
                    userTeams[2]["total_score"] += 1
                }
            }
                await Promise.all(userTeams.map(team => team.save()));
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

