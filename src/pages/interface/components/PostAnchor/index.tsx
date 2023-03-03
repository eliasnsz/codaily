import { Box, Flex, Text, Icon, Stack } from "@chakra-ui/react"
import LinkComponent from "../LinkComponent"
import {FaRegCommentAlt} from "react-icons/fa"

import moment from "moment"


interface PostAnchorData {
  index: number
  title: string | null
  author: string
  comments: number
  slug: string
  publishedAt: string
  body?: string
}

const PostAnchor: React.FC<PostAnchorData> = (
  { index, title, author, comments, slug, publishedAt, body }: PostAnchorData) => {

  return (
    <Box my={1}>
      <Flex>
        <Box fontWeight={600} mr={2} textAlign="right" w="20px" fontSize="md">
          {index}.
        </Box>
        <Box  w="100%">
          <LinkComponent color="#000" href={`/${author}/${slug}`} fontWeight={600}>
            {
              title ? 
              <Text fontSize="md">
                {title}
              </Text>
              :
              <CommentTitle body={body as string}/>
            }
          </LinkComponent>
          <Flex mt={-1} align="center" gap={1}>
            <Text fontSize="xs" color="gray.500">
              {comments} comentários
            </Text>
            ·
            <LinkComponent href={`/${author}`}>
              <Text fontSize="xs" color="gray.500">
                {author}
              </Text>
            </LinkComponent>
            ·
            <Text fontSize="xs" color="gray.500">
            {moment(publishedAt).fromNow()}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
)
}
interface CommentProps {
  body: string
}

function CommentTitle({ body }: CommentProps) {
  return (
    <>
      <Box color="gray.500" fontSize="md" fontWeight={400}>
        <Text fontStyle="italic" noOfLines={2}>
          <Icon
            w="fit-content"
            mb={-1}
            as={FaRegCommentAlt}
            mr={1}
          />
            {`"${body}"`}
        </Text>
      </Box>
    </>
  )
}

export default PostAnchor