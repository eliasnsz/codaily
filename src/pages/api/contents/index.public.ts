import { postValidation } from "@/services/postValidation";
import { NextApiRequest, NextApiResponse } from "next";
import { createNewPost, findAllPosts } from "@/models/contents";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    const allPosts = await findAllPosts({})

    return res.status(200).json(allPosts)
  }

  if (req.method === "POST") {

    const { title, body, author, author_id } = req.body

    //Post Validation
    const error = await postValidation(body, title)
    if (error) return res.status(error.status).send(error)

    const newPost = await createNewPost({ title, body, author, author_id })    
    
    await Promise.all([
      res.revalidate(`/${newPost.author}/${newPost.slug}`),
      res.revalidate(`/${newPost.author}`),
      res.revalidate("/"),
    ])
    
    return res.status(201).json(newPost)
  }
  
}


export default handler