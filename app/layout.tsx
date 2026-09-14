import '@fontsource/fira-code/400.css'
import 'prismjs/themes/prism.css'
import '@/styles/index.css'

import Container from '@/components/container'
import Footer from '@/components/footer'
import Header from '@/components/header'
import { getAllPosts } from '@/lib/api'
import { BLOG_DESCRIPTION, BLOG_TITLE, HOME_OG_IMAGE_URL } from '@/lib/constants'
import { postHref } from '@/lib/post-utils'
import { projects } from '@/lib/projects'

export const metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
  title: {
    default: BLOG_TITLE,
    template: `%s | ${BLOG_TITLE}`,
  },
  description: BLOG_DESCRIPTION,
  keywords: ['mrkpatchaa', 'Médédé Raymond KPATCHAA'],
  authors: [
    {
      name: 'mrkpatchaa',
      url: 'https://github.com/mrkpatchaa',
    },
  ],
  creator: 'mrkpatchaa',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    siteName: BLOG_TITLE,
  },
  twitter: {
    card: 'summary_large_image',
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    images: [HOME_OG_IMAGE_URL],
    creator: '@mrkpatchaa',
  },
  icons: {
    icon: '/icon.png',
  },
}

const themeScript = `(function(){try{var t=localStorage.getItem('mrk-theme');document.documentElement.dataset.theme=t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch(e){}})()`

export default async function RootLayout({ children }) {
  const [posts, digests] = await Promise.all([getAllPosts(), getAllPosts(false, true)])
  const searchItems = [
    ...posts.map((post) => ({ title: post.title, href: postHref(post), kind: 'Article' })),
    ...digests.map((post) => ({ title: post.title, href: postHref(post), kind: 'Digest' })),
    ...projects
      .filter((project) => project.url || project.repo)
      .map((project) => ({ title: project.title, href: project.url || project.repo, kind: 'Project' })),
  ]
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="alternate" type="application/rss+xml" title="mrkpatchaa" href="/feed.xml" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header searchItems={searchItems} />
        <Container>
          <main id="main">{children}</main>
        </Container>
        <Footer />
      </body>
    </html>
  )
}
