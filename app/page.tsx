import Link from 'next/link'

// import HeroPost from '@/components/hero-post'
import MoreStories from '@/components/more-stories'
import PostPreview from '@/components/post-preview'
import { getAllPosts } from '@/lib/api'

export default async function Index() {
  const allPosts = await getAllPosts()
  const heroPost = allPosts[0]
  const morePosts = allPosts.slice(1)
  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-y-20 pb-16 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        {/* {heroPost && (
          <HeroPost
            title={heroPost.title}
            coverImage={heroPost.cover}
            date={heroPost.createdAt}
            // author={heroPost.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )} */}
        {heroPost && (
          <PostPreview
            key={heroPost.slug}
            title={heroPost.title}
            // coverImage={heroPost.cover}
            date={heroPost.createdAt}
            // author={post.author}
            slug={heroPost.slug}
            excerpt={heroPost.excerpt}
          />
        )}
        <div className="relative flex h-60 flex-col justify-between rounded-sm bg-black px-4 py-8">
          <Link href={'/digest'} className="absolute inset-0 cursor-pointer"></Link>
          <p className="text-xl text-white">{'>_'}</p>
          <h2 className="text-3xl leading-snug text-white">Weekly digests</h2>
          <p className="text-xl text-white">Weekly digests of my readings and interesting topics.</p>
        </div>
      </div>
      {morePosts.length > 0 && <MoreStories posts={morePosts} />}
    </>
  )
}
