/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NGOO_BACKEND_API: process.env.NEXT_PUBLIC_NGOO_BACKEND_API,
  },
}

export default nextConfig
