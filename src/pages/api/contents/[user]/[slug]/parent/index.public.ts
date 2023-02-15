import { NotFoundError } from "@/errors";
import { findOne, findParent } from "@/models/contents";
import { connectToDatabase } from "@/services/database";
import { PostData, UserData } from "@/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { user, slug } = req.query

  const db = await connectToDatabase()
  const userFinded = await db.collection<UserData>("users").findOne({ username: user })
  
  const thisPost = await findOne({ slug: slug })
  const parentPost = await findParent({ 
    _id: new ObjectId(thisPost?.parent_id as string) 
  })

  if (!userFinded) return res.status(404).send(new NotFoundError(
    "Usuário não encontrado no sistema"
  ))
  if (!thisPost) return res.status(404).send(new NotFoundError(
    "O conteúdo informado não foi encontrado no sistema"
  ))

  if (req.method === "GET") {
    if (!parentPost) return res.status(200).json(null)
    
    return res.status(200).json(parentPost)
  }
  
}

export default handler