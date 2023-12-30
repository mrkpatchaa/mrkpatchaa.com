import Link from 'next/link'

import DateFormatter from './date-formatter'

export default function PostPreview({ title, date, excerpt, slug }) {
  return (
    <div>
      {/* <div className="mb-5">
        <CoverImage
          slug={slug}
          title={title}
          src={coverImage}
          height={278}
          width={556}
        />
      </div> */}
      <h3 className="mb-3 text-3xl leading-snug">
        <Link
          href={`/${slug.startsWith('digest-') ? 'digest' : 'read'}/${slug}`}
          className="font-semibold text-slate-900 hover:underline"
        >
          {title}
        </Link>
      </h3>
      <div className="mb-4 text-lg">
        <DateFormatter dateString={date} />
      </div>
      <p className="mb-4 text-lg leading-relaxed">{excerpt}</p>
    </div>
  )
}
