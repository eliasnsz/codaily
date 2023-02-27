import { findOneContent } from "@/controllers"
import { UnauthorizedError, ValidationError } from "@/errors"
import { PostData } from "@/types"
import slugify from "slugify"
import { v4 } from "uuid"

interface ValidationParams {
  title?: string,
  body: string,
}

interface ValidationResult {
  postValidation: 
    ({ title, body }: ValidationParams) => 
    Promise<{
      updateConfig: {} | null;
      error : ValidationError | null;
    }>
}

async function postUpdateValidation<ValidationResult>({ 
  title, 
  body, 
}: ValidationParams) {

  /*
    Checks if body is empty or not, if yes, will return an error
  */
  if (!body || !body.trim().length) {
    return { 
      updateConfig: null,
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
        updateConfig: null,
        error: new ValidationError({
          message: "Já existe uma publicação com esse título.",
          statusCode: 400
        })
      }
    }
  }

  const updateConfig = !title ? 
    { 
      body: body, 
      updated_at: new Date().toISOString()
    } 
    : 
    { 
      title: title, 
      body: body, 
      updated_at: new Date().toISOString() 
    } 
      
  return { updateConfig: updateConfig , error: null }
  
}

export { postUpdateValidation }