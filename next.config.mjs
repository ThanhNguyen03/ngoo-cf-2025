/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  env: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NGOO_BACKEND_API: process.env.NEXT_PUBLIC_NGOO_BACKEND_API,
  },
}

export default nextConfig
