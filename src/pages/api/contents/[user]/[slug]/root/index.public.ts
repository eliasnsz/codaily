import { findOneContent, findRootContent } from '@/controllers'
import { PostData } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (req: NextApiRequest, res: NextApiResponse) {

  const { slug } = req.query

  const thisPost = await findOneContent({ slug: slug })
  const root = await findRootContent(thisPost as PostData) 

  return res.status(200).json(root)
}