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
  owner_id: string,
  children: [],
  children_deep_count: number
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
