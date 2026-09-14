export function postHref(post: { slug: string }) {
  return `/${post.slug.startsWith('digest-') ? 'digest' : 'read'}/${post.slug}`
}

export function readingTime(body = '') {
  return Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 220))
}
