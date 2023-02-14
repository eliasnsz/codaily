import api from "@/services/api";
import { ISession, PostData } from "@/types";
import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import AuthorTag from "../AuthorTag";
import Comments, { CommentContainer } from "../Comments";
import Viewer, { Editor } from "../Markdown";

interface IProps {
  post: WithId<PostData>
}

export default function AnswerButtonOrEditor({ post }: IProps) {

  const { data } = useSession() 
  const session = data as ISession

  const [state, setState] = useState<null|"editing"|"published">(null)
  const [globalError, setGlobalError] = useState<null|string>(null)
  const [isSending, setIsSending] = useState(false) 
  const [body, setBody] = useState("")

  useEffect(() => {
    setGlobalError(null)
  }, [body])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await api.post(`/contents/${post.author}/${post.slug}`, { 
        body, author: session.user?.username 
      })
      console.log(response);
      
    } catch (error: any) {
      const { message } = error.response.data
      setGlobalError(message)
    }
    setState("published")
    setIsSending(false)
  }

  if (state === "editing") {
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
      <Box w="100%" py={6}>
        <CommentContainer post={post} />
      </Box>
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