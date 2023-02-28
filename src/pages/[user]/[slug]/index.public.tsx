import { Box, Divider, Flex, Heading, Stack, Text, Icon, Center, Button, Menu, MenuButton, MenuItem, MenuList, IconButton } from "@chakra-ui/react";
import { AnswerButtonOrEditor, AuthorTag, Comments, DefaultLayout, LinkComponent, OptionsButton, Viewer } from "@/pages/interface";
import { FaRegCommentAlt } from "react-icons/fa"
import { BsTrashFill } from "react-icons/bs"
import { HiOutlineDotsHorizontal } from "react-icons/hi"
import { ParsedUrlQuery } from "querystring";
import { GetStaticProps } from "next/types"
import { GetStaticPaths } from "next"
import { ISession, PostData } from "@/types";
import { WithId } from "mongodb";

import api from "@/services/api";
import { useSession } from "next-auth/react";

interface IProps {
  post: WithId<PostData>
  children: WithId<PostData>[]
  parent?: WithId<PostData>
}

export default function Post({ post, children, parent }: IProps) {

  const { data } = useSession()
  const session = data as ISession

  return (
    <DefaultLayout title={post.title || post.body}>
      <Stack direction="row" spacing={6} px={2}>
        <Box borderRight="1px dotted #62356955" w="1px"/>
        <Box w="100%">
          {
            !post.title &&
            <Stack direction="row" mb={4} align="center">
              <Icon as={FaRegCommentAlt}/>
              <Text noOfLines={1} fontSize="sm">
                Em resposta a 
                <LinkComponent 
                  fontWeight={600} 
                  href={`/${parent?.author}/${parent?.slug}`}
                > {parent?.title || parent?.body}
                </LinkComponent>
              </Text>
            </Stack>
          }
          <Flex align="center" justify="space-between" w="100%">
            <AuthorTag
              post={post}
            />
            {
              post.author === session?.user?.username && 
              <OptionsButton post={post}/>
            }
          </Flex>
          
          {
            post.title &&
            <Heading my={2} fontSize="2em" fontWeight={500}>
              {post.title}
            </Heading>
          }
          <Box mt={2} bg="Red">
            <Viewer
              value={post.body}
            />
          </Box>
        </Box>
      </Stack>
      {
       post.title &&
        <Flex 
          borderRadius="lg"
          border="1px solid #62356955" 
          my={6}
          align="center"
          minH="70px"
          px={6}
        >
            <AnswerButtonOrEditor 
            post={parent as WithId<PostData>}
            />
        </Flex>
      }
      <Comments comments={children}/>
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
    const parentData = await api.get<WithId<PostData>>(`/contents/${user}/${slug}/parent`)
    const parent = parentData.data

    const childrenData = await api.get<WithId<PostData>[]>(`/contents/${user}/${slug}/children`)
    const children = childrenData.data

    const response = await api.get<WithId<PostData>>(`/contents/${user}/${slug}`)
    const post = response.data
    
    return {
      props: {
        post,
        children,
        parent
      },
      revalidate: 10
    }
    
  } catch (error) {
    console.log(error);
  }
  
  try {
    const childrenData = await api.get<WithId<PostData>[]>(`/contents/${user}/${slug}/children`)
    const children = childrenData.data

    const response = await api.get<WithId<PostData>>(`/contents/${user}/${slug}`)
    const post = response.data

    return {
      props: {
        post,
        children,
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