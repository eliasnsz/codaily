import { Box, Flex, IconButton, Image, Link as ChakraLink, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Stack } from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/react"
import { FaUserAlt } from "react-icons/fa"

import Link from "next/link"
import { Session } from "next-auth"

interface ISession extends Session {
  user?: {
    id?: string,
    email?: string,
    username?: string,
    createdAt?: string,
    updatedAt?: string,
  },
  expires: string
}

const Header: React.FC = () => {
  const { data: session } = useSession()
  
  return (
    <>
      <Box 
        backgroundColor="#321B36" 
        h="80px"
      >
        <Flex 
          justify="space-between"
          px={4}
          align="center"
        >
          <Image
            h="80px" 
            src="https://i.imgur.com/RA1JDy0.png"
            alt="logo-codaily"
          />
          {
            !session ? <LoginOrRegister/> : <UserProfile session={session as ISession}/>
          }
        </Flex> 
      </Box>
    </>
  )
}

function LoginOrRegister() {
  return (
    <Stack 
      fontSize="sm" 
      fontWeight={600} 
      direction="row" 
      spacing={4} 
      color="#Fff"
    >
      <ChakraLink as={Link} href="/login">Login</ChakraLink>
      <ChakraLink as={Link} href="/cadastro">Cadastro</ChakraLink>
    </Stack>
  )
}

interface IProps {
  session: ISession
}

function UserProfile({ session }: IProps) {
  
  return (
    <Menu>
      <MenuButton
        size="sm"
        as={IconButton}
        aria-label='Options'
        icon={<FaUserAlt/ >}
      />
      <MenuList p={2}>
        <MenuItem borderRadius="md">
          {session.user?.username}
        </MenuItem>
        <MenuDivider mx={-2} />
        <MenuItem borderRadius="md">
          Publicar novo conteúdo
        </MenuItem>
        <MenuItem borderRadius="md">
          Editar perfil
        </MenuItem>
        <MenuDivider mx={-2} />
        <MenuItem onClick={() => signOut()} borderRadius="md" color="red.500">
          Deslogar
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default Header