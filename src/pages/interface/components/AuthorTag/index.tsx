import { PostData } from "@/types";
import { Flex, Tag, Text } from "@chakra-ui/react";

import moment from 'moment'
import { WithId } from "mongodb";
import LinkComponent from "../LinkComponent";

interface IProps {
  post: WithId<PostData>
}

export default function AuthorTag({ post }: IProps) {
  return(
    <Flex align="baseline" gap={4}>
      <Tag fontFamily="mono" size="sm" colorScheme="purple">
        <LinkComponent href={`/${post.author}`}>
          <Text fontSize="xs">{post.author}</Text>
        </LinkComponent>
      </Tag>
      <Text fontSize="xs" color="gray.500">
        {moment(post.published_at).fromNow()}
      </Text>
    </Flex>
  )
}