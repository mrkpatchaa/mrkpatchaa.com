import { notFound } from 'next/navigation'

import PostBody from '../../components/post-body'
import { getPostBySlug } from '../../lib/api'
import markdownToHtml from '../../lib/markdownToHtml'

export const generateMetadata = async () => {
  return {
    title: 'About',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about`,
    },
  }
}

export default async function About() {
  const post = await getPostBySlug('about', true, false)
  if (!post || !post.body) notFound()
  const content = await markdownToHtml(post.body || '')
  return (
    <>
      <div className="page-heading">
        <p className="eyebrow accent">About</p>
        <h1 className="page-title">Médédé Raymond KPATCHAA</h1>
      </div>
      <PostBody content={content} />
    </>
  )
}
