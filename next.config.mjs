// Backend API origin for CSP connect-src (e.g. "http://localhost:1337" in dev)
const backendOrigin = process.env.NEXT_PUBLIC_NGOO_BACKEND_API || ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://storage.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src 'self' blob: ${backendOrigin} https://*.paypal.com https://rpc.sepolia.org https://ethereum-sepolia-rpc.publicnode.com wss: ws:`,
              "frame-src https://*.paypal.com https://sandbox.paypal.com",
              "worker-src 'self' blob:",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
