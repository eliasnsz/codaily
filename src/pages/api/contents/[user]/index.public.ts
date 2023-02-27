import { findAllUserContent, findUser } from '@/controllers'
import { NotFoundError } from '@/errors'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  const { user: username } = req.query

  const userFinded = await findUser(
    { username },
    { projection: { password: 0 } }
  )  

  if (!userFinded) {
    const error = new NotFoundError({ 
      message: "Usuário não encontrado no sistema"
    })
      
    throw res.status(error.statusCode).json(error)
  }

  const userContent = await findAllUserContent(userFinded.username)

  return res.status(200).json(userContent)
}