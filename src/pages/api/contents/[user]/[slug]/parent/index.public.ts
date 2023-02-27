import { findAllUserContent, findOneContent, findParentContent, findRootContent, findUser } from '@/controllers'
import { NotFoundError } from '@/errors'
import { PostData } from '@/types'
import { ObjectId } from 'mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  const { slug } = req.query

  const thisPost = await findOneContent({ slug: slug })
  const parent = await findOneContent(
    { _id: new ObjectId(thisPost?.parent_id as string) },
    {   
      projection: {
        children: 0
      }
    } 
  )

  return res.status(200).json(parent)
}