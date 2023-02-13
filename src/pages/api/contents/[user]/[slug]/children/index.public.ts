import { NotFoundError } from "@/errors";
import { connectToDatabase } from "@/services/database";
import { PostData } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { user, slug } = req.query

  const db = await connectToDatabase()
  const postCol = db.collection<PostData>("posts")
  const userFinded = await db.collection("users").findOne({ username: user})
  const parentPost = await postCol.findOne({ slug: slug, author: user})
  
  if (!userFinded) return res.status(404).send(new NotFoundError(
    "Usuário não encontrado no sistema"
  ))
  if (!parentPost) return res.status(404).send(new NotFoundError(
    "O conteúdo informado não foi encontrado no sistema"
  ))
  
  const childrenPost = await postCol
    .find({ parent_id: parentPost?._id.toString() }).toArray()

  if (req.method === "GET") {
    
    return res.status(200).send(childrenPost)
  }
  
}

export default handler