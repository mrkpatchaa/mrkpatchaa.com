import PostPreview from './post-preview'

export default function MoreStories({ posts, title = undefined }) {
  return (
    <section className="archive">
      <div className="page-heading">
        <p className="eyebrow accent">The archive</p>
        <h1 className="page-title">{title ?? 'Articles'}</h1>
      </div>
      <div className="archive-list">
        {posts.map((post) => (
          <PostPreview
            headingLevel={2}
            key={post.slug}
            title={post.title}
            date={post.createdAt}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  )
}
