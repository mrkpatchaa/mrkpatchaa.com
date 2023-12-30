'use client'

import DateFormatter from './date-formatter'
import PostTitle from './post-title'

export default function PostHeader({ title, date }) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      {/* <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} height={620} width={1240} />
      </div> */}
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  )
}
