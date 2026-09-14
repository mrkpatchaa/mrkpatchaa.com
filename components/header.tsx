import Image from 'next/image'
import Link from 'next/link'

import SiteControls from './site-controls'

export default function Header({ searchItems }) {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand" aria-label="mrkpatchaa — home">
          <Image src="/assets/mrk.svg" alt="MRK" width={52} height={28} priority />
        </Link>
        <nav className="primary-nav" aria-label="Main navigation">
          <Link href="/#articles">Articles</Link>
          <Link href="/digest">Digests</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/about">About</Link>
        </nav>
        <SiteControls items={searchItems} />
      </div>
    </header>
  )
}
