import { GetStaticProps } from 'next/types'
import { DefaultLayout, PostAnchor } from './interface'
import api from '@/services/api'
import { PostData } from '@/types'
import { WithId } from 'mongodb'
import { Center, Heading } from '@chakra-ui/react'

interface IProps {
  content: WithId<PostData>[]
}

export default function Home() {

  // if (!content.length) {
  //   return (
  //     <DefaultLayout title="Home">
  //       <Center>
  //         <Heading mt={6} fontWeight={600} fontSize="lg">
  //           Nenhum conteúdo encontrado.
  //         </Heading>
  //       </Center>
  //     </DefaultLayout>
  //   )
  // }

  return (
    <>
      {/* <DefaultLayout title="Home">
        {
          content.map((post, index) => {
            return (
              <PostAnchor
                key={post._id.toString()}
                index={index + 1}
                title={post.title}
                author={post.author}
                comments={post.children_deep_count}
                slug={post.slug}
                publishedAt={post.published_at}
              />
            )
          })
        }
      </DefaultLayout> */}
    </>
  )
}

// export const getStaticProps: GetStaticProps = async () => {

//   const response = await api.get<WithId<PostData>[]>("/contents")
//   const content = response.data.reverse()

//   return {
//     props: {
//       content
//     },
//     revalidate: 10
//   }
// }