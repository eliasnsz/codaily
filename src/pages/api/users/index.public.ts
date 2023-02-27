import { registerValidate } from "@/services/registerValidate";
import { connectToDatabase } from "@/services/database";
import { NextApiRequest, NextApiResponse } from "next";
import { UserData } from "@/types";

import bcrypt, { genSaltSync } from "bcryptjs"

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const db = await connectToDatabase()
  const userCol = db.collection<UserData>("users")
  //Retorna todos os usuarios e remove as senhas
  const allUsers = await userCol.find({}, {projection: { password: 0 }}).toArray()
  
  if(req.method === "GET") {

    return res.status(200).json(allUsers) 
  }

  if (req.method === "POST") {
    
    const { username, email, password }: UserData = req.body

    const error = await registerValidate({ username, email, password }, db)
    
    if (error) {
      return res.status(error.statusCode).send(error)
    }

    const salt = genSaltSync(10)
    const encryptedPassword = bcrypt.hashSync(password as string, salt)
    
    const newUser = {
      username: username,
      email: email,
      password: encryptedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as UserData

    try {
      await userCol.insertOne(newUser)      
    } catch (err) {
      console.log(err);
    }
    
    return res.status(201).json(newUser)
  }
  
}

export default handler