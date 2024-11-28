import type { Metadata, ResolvingMetadata } from 'next'

import PostBody from '@/components/post-body'
import PostHeader from '@/components/post-header'
import { getAllPosts, getPostBySlug } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // TODO: MRK - Add SEO meta data
  const slug = (await params).slug
  const parentOg = (await parent).openGraph
  try {
    const post = await getPostBySlug(slug)
    if (!post) {
      return {}
    }
    return {
      title: post.title,
      // description: listingSeoMeta.description,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/read/${slug}`,
      },
      openGraph: {
        ...parentOg,
        title: post.title,
        // canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/read/${slug}`,
        // description: listingSeoMeta.description,
        // images: listingSeoMeta.images?.length
        //   ? listingSeoMeta.images.map((image) => getListingImageUrl(supabase, image, 'full'))
        //   : [`${process.env.NEXT_PUBLIC_SITE_URL}/no-image.png`],
      },
      twitter: {
        // images: listingSeoMeta.images?.length
        //   ? getListingImageUrl(supabase, listingSeoMeta.images[0], 'full')
        //   : `${process.env.NEXT_PUBLIC_SITE_URL}/no-image.png`,
      },
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug
  const post = await getPostBySlug(slug)
  const content = await markdownToHtml(post.body || '')
  return (
    <article>
      {/* <meta property="og:image" content={post.cover} /> */}
      <PostHeader
        title={post.title}
        // coverImage={post.cover}
        date={post.createdAt}
        // author={post.author}
      />
      <PostBody content={content} />
    </article>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }))
}
