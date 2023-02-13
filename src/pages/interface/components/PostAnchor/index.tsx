import { Box, Flex, Text } from "@chakra-ui/react"
import moment from "moment"
import LinkComponent from "../LinkComponent"

interface PostAnchorData {
  index: number
  title: string | null
  author: string
  comments: number
  slug: string
  publishedAt: string
}

const PostAnchor: React.FC<PostAnchorData> = (
  { index, title, author, comments, slug, publishedAt }: PostAnchorData) => {

  return (
    <Box my={1}>
      <Flex>
        <Text fontWeight={600} mr={2} fontSize="md">{index}.</Text>
        <Box>
          <LinkComponent color="#000" href={`/${author}/${slug}`} fontWeight={600}>
            <Text fontSize="md">
              {title}
            </Text>
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

export default PostAnchor