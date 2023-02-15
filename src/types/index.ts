import { WithId } from "mongodb"
import { Session } from "next-auth"

export interface UserData {
  username: string,
  email: string,
  password?: string
  createdAt?: string,
  updatedAt?: string,
}

export interface PostData {
  title: string | null,
  body: string,
  author: string,
  slug: string,
  publishedAt: string,
  updatedAt: string,
  parent_id: string | null,
  author_id: string,
  children: WithId<PostData>[] | [],
  children_deep_count: number
  root_slug: string | null
}

export interface ISession extends Session {
  user?: {
    id?: string,
    email?: string,
    username?: string,
    createdAt?: string,
    updatedAt?: string,
  },
  expires: string
}
