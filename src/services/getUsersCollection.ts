import { connectToDatabase } from "@/services/database";
import { UserData } from "@/types";

export async function getUsersCollection() {

  const db = await connectToDatabase();
  const postCollection = db.collection<UserData>("users");

  return postCollection;
}

