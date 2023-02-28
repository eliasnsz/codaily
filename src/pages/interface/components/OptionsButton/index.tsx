import api from "@/services/api";
import { PostData } from "@/types";
import { IconButton, Menu, MenuButton, Icon, MenuItem, MenuList } from "@chakra-ui/react";
import { WithId } from "mongodb";
import { BsTrashFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useRouter } from "next/router"
import { Dispatch, DispatchWithoutAction, SetStateAction, useState } from "react";

interface IProps {
  post: WithId<PostData>
  setIsDeleted: Dispatch<SetStateAction<boolean>>
}

export default function OptionsButton({ post, setIsDeleted }: IProps) {

  const router = useRouter()

  async function handleDelete() {
    await api.delete(`/contents`, { data: { slug: post.slug }})
    setIsDeleted(true)
    return
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