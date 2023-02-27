import { getPostsCollection } from "@/services/getPostCollection";
import { ObjectId, WithId } from "mongodb";
import { PostData } from "@/types";

import findOneContent from "./findOneContent";
import addNewChild from "./addOrRemoveChild";

async function insertOneContent(post: PostData) {

  const postColletion = await getPostsCollection()
  const isComment = !post.title ? true : false
  
  //  Add the post to the '/api/contents' route  
  await postColletion.insertOne(post)
  
  // If it's a comment, add to array 'children' of the parent post
  if (isComment) {
    const parentPost = await findOneContent({ 
      _id: new ObjectId(post.parent_id as string) 
    }) as WithId<PostData>

    await addNewChild(parentPost)
    
  }
  
  return
}

export default insertOneContent