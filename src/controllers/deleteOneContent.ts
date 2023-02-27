import { getPostsCollection } from "@/services/getPostCollection";
import { PostData } from "@/types";
import { ObjectId, WithId } from "mongodb";
import { removeChild } from "./addOrRemoveChild";
import findOneContent from "./findOneContent";
import updateOneContent from "./updateOneContent";

async function deleteOneContent(post: WithId<PostData>) {

  const posts = await getPostsCollection()
  const target = await findOneContent(post)

  await posts.findOneAndDelete({
    slug: target?.slug
  })
  await posts.deleteMany({ parent_id: post._id.toString()})

  const parent = await findOneContent(
    { _id: new ObjectId(post.parent_id as string) }
    ) as WithId<PostData>
    
  if (parent) await removeChild(parent)
}

export default deleteOneContent