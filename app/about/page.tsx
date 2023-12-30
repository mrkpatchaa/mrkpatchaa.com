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
  const post = await getPostBySlug('about', true)
  if (!post || !post.body) return <div></div>
  const content = await markdownToHtml(post.body || '')
  return <PostBody content={content} />
}
