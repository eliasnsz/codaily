import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/services/database";
import { PostData, UserData } from "@/types";
import { NotFoundError } from "@/errors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.query
  const db = await connectToDatabase()
  
  const posts = await db.collection<PostData>("posts")
    .find({}, { projection: { children: 0, body: 0 }}).toArray()
    
  const thisUser = await db.collection<UserData>("users")
    .findOne({ username: user })

  if (req.method === "GET") {
    
    if (!thisUser) {
      return res.status(404).send(
        new NotFoundError("Usuário não encontrado no sistema")
      )
    }

    const thisUserPosts = posts.filter(post => post.author === user)
    return res.status(200).json(thisUserPosts) 
  }
  
}

export default handler