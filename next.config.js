/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/wedding_invitation' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wedding_invitation/' : '',
  trailingSlash: true,
}

module.exports = nextConfig
