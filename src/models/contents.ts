import { connectToDatabase } from "@/services/database";
import { PostData } from "@/types";
import { Document, Filter, FindOptions, ObjectId, WithId } from "mongodb";
import slugify from "slugify";
import { v4 } from "uuid";

interface NewContent {
  title?: string, 
  body: string, 
  author: string, 
  author_id: string,
  parentSlug?: string
}

async function getPostsCollection() {
  const db = await connectToDatabase()
  const content = db.collection("posts")

  return content
}

export async function findAll(value: Filter<PostData>, options?: FindOptions) {
  const content = await getPostsCollection()
  const allContents = await content
    .find<WithId<PostData>>(value as PostData, options)
    .toArray()

  return allContents
}

export async function findAllPosts(value: Filter<PostData>, options?: FindOptions) {
  const content = await getPostsCollection()

  const allPosts = await content.find<WithId<PostData>>({
    title: {
      $type: "string",
      ...value
    }
  }, {
    projection: {
      body: 0,
      children: 0
    },
    ...options
  }).toArray()

  return allPosts
}

export async function findAllUserContent(user: string) {
  const content = await getPostsCollection()
  const allPosts = await content.find({
    author: user,
    title: {
      $type: "string"
    },
  }, {
    projection: {
      body: 0,
      children: 0
    }
  }).toArray()

  const allComments = await content.find({
    title: {
      $type: "null"
    },
    author: user
  }, {
    projection: {
      children: 0
    }
  }).toArray()

  return [...allPosts, ...allComments]
}

export async function findOne(value: Filter<PostData>, options?: FindOptions) {
  const content = await getPostsCollection()

  const post = await content.findOne<WithId<PostData>>(value as PostData, options)

  return post
}

export async function findParent(value: Filter<PostData>, options?: FindOptions) {
  const content = await getPostsCollection()

  const parentPost = await content.findOne<WithId<PostData>>(value as PostData, {
    projection: {
      children: 0
    }
  })

  return parentPost
}

export async function findAllChildren(value: Filter<PostData>, options?: FindOptions) {
  const content = await getPostsCollection()
  
  const filter = value ? 
  {
    title: { $type: "null" },
    ...value
  }
  :
  {
    title: { $type: "null" },
  }
  

  const allChildren = await content
    .find<WithId<PostData>>(filter as PostData, options)
    .toArray()

  return allChildren
}


export async function createNewPost({title, body, author, author_id}: NewContent) {

  const content = await getPostsCollection()

  const newPost: PostData = {
    title: title as string,
    slug: slugify(title as string, { lower: true, strict: true }),
    body: body,
    author: author,
    author_id: author_id,
    parent_id: null,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
    children_deep_count: 0,
    root_slug: slugify(title as string, { lower: true, strict: true }),
  }

  await content.insertOne(newPost)
  return newPost
}

export async function createNewComment({ body, author, author_id, parentSlug }: NewContent) {

  const content = await getPostsCollection()
  const parent = await findOne({ slug: parentSlug })

  const newComment: PostData = {
    title: null,
    body: body,
    author: author,
    author_id: author_id,
    parent_id: parent?._id.toString() as string,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: [],
    children_deep_count: 0,
    slug: v4(),
    root_slug: parent?.root_slug as string
  }

  await content.insertOne(newComment)
  await content.findOneAndUpdate({ slug: parentSlug },
    { 
      $inc: { "children_deep_count": 1 }, 
      $push: { children: newComment as any }
    },
  )  

  if (parent?.parent_id) {
    await content.findOneAndUpdate({ _id: new ObjectId(parent.parent_id)},
      {
        $inc: { "children_deep_count": 1 }, 
      }
    ) 
  }
  
  return newComment
}

export async function deleteOnePost(slug: string) {
  const content = await getPostsCollection()
  const target = await content.findOne<PostData>({ slug: slug })
  await content.deleteOne({ slug: slug })
  await content.updateMany({ root_slug: target?.slug }, {
    $set: { children: [] }
  })
  await content.deleteMany({ root_slug: target?.slug })

  return target
}