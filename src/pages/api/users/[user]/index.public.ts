import { NotFoundError } from "@/errors";
import { connectToDatabase } from "@/services/database";
import { UserData } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase()
  const { user } = req.query
  
  if (req.method === "GET") {
    //Retorna o usuario sem a senha
    const thisUser = await db.collection<UserData>("users")
      .findOne({ username: user }, { projection: { password: 0, email: 0 }})

    if (!thisUser) {
      return res.status(404).send( 
        new NotFoundError("Usuário não encontrado no sistema")
      )
    }

    return res.status(200).json(thisUser)
  }
}

export default handler