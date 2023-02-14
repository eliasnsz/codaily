import { PostData } from "@/types";
import { Box, Button, Stack } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { useState } from "react";
import { Editor } from "../Markdown";

interface IProps {
  post: WithId<PostData>
}

export default function AnswerButtonOrEditor({ post }: IProps) {

  const [isSending, setIsSending] = useState(false) 
  const [state, setState] = useState<null|"editing"|"published">(null)
  const [body, setBody] = useState("")

  if (state === "editing") {
    return (
      <Box w="100%" py={6}>
        <Editor value={body} changeValue={(e: string) => setBody(e)}/>
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
          >
            Publicar
          </Button>
        </Stack>
      </Box>
    )
  }
  
  return (
    <Button 
      onClick={() => setState(null)} 
      variant="outline" 
      borderColor="#62356955" 
      size="sm"
    >
      Responder
    </Button>
  )
}