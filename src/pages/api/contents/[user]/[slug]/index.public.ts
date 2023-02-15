import { postValidation } from "@/services/postValidation";
import { connectToDatabase } from "@/services/database";
import { NextApiRequest, NextApiResponse } from "next";
import { NotFoundError } from "@/errors";
import { PostData } from "@/types";
import { v4 } from 'uuid'
import api from "@/services/api";
import { ObjectId, WithId } from "mongodb";
import { createNewComment, deleteOnePost, findOne } from "@/models/contents";


async function handler(req: NextApiRequest, res: NextApiResponse) {

  const db = await connectToDatabase()
  const { user, slug } = req.query
  
  const thisUser = await db.collection("users").findOne({ username: user })
  const thisPost = await findOne({ slug: slug }, { projection: { children: 0 }})
    
  if (req.method === "GET") {
    if (!thisUser) {
      return res.status(404).send( 
        new NotFoundError("Usuário não encontrado no sistema")
      )
    }
    if (!thisPost) {
      return res.status(404).send( 
        new NotFoundError("O conteúdo informado não foi encontrado no sistema")
      )
    }

    return res.status(200).json(thisPost)
  }

  if (req.method === "POST") {
    const { body, author, author_id } = req.body

    //"True" as second parameter to bypass title validation
    const error = await postValidation(body, true)
    if (error) {return res.status(error.status).send(error)}
    
    const newComment = await createNewComment({ 
      body, author, author_id, parentSlug: slug as string
    })

    await Promise.all([
      res.revalidate("/"),
      res.revalidate(`/${author}/${thisPost?.slug}`),
      res.revalidate(`/${author}/${newComment?.slug}`),
      res.revalidate(`/${user}/${slug}`),
      res.revalidate(`/${author}`)
    ])

    return res.status(200).json(newComment)
  }

  if (req.method === "DELETE") {

    const deleted = await deleteOnePost(slug as string)
    await Promise.all([
      res.revalidate("/"),
    ])
    
    return res.status(200).json(deleted)
  }

}


export default handler