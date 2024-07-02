const debug = process.env.NODE_ENV !== 'production'
module.exports = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix: !debug ? 'https://mrkpatchaa.com/' : '',
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}
