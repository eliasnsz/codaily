import { HttpStatusCode } from "axios"
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
  published_at: string,
  updated_at: string,
  parent_id: string | null,
  author_id: string,
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

export interface IBaseError extends Error {
  name: string,
  message: string,
  statusCode: HttpStatusCode
}