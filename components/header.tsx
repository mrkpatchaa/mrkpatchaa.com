import Image from 'next/image'
import Link from 'next/link'

import { siGithub, siLinkedin, siX } from 'simple-icons'

import { SOCIAL } from '../lib/constants'

export default function Header() {
  return (
    <div className="mb-10 mt-8 flex flex-row flex-nowrap items-center justify-between md:mb-20">
      <div className="flex flex-row flex-nowrap items-center justify-end">
        <h2 className="relative mr-4 h-8 w-16 leading-none">
          <Link href="/" className="icon relative inline-block h-8 w-16">
            <Image
              src={'/assets/mrk.svg'}
              alt={'Médédé Raymond KPATCHAA'}
              fill
              sizes="100vw"
              className="w-full object-contain"
            />
          </Link>
        </h2>
        <Link href="/digest" className="mr-4 flex text-neutral-900 underline underline-offset-4">
          <span className="hidden md:inline">Weekly&nbsp;</span>Digests
        </Link>
        <Link href="/about" className="text-neutral-900 underline underline-offset-4">
          About
        </Link>
      </div>
      <nav className="flex flex-row flex-nowrap justify-end">
        {/* <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
                          <span
                            className="inline-block icon w-12 h-8"
                            style={{ color: '#263238' }}
                            dangerouslySetInnerHTML={{ __html: siRss.svg }}
                          />
                        </a> */}
        <a href={`https://github.com/${SOCIAL.github}`} target="_blank" rel="noopener noreferrer">
          <span
            className="icon inline-block h-8 w-12"
            style={{ color: '#263238' }}
            dangerouslySetInnerHTML={{ __html: siGithub.svg }}
          />
        </a>
        <a href={`https://twitter.com/${SOCIAL.twitter}`} target="_blank" rel="noopener noreferrer">
          <span
            className="icon inline-block h-8 w-12"
            style={{ color: '#000000' }}
            dangerouslySetInnerHTML={{ __html: siX.svg }}
          />
        </a>
        <a href={`https://linkedin.com/in/${SOCIAL.linkedin}`} target="_blank" rel="noopener noreferrer">
          <span
            className="icon inline-block h-8 w-12"
            style={{ color: '#0077B5' }}
            dangerouslySetInnerHTML={{ __html: siLinkedin.svg }}
          />
        </a>
      </nav>
    </div>
  )
}
