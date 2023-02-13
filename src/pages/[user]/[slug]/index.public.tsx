import { AuthorTag, DefaultLayout, Viewer } from "@/pages/interface";
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next/types"
import { GetStaticPaths } from "next"
import { PostData } from "@/types";
import { WithId } from "mongodb";

import api from "@/services/api";
  import { Box, Divider, Flex, Heading, Stack } from "@chakra-ui/react";

interface IProps {
  post: WithId<PostData>
}

export default function Slug({ post }: IProps) {

  return (
    <DefaultLayout title={post.title || post.body}>
      <Stack direction="row" spacing={6} px={2}>
        <Box borderRight="1px dotted #62356955" w="1px"></Box>
        <Box>
          <AuthorTag
            post={post}
          />
          <Heading my={2} fontSize="2em" fontWeight={500}>
            {post.title}
          </Heading>
          <Box bg="Red">
            <Viewer
              value={post.body}
            />
          </Box>
        </Box>
      </Stack>
    </DefaultLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async (context) => {

  const postsResponse = await api.get<WithId<PostData>[]>("/contents")
  const posts = postsResponse.data

  const paths = posts.map(post => ({ params: { slug: post.slug, user: post.author }}))

  return {
    paths,
    fallback: "blocking"
  }
}

interface IParams extends ParsedUrlQuery {
  user: string,
  slug: string
}

export const getStaticProps: GetStaticProps = async (context) => {

  const { user, slug } = context.params as IParams  
  
  
  try {
    
    const response = await api.get<WithId<PostData>>(`/contents/${user}/${slug}`)
    const post = response.data

    return {
      props: {
        post
      },
      revalidate: 60
    }
  }
  catch (error) {

    return {
      props: {},
      redirect: {
        destination: "/404",
        permanent: false
      },
    }
  }
}