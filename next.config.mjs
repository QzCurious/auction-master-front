/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'tailwindui.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'auction-master.jp-osa-1.linodeobjects.com' },
      { hostname: 'auctions.c.yimg.jp' },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
}

export default nextConfig
