import DateFormatter from './date-formatter'
import PostTitle from './post-title'

export default function PostHeader({ title, date }) {
  return (
    <header className="post-heading">
      <div className="eyebrow accent">
        <DateFormatter dateString={date} />
      </div>
      <PostTitle>{title}</PostTitle>
    </header>
  )
}
