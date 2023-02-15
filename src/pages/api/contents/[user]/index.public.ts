import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/services/database";
import { PostData, UserData } from "@/types";
import { NotFoundError } from "@/errors";
import { findAllUserContent } from "@/models/contents";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.query
  const db = await connectToDatabase()
  
  const allUserContent = await findAllUserContent(user as string)
    
  const thisUser = await db.collection<PostData>("users")
    .findOne({ username: user })

  if (req.method === "GET") {
    
    if (!thisUser) {
      return res.status(404).send(
        new NotFoundError("Usuário não encontrado no sistema")
      )
    }
    if (!allUserContent.length) {
      return res.status(404).send(
        new NotFoundError("O usuário ainda não tem nenhum conteúdo publicado")
      )
    }

    return res.status(200).json(allUserContent) 
  }
  
}

export default handler