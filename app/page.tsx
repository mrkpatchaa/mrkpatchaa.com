import Link from 'next/link'

import DateFormatter from '@/components/date-formatter'
import PostPreview from '@/components/post-preview'
import { getAllPosts } from '@/lib/api'
import { postHref, readingTime } from '@/lib/post-utils'
import { projects } from '@/lib/projects'

export default async function Index() {
  const [posts, digests] = await Promise.all([getAllPosts(), getAllPosts(false, true)])
  const [featured, ...articles] = posts
  return (
    <>
      <div className="publication-line">
        <span>A learner’s notebook</span>
        <span>Articles, readings & side projects</span>
      </div>
      {featured ? (
        <section className="featured-article" aria-labelledby="featured-title">
          <div className="feature-meta">
            <span className="eyebrow accent">01 — Latest article</span>
            <DateFormatter dateString={featured.createdAt} />
            <span>{readingTime(featured.body)} min read</span>
          </div>
          <div className="feature-copy">
            <h1 id="featured-title">
              <Link href={postHref(featured)}>{featured.title}</Link>
            </h1>
            <p>{featured.excerpt}</p>
            <Link className="text-link" href={postHref(featured)}>
              Read article <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      ) : (
        <h1 className="page-title">A learner’s notebook</h1>
      )}
      <div className="home-columns">
        <section id="articles" className="home-articles" aria-labelledby="articles-title">
          <div className="section-label">
            <h2 id="articles-title">02 — Articles</h2>
            <span>{String(posts.length).padStart(2, '0')}</span>
          </div>
          {articles.map((post) => (
            <PostPreview
              key={post.slug}
              title={post.title}
              date={post.createdAt}
              excerpt={post.excerpt}
              slug={post.slug}
            />
          ))}
          {articles.length === 0 && <p className="empty-state">More writing to come.</p>}
        </section>
        <section aria-labelledby="digests-title">
          <div className="section-label">
            <h2 id="digests-title">03 — Digests</h2>
          </div>
          {digests.slice(0, 6).map((post) => (
            <Link className="compact-row" key={post.slug} href={postHref(post)}>
              <span>{post.title.replace(/^Digest\s*[-–—]\s*/i, '')}</span>
              <DateFormatter dateString={post.createdAt} />
            </Link>
          ))}
          {digests.length === 0 && <p className="empty-state">No digests yet.</p>}
          <Link href="/digest" className="text-link section-more">
            All digests <span aria-hidden="true">→</span>
          </Link>
        </section>
        <section aria-labelledby="projects-title">
          <div className="section-label">
            <h2 id="projects-title">04 — Projects</h2>
          </div>
          {projects.map((project) => (
            <a className="project-link" key={project.title} href={project.url || project.repo}>
              <span>{project.title}</span>
              <span aria-hidden="true">↗</span>
            </a>
          ))}
          <Link href="/projects" className="text-link section-more">
            All projects <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
      <aside className="rss-note">
        <span className="eyebrow">Keep in touch with the writing</span>
        <p>New articles and weekly readings, in your reader.</p>
        <a href="/feed.xml" className="text-link">
          Subscribe via RSS <span aria-hidden="true">↗</span>
        </a>
      </aside>
    </>
  )
}
