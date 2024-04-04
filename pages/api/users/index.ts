import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../../utils/dbConnect"
import User from '@/model/user';
import avatar from '@/model/avatar';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if (req.method === 'GET') {
        try{
            const query = req.query;
            const { email } = query; 
            console.log("user api called",email)
            dbConnect();
            const result = await User.find({email: email}).lean()
            res.status(200).json({
                "result" :result
            })
}
catch(err: any) {
    console.log("error",err)
    res.status(500).json({ error: err.errors })
  }
}
} 

