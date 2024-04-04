// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from "../../utils/dbConnect"
import User from "../../model/user";
import Avatar from '@/model/avatar';

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      console.log("request here",data)
      
      // if (!email || !password) {
      //   throw new Error ('')
      // }
  
      dbConnect();
      const user = await User.findOne({email: req.body?.email}).select('+password')
      console.log("user found?",user)
      if (!user){
        const newUser = await User.create(req.body)
        const avatarDoc = await Avatar.findOne({name:req.body.avatar})
        const img = avatarDoc?.avatar
        newUser.avatar_img = img
        newUser.save()
      res.status(201).json({ message: 'Created user!' });
      }else{
        res.status(200).json({ message: 'User already exist!'})
      }
      
    }catch(err: any) {
      res.status(200).json({ error: err.errors })
    }
    
  
  } else {
    // Handle any other HTTP method
    res.status(200).json({ name: 'wrong method' })
  }
}
