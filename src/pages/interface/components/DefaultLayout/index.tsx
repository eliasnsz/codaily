import Head from 'next/head'
import { Container } from "@chakra-ui/react"
import { ReactNode } from 'react'
import Footer from '../Footer'

interface IProps {
  title: string,
  children: ReactNode,
  maxW?: string
}

const DefaultLayout: React.FC<IProps> = ({ title, children, maxW }: IProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff">
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container my={6} maxW={maxW || "4xl"}>
        { children }
      
        <Footer/>
      </Container>
    </>
  )
}

export default DefaultLayout
