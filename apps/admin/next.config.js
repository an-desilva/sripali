/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sripalie/ui', '@sripalie/types'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
    ],
  },
};

module.exports = nextConfig;
