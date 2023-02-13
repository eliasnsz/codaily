import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/services/database";
import { PostData, UserData } from "@/types";
import { NotFoundError } from "@/errors";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.query
  const db = await connectToDatabase()
  
  //Se for post nao retorna o body, se for comentario sim.
  const posts = await db.collection<PostData>("posts")
    .find({ title: {$type: "string"} }, { projection: { children: 0, body: 0 }}).toArray()

  const comments = await db.collection<PostData>("posts")
    .find({ title: {$type: "null"}, author: user }, { projection: { children: 0 }}).toArray()
    
  const thisUser = await db.collection<PostData>("users")
    .findOne({ username: user })

  if (req.method === "GET") {
    
    if (!thisUser) {
      return res.status(404).send(
        new NotFoundError("Usuário não encontrado no sistema")
      )
    }

    
    const thisUserPosts = posts.filter(post => post.author === user)
    const postsAndComments = [...thisUserPosts, ...comments]

    return res.status(200).json(postsAndComments) 
  }
  
}

export default handler