import { postValidation } from "@/services/postValidation";
import { connectToDatabase } from "@/services/database";
import { NextApiRequest, NextApiResponse } from "next";
import { PostData } from "@/types";
import slugify from "slugify"

async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const db = await connectToDatabase()
  const postsCol = db.collection<PostData>("posts")
  //Procurar todos os posts e remover o body e o array de comentarios
  const allPosts = await postsCol.find({ title: { $type: "string" }}, 
    { projection: { body: 0, children: 0 }}).toArray()  

  if (req.method === "GET") {
    return res.status(200).json(allPosts)
  }
  if (req.method === "POST") {

    const { title, body, author, author_id } = req.body

    const error = await postValidation(body, title)

    if (error) {
      return res.status(error.status).send(error)
    }

    const slugConfig = { lower: true, strict: true }

    const newPost: PostData = {
      title: title,
      body: body,
      author: author,
      owner_id: author_id,
      parent_id: null,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
      children_deep_count: 0,
      slug: slugify(title as string, slugConfig),
    }

    try {
      await postsCol.insertOne(newPost)
    } catch (err) {
      console.log(err);
    }
    
    return res.status(201).json(newPost)
  }
  
}


export default handler