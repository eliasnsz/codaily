import { connectToDatabase } from "@/services/database";
import { PostData } from "@/types";
import { WithId } from "mongodb";

export async function getPostsCollection() {

  const db = await connectToDatabase();
  const postCollection = db.collection<PostData>("posts");

  return postCollection;
}

