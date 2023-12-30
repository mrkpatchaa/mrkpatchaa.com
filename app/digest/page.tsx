import MoreStories from '@/components/more-stories'
import { getAllPosts } from '@/lib/api'

export const generateMetadata = async () => {
  return {
    title: 'Weekly digests',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/digest`,
    },
  }
}

export default async function Index() {
  const allPosts = await getAllPosts(false, true)
  return <>{allPosts?.length > 0 && <MoreStories posts={allPosts} title={'Weekly digests'} />}</>
}
