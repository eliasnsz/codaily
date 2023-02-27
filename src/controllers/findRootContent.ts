import { PostData } from "@/types";
import { ObjectId } from "mongodb";

import findOneContent from "./findOneContent";

async function findRootContent(post: PostData) {

  //  Iterates through the contents tree, bottom to top, 
  //  and returns the root content
  
  let parent = await findOneContent(
    { _id: new ObjectId(post.parent_id as string) },
    { 
      projection: {
        children: 0
      }
    }
  )

  while (parent?.parent_id) {
    parent = await findOneContent(
      { _id: new ObjectId(parent.parent_id as string) },
      { 
        projection: {
          children: 0
        }
      }
    )
  }
  
  const root = parent
  
  return root
}

export default findRootContent