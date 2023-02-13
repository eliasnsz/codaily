import { GetStaticProps } from 'next/types'
import { DefaultLayout, PostAnchor } from './interface'
import api from '@/services/api'
import { PostData } from '@/types'
import { WithId } from 'mongodb'

interface IProps {
  content: WithId<PostData>[]
}

export default function Home({ content }: IProps) {

  const post = content[0]

  return (
    <>
      <DefaultLayout title="Home">
        {
          content.map((post, index) => {
            return (
              <PostAnchor
                key={post._id.toString()  }
                index={index + 1}
                title={post.title}
                author={post.author}
                comments={post.children_deep_count}
                slug={post.slug}
                publishedAt={post.publishedAt}
              />
            )
          })
        }
      </DefaultLayout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const response = await api.get<WithId<PostData>[]>("/contents")
  const content = response.data

  return {
    props: {
      content
    }
  }
}