import api from "@/services/api";
import { ISession, PostData } from "@/types";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { useSession } from "next-auth/react";
import { useRouter } from "next/dist/client/router";
import { FormEvent, useEffect, useState } from "react";
import AuthorTag from "../AuthorTag";
import Comments, { CommentContainer } from "../Comments";
import Viewer, { Editor } from "../Markdown";

interface IProps {
  post: WithId<PostData>,
  subCommentAuthor?: string
  subCommentSlug?: string
}

export default function AnswerButtonOrEditor({ post, subCommentAuthor, subCommentSlug }: IProps) {

  const { data } = useSession() 
  const session = data as ISession
  const router = useRouter()

  const [newComment, setNewComment] = useState<WithId<PostData> | null>(null)
  const [state, setState] = useState<null | "editing" | "published">(null)
  const [globalError, setGlobalError] = useState<null | string>(null)
  const [isSending, setIsSending] = useState(false) 
  const [body, setBody] = useState("")

  useEffect(() => {
    setGlobalError(null)
  }, [body])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await api.post("/contents", { 
          body, 
          author: session.user?.username,
          author_id: session.user?.id,
          parent_id: post._id.toString()
        })
      setNewComment(response.data)

    } catch (error: any) {

      const { message } = error.response.data
      setGlobalError(message)
    }

    setState("published")
    setIsSending(false)
  }

  if (state === "editing") {
      if (!session) {
        router.push("/login")
      }
    return (
      <Box w="100%" py={6}>
        <Editor value={body} changeValue={(e: string) => setBody(e)}/>
        {
          globalError && 
          <Text mt={1} fontSize="sm" fontWeight={600} color="red.500">
            {globalError}
          </Text>
        }
        <Stack direction="row" justify="end" mt={4} mb={-2}>
          <Button size="sm" onClick={() => setState(null)}>
            Cancelar
          </Button>
          <Button
            mt={4}
            size="sm"
            isLoading={isSending}
            isDisabled={isSending}
            colorScheme="green"
            onClick={handleSubmit}
          >
            Publicar
          </Button>
        </Stack>
      </Box>
    )
  }

  if (state === "published") {
    return (
      <Flex 
        borderRadius="lg"
        border="1px solid #62356955" 
        my={6}
        align="center"
        w="100%"
        px={6}
      >
        <Box py={4} px={2}>
          <AuthorTag post={newComment as WithId<PostData>}/>
          <Viewer value={body}  />
        </Box>
      </Flex>
    )
  }
  
  return (
    <Button 
      onClick={() => setState("editing")} 
      variant="outline" 
      borderColor="#62356955" 
      size="sm"
    >
      Responder
    </Button>
  )
}