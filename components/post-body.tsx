'use client'

import { useEffect } from 'react'

import Prism from 'prismjs'

import markdownStyles from './markdown-styles.module.css'

import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'

export default function PostBody({ content }) {
  useEffect(() => {
    // console.log("body mounted");
    Prism.highlightAll()
  }, [])

  return (
    <div className="mx-auto max-w-2xl">
      <div className={markdownStyles['markdown']} dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
