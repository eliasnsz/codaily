import { findOneContent, findUser } from '@/controllers'
import { NotFoundError } from '@/errors'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  const { user: username, slug } = req.query
  
  const userFinded = await findUser(
    { username },
    { projection: { password: 0 } }
  )  
  
  if (!userFinded) {
    const error = new NotFoundError({ 
      message: "Usuário não encontrado no sistema."
    })
      
    throw res.status(error.statusCode).json(error)
  }

  const contentFinded = await findOneContent({ slug, author: username }, {
    projection: {
      children: 0
    }
  })

  if (!contentFinded) {
    const error = new NotFoundError({ 
      message: "Conteúdo não encontrado no sistema."
    })
      
    throw res.status(error.statusCode).json(error)
  }
  

  return res.status(200).json(contentFinded)
}