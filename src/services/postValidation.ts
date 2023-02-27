import { findOneContent } from "@/controllers"
import { UnauthorizedError, ValidationError } from "@/errors"
import { PostData } from "@/types"
import slugify from "slugify"
import { v4 } from "uuid"

interface ValidationParams {
  title: string | null,
  body: string,
  parent_id: string | null,
  author: string,
  author_id: string,
}

interface ValidationResult {
  postValidation: 
    ({ title, body, parent_id, author, author_id }: ValidationParams) => 
    Promise<{
      post: PostData | null;
      error : ValidationError | null;
    }>
}

async function postValidation<ValidationResult>({ 
  title, 
  body, 
  parent_id, 
  author, 
  author_id 
}: ValidationParams) {

  /*
    Checks if user is authenticated, if not, will return an error
  */
  if (!author || !author_id){
    return { 
      post: null,
      error: new UnauthorizedError({
        message: "Você precisa estar autenticado para fazer uma publicação",
      })
    }
  }

  /* 
    Checks if title is empty, if yes,
    will be a comment and must contain a parent id 
  */
  if (!title || !title.trim().length) {
    if (!parent_id) {
      return { 
        post: null, 
        error: new ValidationError({
          message: "O título é obrigatório.",
          statusCode: 400
        }) 
      } 
    }
  }

  /*
    Checks if body is empty or not, if yes, will return an error
  */
  if (!body || !body.trim().length) {
    return { 
      post: null,
      error: new ValidationError({
        message: "O conteúdo é obrigatório.",
        statusCode: 400
      })
    }
  }

  /*
    Checks if already exists a post with the same slug or title,
    if yes, will return an error
  */
  
  if (title) {
    const existsAPostWithTheSameSlug = async () => {
      const findedContent = await findOneContent({
          slug: slugify(title, { 
            lower: true, 
            strict: true, 
            remove: /[*+~.()'"!:@]/g 
          }),
      })
      if (findedContent) {
        return true
      }
      return false
    }

    if (await existsAPostWithTheSameSlug()) {
      return { 
        post: null,
        error: new ValidationError({
          message: "Já existe uma publicação com esse título.",
          statusCode: 400
        })
      }
    }
  }
  
  const newContent: PostData = {
    title: title || null,
    body,
    parent_id: parent_id || null,
    author,
    author_id,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    children_deep_count: 0,
    slug: title ? slugify(title, { 
      lower: true, 
      strict: true, 
      remove: /[*+~.()'"!:@]/g 
    }) : v4()
  }  

  return { post: newContent, error: null }
}

export { postValidation }