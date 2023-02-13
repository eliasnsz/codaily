import { Divider, Stack, Text } from "@chakra-ui/react"
import LinkComponent from "../LinkComponent"

const Footer: React.FC = () => {

  return (
    <>
      <Divider borderColor="#62356955" mt={12}/>
      <Stack mt={4} direction="row" justify="center" spacing={8}>
        <LinkComponent 
          href="https://github.com/eliasnsz"
          target="_blank"
        >
          GitHub
        </LinkComponent>
        <LinkComponent 
          href="https://api.whatsapp.com/send?phone=19971495393"
          target="_blank"
        >
          Contato
        </LinkComponent>
        <LinkComponent 
          href="https://www.linkedin.com/in/eliasnsz/"
          target="_blank" 
        >
          LinkedIn
        </LinkComponent>
      </Stack>

      <Text textAlign="center" mt={2} color="gray.700" fontSize="sm">
        © 2023 Codaily
      </Text>
    </>
  )
}

export default Footer

