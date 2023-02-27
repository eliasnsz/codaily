import { connectToDatabase } from "@/services/database";
import { NotFoundError, ValidationError } from "@/errors";
import { AuthOptions } from "next-auth";
import { UserData } from "@/types";

import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth/next";
import bcrypt from "bcryptjs"

interface LoginData {
  username: string,
  password: string
}

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: async ({ session }) => {
      const db = await connectToDatabase()
      const userFinded = await db.collection<UserData>("users")
        .findOne({ email: session.user?.email as string})
      
      return{ ...session, user: {
          id: userFinded?._id,
          email: session.user?.email,
          username: userFinded?.username,
          createdAt: userFinded?.createdAt,
          updatedAt: userFinded?.updatedAt
      }} as any     
    }
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {
        username: { label: "Username", type: "text ", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req) => {
        const { username, password } = credentials as LoginData

        const db = await connectToDatabase() 
        const userFinded = await db.collection<UserData>("users")
          .findOne({ username: username })

        if (!userFinded) throw new NotFoundError({
          message: "Usuário inexistente"
        })

        const isCorrectPass = bcrypt
          .compareSync(password, userFinded.password as string)

        if (!isCorrectPass) throw new ValidationError({
          message:"Senha incorreta", 
          statusCode: 401
        })
        
        return userFinded as any
      }
    }),
  ],

  secret: process.env.SECRET
}

export default NextAuth(authOptions) 