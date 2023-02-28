import { Center, Divider, Heading } from "@chakra-ui/react"
import { DefaultLayout, PostAnchor } from "../interface"
import { PostData, UserData } from "@/types"
import { ParsedUrlQuery } from "querystring"
import { GetStaticProps } from "next/types"
import { GetStaticPaths } from "next"
import { useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { WithId } from "mongodb"

import api from "@/services/api"

interface IProps {
  user: string,
  userContent: WithId<PostData>[]
}

export default function User({ user, userContent }: IProps) {
  
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status !== "loading") {
      if (!session) {
        router.push("/login")
      }
    }
  }, [session, status, router])

  return (
    <DefaultLayout title={user}>
      <Heading>
        { user }
      </Heading>
      <Divider borderColor="#62356955" my={4} opacity={1}/>
      {
        !userContent.length && 
        <Center>
          <Heading mt={6} fontWeight={600} fontSize="lg">
            Nenhum conteúdo encontrado.
          </Heading>
        </Center>
      }
      {
        userContent.map((item, index) => {
          return (
            <PostAnchor
              index={index + 1}
              key={item._id.toString()}
              author={item.author}
              comments={item.children_deep_count}
              publishedAt={item.published_at}
              slug={item.slug}
              title={item.title}
              body={item.body}
            />
          )
        })
      }
    </DefaultLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {

  const response = await api.get<UserData[]>("/users")
  const users = response.data

  const paths = users.map(({ username }) => ({ params: { user: username }}))

  return {
    paths,
    fallback: "blocking"
  }
}

interface IParams extends ParsedUrlQuery {
  user: string
}

export const getStaticProps: GetStaticProps = async (context) => {

  const { user } = context.params as IParams
  const response = await api.get<WithId<PostData>[]>(`/contents/${user}`)
  const userContent = response.data

  return {
    props: { user, userContent },
    revalidate: 10
  }
}