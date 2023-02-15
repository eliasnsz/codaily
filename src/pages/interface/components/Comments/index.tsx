import { ISession, PostData } from "@/types";
import { Box, Button, Flex, Stack } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import AnswerButtonOrEditor from "../AnswerButtonOrEditor";
import AuthorTag from "../AuthorTag";
import Viewer from "../Markdown";
import OptionsButton from "../OptionsButton";

interface IProps {
  comments: WithId<PostData>[],
  subCommentAuthor?: string
  subCommentSlug?: string
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
                      subCommentAuthor={comment.author}
                      subCommentSlug={comment.slug}
                      key={child._id.toString()} 
                      post={child}
                    />
                  )
                })
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
  children?: ReactNode,
  subCommentAuthor?: string,
  subCommentSlug?: string
}

export function CommentContainer({ post, children, subCommentAuthor, subCommentSlug }: ICommentProps) {

  const { data } = useSession()
  const session = data as ISession
  
  return (
    <Stack mt={6} direction="row" spacing={6} px={2}>
      <Box borderRight="1px dotted #62356955" w="1px"/>
      <Box w="100%">
        <Flex w="100%" align="center" justify="space-between">
          <AuthorTag
            post={post}
          />
          {
            post.author === session?.user?.username && 
            <OptionsButton post={post}/>
          }
        </Flex>
        <Box mt={2} mb={3}>
          <Viewer
            value={post.body}
          />
        </Box>
        <AnswerButtonOrEditor
          subCommentAuthor={subCommentAuthor}
          subCommentSlug={subCommentSlug}
          post={post}
        />
        {children}
      </Box>
    </Stack>
  )
}