import { Button, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { FormEvent, useEffect, useState } from "react";
import { DefaultLayout, Editor } from "../interface";
import { useRouter } from "next/router"
import api from "@/services/api";
import { useSession } from "next-auth/react";
import { ISession, PostData } from "@/types";

export default function Publicar() {
  const router = useRouter()
  
  const {data, status } = useSession()
  const session = data as ISession
  
  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/")
      }
    }
  }, [session, router, status])
  
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [globalError, setGlobalError] = useState(null)

  useEffect(() => {
    setGlobalError(null)
  }, [title, body])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await api.post("/contents", { title, body, author: session?.user?.username})
      const post: PostData = response.data
      router.push(`/${post.author}/${post.slug}`)
      
    } catch (error: any) {
      
      const { name, message, status } = error.response.data
      setGlobalError(message)
      
      return setIsSending(false)
    }

    setIsSending(false)
    return
  }
  
  return (
    <DefaultLayout title="Publicar">
      <Heading fontWeight={500} fontSize="2em" mb={4}>
        Publicar novo conteúdo
      </Heading>
      <form onSubmit={handleSubmit}>
        <Input 
          fontSize="sm" 
          mb={4} 
          type="text" 
          placeholder="Título"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Editor value={body} changeValue={(e: string) => setBody(e)}/>
        
        {
          globalError && 
          <Text fontSize="sm" fontWeight={600} color="red.500">
            {globalError}
          </Text>
        }

        <Stack direction="row" justify="end" mt={4}>
          <Button size="sm" onClick={() => router.push("/")}>
            Cancelar
          </Button>
          <Button
            mt={4}
            size="sm"
            type="submit"
            isLoading={isSending}
            isDisabled={isSending}
            colorScheme="green"
          >
            Publicar
          </Button>
        </Stack>
      </form>
    </DefaultLayout>
  )
}