import { getPostsCollection } from "@/services/getPostCollection";

async function findAllUserContent(username: string) {
 
  const postColletion = await getPostsCollection()
  const allUserContent = await postColletion
    .find(
      { 
        author: username
      },
      { 
        projection: {
          body: {
            $cond: {
              if: { $eq: ["$parent_id", null] },
              then: "$$REMOVE",
              else: "$body"
            }
          },
          title: 1,
          author: 1,
          slug: 1,
          published_at: 1,
          updated_at: 1,
          parent_id: 1,
          author_id: 1,
          children_deep_count: 1,
        } 
      }

    ).toArray()

  return allUserContent
}

export default findAllUserContent