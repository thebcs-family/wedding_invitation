/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/wedding_invitation' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wedding_invitation/' : '',
  trailingSlash: true,
  // Add this line to ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
