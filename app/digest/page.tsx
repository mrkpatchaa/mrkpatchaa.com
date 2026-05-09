import Link from 'next/link'

import DigestYearSwitcher from '@/components/digest-year-switcher'
import MoreStories from '@/components/more-stories'
import { getAllDigestYears, getPostsByYear } from '@/lib/api'

export const generateMetadata = async () => {
  return {
    title: 'Weekly digests',
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/digest`,
    },
  }
}

export default async function Index() {
  const currentYear = new Date().getFullYear()
  const [posts, years] = await Promise.all([getPostsByYear(currentYear), getAllDigestYears()])

  return (
    <>
      {years.length > 0 && <DigestYearSwitcher years={years} activeYear={currentYear} currentYear={currentYear} />}
      {posts.length > 0 ? (
        <MoreStories posts={posts} title={`Weekly digests ${currentYear}`} />
      ) : (
        <div className="mb-16">
          <h1 className="mb-4 text-6xl font-bold leading-tight tracking-tighter md:text-7xl">
            Weekly digests {currentYear}
          </h1>
          <p className="text-lg text-slate-500">
            No digests yet for {currentYear}.{' '}
            {years.filter((y) => y !== currentYear).length > 0 && (
              <>
                Browse{' '}
                <Link
                  href={`/digest/${years.find((y) => y !== currentYear)}`}
                  className="underline underline-offset-4 hover:text-slate-900"
                >
                  {years.find((y) => y !== currentYear)}
                </Link>{' '}
                instead.
              </>
            )}
          </p>
        </div>
      )}
    </>
  )
}
