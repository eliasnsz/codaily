import { deleteOneContent, findAllContent, findOneContent, insertOneContent } from "@/controllers";
import { NextApiRequest, NextApiResponse } from "next";
import { postValidation } from "@/services/postValidation";
import { ObjectId, WithId } from "mongodb";
import { PostData } from "@/types";
import { NotFoundError } from "@/errors";
import updateOneContent from "@/controllers/updateOneContent";
import { postUpdateValidation } from "@/services/postUpdateValidation";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === "GET") {
    const allPosts = await findAllContent({ title: { $type: "string" } }, {
      projection: {
        body: 0,
        children: 0
      }
    })
    
    return res.status(200).json(allPosts)
  }

  if (req.method === "POST") {
    
    const { title, body, parent_id, author, author_id } = req.body

    const { post, error } = await postValidation({ 
      title, 
      body, 
      parent_id, 
      author, 
      author_id 
    })

    if (!error) {
      
      await insertOneContent(post)

    }

    if (!post?.title) {
      const parent = await findOneContent({ 
        _id: new ObjectId(post?.parent_id as string) 
      })
      await res.revalidate(`/${parent?.author}/${parent?.slug}`)
    }
    await res.revalidate("/")
    await res.revalidate(`/${author}`)

    return res.status(error?.statusCode || 201).json(error || post)
  }

  if (req.method === "DELETE") {

    const { slug } = req.body
    const target = await findOneContent({ slug: slug }) as WithId<PostData>
    
    if (!target) {
      const error = new NotFoundError({
        message: "O conteúdo solicitado não foi encontrado."
      })
      return res.status(error.statusCode).json(error)
    }

    await deleteOneContent(target)

    await res.revalidate("/")
    await res.revalidate(`/${target.author}`)
    
    return res.status(204).json({ ok: true })
  }
}


export default handler