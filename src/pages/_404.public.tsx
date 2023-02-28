import { Center, Heading, Image, Stack } from "@chakra-ui/react";
import { DefaultLayout, LinkComponent } from "./interface";

export default function _404() {
  return (
    <DefaultLayout title="Erro 404">
      <Center h="calc(100vh - 300px)">
        <Stack gap={4} align="center">
          <Stack direction="row" align="center">
            <Image
              h="90px"
              ml={-4}
              src="https://www.tabnews.com.br/_next/static/media/bot-sleepy-face-dark-transparent.6fd852c0.svg"
              alt="error404-logo"
            />
            <Heading pl={4} borderLeft="1px dotted #00000033" as="h1" size="xl">
              404
            </Heading>
          </Stack>
          <Heading as="h2" size="md">
            Página não encontrada
          </Heading>
          <LinkComponent href="/">
            Retornar à tela inicial
          </LinkComponent>
        </Stack>
      </Center>
    </DefaultLayout>
  )
}