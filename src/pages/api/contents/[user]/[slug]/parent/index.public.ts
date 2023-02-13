import { NotFoundError } from "@/errors";
import { connectToDatabase } from "@/services/database";
import { PostData } from "@/types";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { user, slug } = req.query

  const db = await connectToDatabase()
  const postCol = db.collection<PostData>("posts")
  const userFinded = await db.collection("users").findOne({ username: user})
  const thisPost = await postCol.findOne({ slug: slug, author: user })

  if (!userFinded) return res.status(404).send(new NotFoundError(
    "Usuário não encontrado no sistema"
  ))
  if (!thisPost) return res.status(404).send(new NotFoundError(
    "O conteúdo informado não foi encontrado no sistema"
  ))

  const parentPost = await postCol
    .findOne(
      { _id: new ObjectId(thisPost?.parent_id?.toString()) }, 
      { projection: { children: 0 }})

  if (req.method === "GET") {
    if (!parentPost) {
      return res.status(404).send(new NotFoundError(
        "Não há conteúdos acima desse"
      ))
    }
    
    return res.status(200).send(parentPost)
  }
  
}

export default handler