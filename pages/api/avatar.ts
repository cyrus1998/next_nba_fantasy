import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../utils/dbConnect"
import Avatar, { avatar } from '@/model/avatar';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'GET') {
        try{
            const query = req.query;
            console.log("query in avatar api",query)
            dbConnect();
            if (Object.keys(query).length === 0) {
                Avatar.find({}).then(avatars => {
                    res.status(200).json(avatars)
                })
            }else{
                const { select } = query;
                const avatarDoc = await Avatar.findOne({name:select});
                const result = avatarDoc?.avatar;
                res.status(200).json(result)
            }
            
            }
      catch(err: any) {
        console.log("error",err)
        res.status(500).json({ error: err.errors })
      }
}
}
    

