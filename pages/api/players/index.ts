import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect"
import Player,{ player } from '@/model/player';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'GET') {
        try{
            const query = req.query;
            console.log("query in player api",query)
            const { page ,search } = query; 
            console.log("page here",page)
            const pageNmber = Number(page); //convert queryparam to number
            const offset = 10 * (pageNmber - 1);
            dbConnect();
            if(search){
              const result = await Player.find({ name: {$regex:'.*' + search + '.*', $options: 'i'},played_game:{$exists: true},selected:{$ne: true}})
              .sort({ name: 1 }) //ascending order
              .select("-_id -__v -weight -height")
              .skip(offset)
              .limit(10)
              .lean()
              const count = await Player.find({ name: {$regex: '.*' + search + '.*', $options: 'i'},
              played_game:{$exists: true},
              selected:{$ne: true}}).count()
              res.status(200).json({
                "offset": offset,
                "count": count,
                "search": search,
                "result": result
              })
            }else{
              const result = await Player.find({played_game:{$exists: true},selected:{$ne: true}})
              .sort({ name: 1 }) //ascending order
              .select("-_id -__v -weight -height")
              .skip(offset)
              .limit(10)
              .lean()
              const count = await Player.find({played_game:{$exists: true},selected:{$ne: true}}).count()
              res.status(200).json({
                "offset": offset,
                "count": count,
                "search": search,
                "result": result
              })
            }
            }
      catch(err: any) {
        console.log("error",err)
        res.status(500).json({ error: err.errors })
      }
}
}
    

