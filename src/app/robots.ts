import { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://ngoo-coffee.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/checkout', '/payment'] },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
