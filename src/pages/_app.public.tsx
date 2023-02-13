import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react"
import { ChakraProvider } from '@chakra-ui/react'
import { Header } from './interface'

import "../styles/bytemd.css"
import moment from "moment"
import 'moment/locale/pt-br'

moment.locale("pt-br")

export default function App({ 
  Component, pageProps: { session, ...pageProps }
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <Header/>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
}
