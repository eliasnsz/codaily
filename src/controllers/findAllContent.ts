import { getPostsCollection } from "@/services/getPostCollection";
import { PostData } from "@/types";
import { Filter, FindOptions } from "mongodb";

async function findAllContent(value?: Filter<PostData>, options?: FindOptions) {

  const postColletion = await getPostsCollection()
  const content = await postColletion.find(value as PostData, options).toArray()
  
  return content
}

export default findAllContent