import { getAllPosts } from '@/lib/api'
import { BLOG_DESCRIPTION, BLOG_TITLE } from '@/lib/constants'
import { postHref } from '@/lib/post-utils'

export const dynamic = 'force-static'
const escapeXml = (value = '') =>
  String(value).replace(
    /[<>&"']/g,
    (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[character]!
  )

export async function GET() {
  const [articles, digests] = await Promise.all([getAllPosts(), getAllPosts(false, true)])
  const origin = 'https://mrkpatchaa.com'
  const posts = [...articles, ...digests].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${escapeXml(origin + postHref(post))}</link><guid>${escapeXml(origin + postHref(post))}</guid><pubDate>${new Date(post.createdAt).toUTCString()}</pubDate><description>${escapeXml(post.excerpt || '')}</description></item>`
    )
    .join('')
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${escapeXml(BLOG_TITLE)}</title><link>${origin}</link><description>${escapeXml(BLOG_DESCRIPTION)}</description><atom:link href="${origin}/feed.xml" rel="self" type="application/rss+xml" />${items}</channel></rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } }
  )
}
