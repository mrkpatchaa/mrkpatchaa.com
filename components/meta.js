import Head from 'next/head'

import { BLOG_TITLE, HOME_OG_IMAGE_URL } from '../lib/constants'

export default function Meta() {
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/favicons/safari-pinned-tab.svg" color="#000000" />
      <link rel="shortcut icon" href="/favicons/favicon.ico" />
      <link rel="icon" type="image/svg+xml" href="/assets/images/favicon.svg" />
      <link rel="icon" type="image/png" href="/assets/images/favicon.png" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicons/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <meta name="description" content={BLOG_TITLE} />
      <meta property="og:image" content={HOME_OG_IMAGE_URL} />
    </Head>
  )
}
