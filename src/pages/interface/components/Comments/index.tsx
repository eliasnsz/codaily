import { PostData } from "@/types";
import { Box, Button, Stack } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { ReactNode } from "react";
import AnswerButtonOrEditor from "../AnswerButtonOrEditor";
import AuthorTag from "../AuthorTag";
import Viewer from "../Markdown";

interface IProps {
  comments: WithId<PostData>[]
}

export default function Comments({ comments }: IProps) {

  return (
    <>
      {
        comments.map(comment => {
          return (
            <CommentContainer key={comment._id.toString()} post={comment}>
              {
                comment.children.map(child => {
                  return (
                    <CommentContainer 
                      parentAuthor={comment.author} 
                      parentSlug={comment.slug} 
                      key={child._id.toString()} 
                      post={child}
                    />
                  )
                }).reverse()
              }
            </CommentContainer>
          )
        }).reverse()
      }
    </>
  )
}

interface ICommentProps {
  post: WithId<PostData>,
  children?: ReactNode
  parentAuthor?: string,
  parentSlug?: string
}

export function CommentContainer({ post, parentAuthor, parentSlug, children }: ICommentProps) {
  return (
    <Stack mt={6} direction="row" spacing={6} px={2}>
      <Box borderRight="1px dotted #62356955" w="1px"/>
      <Box w="100%">
        <AuthorTag
          post={post}
        />
        <Box mt={2} mb={3}>
          <Viewer
            value={post.body}
          />
        </Box>
        <AnswerButtonOrEditor 
          post={post}
          parentAuthor={parentAuthor as string}
          parentSlug={parentSlug as string}
        />
        {children}
      </Box>
    </Stack>
  )
}