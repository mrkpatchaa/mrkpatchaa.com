import Link from 'next/link'

import { postHref } from '@/lib/post-utils'

import DateFormatter from './date-formatter'

export default function PostPreview({ title, date, excerpt, slug, headingLevel = 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3'
  return (
    <article className="post-row">
      <div>
        <Heading>
          <Link href={postHref({ slug })}>{title}</Link>
        </Heading>
        <p className="post-row-excerpt">{excerpt}</p>
        <div className="post-row-date">
          <DateFormatter dateString={date} />
        </div>
      </div>
      <span className="row-arrow" aria-hidden="true">
        →
      </span>
    </article>
  )
}
