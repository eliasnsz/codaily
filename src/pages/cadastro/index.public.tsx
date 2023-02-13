import { Box, Button, Flex, FormLabel, Heading, Input, Stack, Text, useToast } from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/react"
import { Dispatch, FormEventHandler, SetStateAction, useEffect, useState } from "react"
import { DefaultLayout, LinkComponent } from "../interface"
import Router from 'next/router' 
import api from "@/services/api"

interface Target extends EventTarget {
  username: { value: string }
  email: { value: string }
  password: { value: string }
}

interface IError {
  message: string,
  name: string,
  status: number
}

const Login: React.FC = () => {

  const {data: session} = useSession()
  const toast = useToast()

  useEffect(() => {
    if (session) {
      Router.push("/")
    }
  }, [session])

  const [isSending, setIsSending] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setIsSending(true)

    const eventTarget = e.target as Target
    const username = eventTarget.username.value
    const email = eventTarget.email.value
    const password = eventTarget.password.value

    try {
      const response = await api.post("/users", { username, email, password })
      
    } catch (err: any) {
      const { name, message, status } = err.response.data

      setGlobalError(message)
      return setIsSending(false)
    }
    
    toast({
      title: 'Pronto!',
      description: "Sua conta foi criada, agora faça login para continuar.",
      status: 'success',
      duration: 4000,
      isClosable: true,
    })
    
    Router.push("/login")
    setIsSending(false)
    
  }

  return (
    <>
      <DefaultLayout title="Cadastro" maxW="xl">
        <Heading mb={8} fontWeight={500} fontSize="2em">Cadastro:</Heading>
        <form onSubmit={handleSubmit}>

        <InputComponent
          label="Usuário"
          name="username"
          type="text"
          setGlobalError={setGlobalError}
        />

        <InputComponent
          label="Email"
          name="email"
          type="email"
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
          Cadastrar
        </Button>


        <Stack mt={8} align="center">
          <Flex gap={1}>
            <Text fontSize="sm">Já possui uma conta?</Text>
            <LinkComponent href="/login">Faça login aqui.</LinkComponent>
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