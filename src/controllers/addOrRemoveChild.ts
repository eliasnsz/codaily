import { PostData } from "@/types";
import { WithId } from "mongodb";

import updateOneContent from "./updateOneContent";

async function addNewChild(parent: WithId<PostData>) {
  await updateOneContent(parent, {
    $inc: {
      children_deep_count: 1
    },
  })
}

export async function removeChild(parent: WithId<PostData>) {
  await updateOneContent(parent, {
    $inc: { 
      children_deep_count: -1
    },
  })
}

export default addNewChild