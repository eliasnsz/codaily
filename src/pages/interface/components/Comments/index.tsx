import { ISession, PostData } from "@/types";
import { Box, Button, Center, Flex, Stack } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { useSession } from "next-auth/react";
import { ReactNode, useState } from "react";
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
            <CommentContainer key={comment._id.toString()} post={comment}/>
          )
        }).reverse()
      }
    </>
  )
}

interface ICommentProps {
  post: WithId<PostData>,
  children?: ReactNode,
}

export function CommentContainer({ post, children }: ICommentProps) {

  const { data } = useSession()
  const session = data as ISession
  const [isDeleted, setIsDeleted] = useState(false)

  if (isDeleted) {
    return (
      <Stack mt={6} direction="row" spacing={6} px={2}>
        <Box borderRight="1px dotted #62356955" w="1px"/>
        <Center 
          w="100%" 
          border="1px solid #62356955" 
          py={6} 
          borderRadius="lg"
        >
          Conteúdo apagado com sucesso.
        </Center>
      </Stack>
    )
  }
  
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
            <OptionsButton 
              post={post}
              setIsDeleted={setIsDeleted}
            />
          }
        </Flex>
        <Box mt={2} mb={3}>
          <Viewer
            value={post.body}
          />
        </Box>
      </Box>
    </Stack>
  )
} 