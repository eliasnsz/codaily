import { Box, Button, Flex, FormLabel, Heading, Input, Stack, Text } from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/react"
import { Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react"
import { DefaultLayout, LinkComponent } from "../interface"
import { useRouter } from 'next/router' 
import api from "@/services/api"
import { BaseError } from "@/errors"
import { IBaseError } from "@/types"

interface Target extends EventTarget {
  username: { value: string }
  password: { value: string }
}

interface LoginResponse {
  error: string | null
}

const Login: React.FC = () => {

  const router = useRouter()
  const {data: session} = useSession()

  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])

  const [isSending, setIsSending] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setIsSending(true)   

    const eventTarget = e.target as Target
    const username = eventTarget.username.value
    const password = eventTarget.password.value

    const { error } = await signIn("credentials", { 
      username, password, redirect: false 
    }) as LoginResponse

    if (error) {
      setGlobalError(error)
      return setIsSending(false)
    }
    
    router.push("/")
  }

  return (
    <>
      <DefaultLayout title="Login" maxW="xl">
        <Heading mb={8} fontWeight={500} fontSize="2em">Login:</Heading>
        <form onSubmit={handleSubmit}>

        <InputComponent
          label="Usuário"
          name="username"
          type="text"
          setGlobalError={setGlobalError}
        />

        <InputComponent
          label="Senha"
          name="password"
          type="password"
          setGlobalError={setGlobalError}
        />

        {
        globalError && 
          <Text fontSize="sm" fontWeight={600} color="red.500">
            {globalError}
          </Text>
        }

        <Button
          w="100%"
          mt={4}
          type="submit"
          isLoading={isSending}
          isDisabled={isSending}
          colorScheme="green"
        >
          Login
        </Button>


        <Stack mt={8} align="center">
          <Flex gap={1}>
            <Text fontSize="sm">Novo no Codaily?</Text>
            <LinkComponent href="/cadastro">Crie sua conta aqui.</LinkComponent>
          </Flex>
        </Stack>
        </form>
      </DefaultLayout>
    </>
  )
}

interface InputComponentProps {
  type: string, 
  name: string, 
  label: string, 
  setGlobalError: Dispatch<SetStateAction<string | null>>
}

function InputComponent({ type, name, label, setGlobalError }: InputComponentProps) {
  return(
    <FormLabel fontSize="sm" w="100%">
      {label}
      <Input 
        focusBorderColor="#A226B5dd"
        borderColor="#62356944" 
        type={type} 
        name={name}
        onChange={() => setGlobalError(null)}
      />
    </FormLabel>
  )
} 

export default Login