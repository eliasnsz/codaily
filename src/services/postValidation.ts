import { ValidationError } from "@/errors/index"
import { PostData } from "@/types"
import slugify from "slugify"
import { connectToDatabase } from "./database"

export async function postValidation(body: string, title: string | boolean) {
  
  const db = await connectToDatabase()
  
  if (!title) {
    return new ValidationError("O título é obrigatório", 400)
  }
  if (!body) {
    return new ValidationError("O conteúdo é obrigatório", 400)
  }

  const allPost = await db.collection<PostData>("posts").find({}).toArray()
  const slugConfig = { lower: true, strict: true }
  const slug = title !== true ? slugify(title as string, slugConfig) : null
    
  if (slug) {
    if (allPost.some(post => post.title === title || post.slug === slug)) {
      return new ValidationError("Já existe uma publicação com esse título", 400)
    }
  }
  
  return null
}  
  