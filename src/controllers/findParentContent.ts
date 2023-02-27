import { PostData } from "@/types";
import { ObjectId } from "mongodb";

import findOneContent from "./findOneContent";

async function findParentContent(post: PostData) {

  /* 
    Iterates through the contents tree, bottom to top, 
    and returns the root content
  */
  const parent = await findOneContent(
    { _id: new ObjectId(post.parent_id as string) },
    { 
      projection: {
        children: 0
      }
    }
  )
  
  return parent
}

export default findParentContent