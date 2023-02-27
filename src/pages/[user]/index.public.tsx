import api from "@/services/api"
import { PostData, UserData } from "@/types"
import { Divider, Heading } from "@chakra-ui/react"
import { WithId } from "mongodb"
import { GetStaticPaths } from "next"
import { useSession } from "next-auth/react"
import Router from "next/router"
import { GetStaticProps } from "next/types"
import { ParsedUrlQuery } from "querystring"
import { useEffect } from "react"
import { DefaultLayout, PostAnchor } from "../interface"

interface IProps {
  user: string,
  userContent: WithId<PostData>[]
}

export default function User({ user, userContent }: IProps) {

  const { data: session } = useSession()

  useEffect(() => {
    if (!session) {
      Router.push("/login")
    }
  }, [session])

  return (
    <DefaultLayout title={user}>
      <Heading>
        { user }
      </Heading>
      <Divider borderColor="#62356955" my={4} opacity={1}/>
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