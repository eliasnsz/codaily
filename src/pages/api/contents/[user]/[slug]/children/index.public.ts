import { NotFoundError } from "@/errors";
import { findAllChildren, findOne, findParent } from "@/models/contents";
import { connectToDatabase } from "@/services/database";
import { PostData } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { user, slug } = req.query

  const db = await connectToDatabase()
  const userFinded = await db.collection("users").findOne({ username: user})

  const thisPost = await findOne({ slug: slug })
  const children = await findAllChildren({ parent_id: thisPost?._id.toString()})
  
  if (!userFinded) return res.status(404).send(new NotFoundError(
    "Usuário não encontrado no sistema"
  ))
  if (!thisPost) return res.status(404).send(new NotFoundError(
    "O conteúdo informado não foi encontrado no sistema"
  ))

  if (req.method === "GET") {
    
    return res.status(200).send(children)
  }
  
}

export default handler