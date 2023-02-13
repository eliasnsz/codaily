import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI as string

let cachedDb: Db;

export async function connectToDatabase<Db>() {
  if (cachedDb) {
    return cachedDb
  }
  const client = await MongoClient.connect(uri)
  const db = client.db("blog")
  cachedDb = db
  return db
}