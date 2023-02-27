import { getPostsCollection } from "@/services/getPostCollection";
import { PostData } from "@/types";
import { Filter, FindOneAndUpdateOptions, FindOptions, ObjectId, UpdateFilter, UpdateOneModel, UpdateOptions, WithId } from "mongodb";

async function updateOneContent(
    value: Filter<PostData>, 
    update: UpdateFilter<PostData>,
    options?: FindOneAndUpdateOptions
  ) {

  const postColletion = await getPostsCollection() 
  const updatedContent = await postColletion
    .findOneAndUpdate(value, update, options)
  
  return updatedContent.value
}

export default updateOneContent