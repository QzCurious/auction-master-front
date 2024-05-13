/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE_URL}/:path*`,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        hostname: 'tailwindui.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

export default nextConfig
