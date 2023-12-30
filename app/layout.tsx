import '@fontsource/fira-code/400.css'
import 'prismjs/themes/prism.css'
import '@/styles/index.css'

import Container from '@/components/container'
import Header from '@/components/header'
import { BLOG_DESCRIPTION, BLOG_TITLE, HOME_OG_IMAGE_URL } from '@/lib/constants'

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
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <Container>
            <Header />
            <main>{children}</main>
          </Container>
        </div>
      </body>
    </html>
  )
}
