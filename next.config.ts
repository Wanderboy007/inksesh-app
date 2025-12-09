/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com', // Covers all scontent-*.cdninstagram.com
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',        // Facebook/Instagram backup CDN
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',        // For your mock data
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',        // For your mock data
      },
    ],
  },
};

export default nextConfig;