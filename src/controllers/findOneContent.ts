import { getPostsCollection } from "@/services/getPostCollection";
import { PostData } from "@/types";
import { Filter, FindOptions, WithId } from "mongodb";

async function findOneContent(value?: Filter<PostData>, options?: FindOptions) {

  const postColletion = await getPostsCollection()
  const content = await postColletion.findOne<WithId<PostData>>(value as PostData, options)
  
  return content
}

export default findOneContent