import Link from 'next/link'

import MoreStories from '@/components/more-stories'
import { getAllPosts } from '@/lib/api'

export default async function Index() {
  const allPosts = await getAllPosts()
  return (
    <>
      <div className="mb-16 grid grid-cols-1 gap-y-20 pb-16 md:grid-cols-2 md:gap-x-16 md:gap-y-32 lg:gap-x-32">
        <div className="relative flex h-60 flex-col justify-between rounded-sm bg-black px-4 py-8">
          <Link href={'/digest'} className="absolute inset-0 cursor-pointer"></Link>
          <p className="text-xl text-white">{'>_'}</p>
          <h2 className="text-3xl leading-snug text-white">Weekly digests</h2>
          <p className="text-xl text-white">Weekly digests of my readings and interesting topics.</p>
        </div>
        <div className="relative flex h-60 flex-col justify-between rounded-sm bg-black px-4 py-8">
          <Link href={'/projects'} className="absolute inset-0 cursor-pointer"></Link>
          <p className="text-xl text-white">{'✦'}</p>
          <h2 className="text-3xl leading-snug text-white">Projects</h2>
          <p className="text-xl text-white">A selection of projects I've built or contributed to.</p>
        </div>
      </div>
      {allPosts.length > 0 && <MoreStories posts={allPosts} title="Articles" />}
    </>
  )
}
