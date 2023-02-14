import { postValidation } from "@/services/postValidation";
import { connectToDatabase } from "@/services/database";
import { NextApiRequest, NextApiResponse } from "next";
import { NotFoundError } from "@/errors";
import { PostData } from "@/types";
import { v4 } from 'uuid'
import api from "@/services/api";
import { ObjectId, WithId } from "mongodb";


async function handler(req: NextApiRequest, res: NextApiResponse) {

  const db = await connectToDatabase()
  const { user, slug } = req.query
  const postsCol = db.collection("posts")
  
  const thisUser = await db.collection("users").findOne({ username: user })
  const thisPost = await postsCol.findOne<WithId<PostData>>(
    { slug: slug, author: user }, { projection: { children: 0 } }
  )

  // const parentPost = await postsCol.findOne<WithId<PostData>>(
  //   { _id: new ObjectId(thisPost?.parent_id as string)}
  // )
  // console.log(parentPost)
    
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
    const { body, author } = req.body

    //True como segundo parametro para ignorar a validacao do titulo
    const error = await postValidation(body, true)

    if (error) {
      return res.status(error.status).send(error)
    }

    const newComment: PostData = {
      title: null,
      body: body,
      author: author,
      owner_id: "iej12jiedjaidja9sjdas", //trocar pelo id do autor 
      parent_id: thisPost?._id.toString() as string,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
      children_deep_count: 0,
      slug: v4(),
    }

    try {
      await postsCol.insertOne(newComment)
      await postsCol
        .findOneAndUpdate({ slug: slug },
          { 
            $inc: { "children_deep_count": 1 }, 
            $push: { children: newComment as any }
          },
        )
    } catch (error) {
      return res.status(400).send(error)
    }

    await Promise.all([
      res.revalidate("/"),
      res.revalidate(`/${author}/${thisPost?.slug}`),
      res.revalidate(`/${author}/${newComment?.slug}`),
      res.revalidate(`/${author}`)
    ])

    return res.status(200).json(newComment)
  }
  
}


export default handler