import {Editor as BytemdEditor, Viewer as BytemdViewer} from "@bytemd/react"

//Bytemd Config

import { Box } from "@chakra-ui/react"
import { useState } from "react"

import mermaidLocale from "@bytemd/plugin-mermaid/locales/pt_BR.json"
import gfmLocale from "@bytemd/plugin-gfm/locales/pt_BR.json"
import highlightSsr from "@bytemd/plugin-highlight-ssr"
import frontmatter from "@bytemd/plugin-frontmatter"
import byteMDLocale from "bytemd/locales/pt_BR.json"
import mermaid from "@bytemd/plugin-mermaid"
import gemoji from "@bytemd/plugin-gemoji"
import breaks from "@bytemd/plugin-breaks"
import gfm from "@bytemd/plugin-gfm"


import "highlight.js/styles/github.css"
import "bytemd/dist/index.min.css"
import 'github-markdown-css/github-markdown-light.css';

const plugins = [
  gfm({ locale: gfmLocale }),
  mermaid({ locale: mermaidLocale }),
  breaks(),
  frontmatter(),
  gemoji(),
  highlightSsr(),
]

interface ViewerData {
  value: string
}

const Viewer = ({ value }: ViewerData) => {
  return(
    <BytemdViewer
      plugins={plugins}
      value={value}
    />
  )
}

interface EditorData {
  value: string
  changeValue: (e: string) => void
}

export const Editor = ({ value, changeValue, ...props}: EditorData) => {

  return (
    <>
      <Box 
        w="100%" 
        outline="1px solid" 
        outlineColor="gray.200"
        border="2px solid transparent"
        transition=".1s ease"
        _focusWithin={{
          borderColor: "blue.500" 
        }}
        borderRadius="lg">
        <BytemdEditor 
          mode="tab"
          value={value}
          locale={byteMDLocale} 
          plugins={plugins}
          onChange={changeValue}
          {...props}
        />
      </Box>
    </>
  )
}

export default Viewer