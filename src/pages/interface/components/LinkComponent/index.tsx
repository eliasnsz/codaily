import { Link as ChakraLink } from "@chakra-ui/react"
import { ReactNode } from "react"

import Link from "next/link"

interface LinkProps {
  href: string,
  children: ReactNode,
  color?: string,
  fontWeight?: number | string
  target?: string
}

const LinkComponent: React.FC<LinkProps> = (
  { href, children, color, fontWeight, target }: LinkProps) => {

  return (
    <ChakraLink 
      fontSize="sm" 
      color={color || "blue.500"} 
      href={href}
      target={target || "_self"}
      fontWeight={fontWeight || 400}
    >
      {children}
    </ChakraLink>
  )
}


export default LinkComponent