/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  basePath: '/wedding_invitation', // Replace with your repository name
  images: {
    unoptimized: true, // Required for static export
  },
  // This is required to make Next.js work on GitHub Pages
  assetPrefix: '/wedding_invitation/', // Replace with your repository name
}

module.exports = nextConfig 