import api from "@/services/api";
import { PostData } from "@/types";
import { IconButton, Menu, MenuButton, Icon, MenuItem, MenuList } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { BsTrashFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/router"
import { useState } from "react";

interface IProps {
  post: WithId<PostData>
}

export default function OptionsButton({ post }: IProps) {

  const router = useRouter()

  const [isDeleted, setIsDeleted] = useState(false)

  async function handleDelete() {
    await api.delete(`/contents`, { data: { slug: post.slug }})
    if (post.title) {
      return router.push("/")
    }
    return router.reload()
  }
  
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        size="xs"
        borderColor="#62356955"
        aria-label='Options'
        icon={<HiOutlineDotsHorizontal size={15}/>}
        variant='outline'
      />
      <MenuList p={2}>
        <MenuItem onClick={handleDelete} color="red.500" gap={1} alignItems="center">
          <Icon as={BsTrashFill} mb="-1px"/>
          Excluir
        </MenuItem>
      </MenuList>
    </Menu>
  )
}