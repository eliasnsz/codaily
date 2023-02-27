import { findUser } from "@/controllers";
import { NotFoundError } from "@/errors";
import { connectToDatabase } from "@/services/database";
import { UserData } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const db = await connectToDatabase()
  const { user } = req.query
  
  if (req.method === "GET") {

    const thisUser = await findUser({ username: user }, {
      projection: {
        password: 0,
        email: 0
      }
    })

    if (!thisUser) {
      const error = new NotFoundError({
        message: "Usuário não encontrado"
      })

      return res.status(error.statusCode).json(error)
    }

    return res.status(200).json(thisUser)
  }
}

export default handler