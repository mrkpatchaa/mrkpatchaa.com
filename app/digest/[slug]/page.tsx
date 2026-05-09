import type { Metadata, ResolvingMetadata } from 'next'

import { notFound } from 'next/navigation'

import DigestYearSwitcher from '@/components/digest-year-switcher'
import MoreStories from '@/components/more-stories'
import PostBody from '@/components/post-body'
import PostHeader from '@/components/post-header'
import { getAllDigestYears, getAllPosts, getPostBySlug, getPostsByYear } from '@/lib/api'
import markdownToHtml from '@/lib/markdownToHtml'

function isYearParam(slug: string): boolean {
  return /^\d{4}$/.test(slug)
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug
  if (isYearParam(slug)) {
    return {
      title: `Weekly digests ${slug}`,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/digest/${slug}`,
      },
    }
  }
  const parentOg = (await parent).openGraph
  try {
    const post = await getPostBySlug(slug, false, true)
    if (!post) {
      return {}
    }
    return {
      title: post.title,
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/digest/${slug}`,
      },
      openGraph: {
        ...parentOg,
        title: post.title,
      },
      twitter: {},
    }
  } catch (error) {
    console.log(error)
    return {}
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug

  if (isYearParam(slug)) {
    const year = Number(slug)
    const currentYear = new Date().getFullYear()
    const [posts, years] = await Promise.all([getPostsByYear(year), getAllDigestYears()])

    if (!years.includes(year)) {
      notFound()
    }

    return (
      <>
        <DigestYearSwitcher years={years} activeYear={year} currentYear={currentYear} />
        <MoreStories posts={posts} title={`Weekly digests ${year}`} />
      </>
    )
  }

  const post = await getPostBySlug(slug, false, true)
  const content = await markdownToHtml(post.body || '')
  return (
    <article>
      <PostHeader title={post.title} date={post.createdAt} />
      <PostBody content={content} />
    </article>
  )
}

export async function generateStaticParams() {
  const [posts, years] = await Promise.all([getAllPosts(false, true), getAllDigestYears()])
  const slugParams = posts.map((post: { slug: string }) => ({ slug: post.slug }))
  const yearParams = years.map((year) => ({ slug: String(year) }))
  return [...slugParams, ...yearParams]
}
