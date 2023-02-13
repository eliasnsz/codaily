import { Link as ChakraLink } from "@chakra-ui/react"
import { ReactNode } from "react"

import Link from "next/link"

interface LinkProps {
  href: string,
  children: ReactNode,
  color?: string,
  fontWeight?: number | string
}

const LinkComponent: React.FC<LinkProps> = ({ href, children, color, fontWeight }: LinkProps) => {
  return (
    <ChakraLink 
      fontSize="sm" 
      color={color || "blue.500"} 
      href={href}
      fontWeight={fontWeight || 400}
    >
      {children}
    </ChakraLink>
  )
}


export default LinkComponent