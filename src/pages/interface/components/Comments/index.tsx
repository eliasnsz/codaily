import { PostData } from "@/types";
import { Box, Button, Stack } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { ReactNode } from "react";
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
                    <CommentContainer key={child._id.toString()} post={child}/>
                  )
                })
              }
            </CommentContainer>
          )
        })
      }
    </>
  )
}

interface ICommentProps {
  post: WithId<PostData>,
  children?: ReactNode
}

function CommentContainer({ post, children }: ICommentProps) {
  return (
    <Stack mt={4} direction="row" spacing={6} px={2}>
      <Box borderRight="1px dotted #62356955" w="1px"/>
      <Box>
        <AuthorTag
          post={post}
        />
        <Box mt={2}>
          <Viewer
            value={post.body}
          />
        </Box>
        <Button variant="outline" borderColor="#62356955" mt={4} size="sm">
          Responder
        </Button>
        {children}
      </Box>
    </Stack>
  )
}