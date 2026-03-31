import { DEV_APP_URL } from '@/constants'
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || DEV_APP_URL

// NOTE: Disallowing /checkout and /payment serves two purposes:
// 1. Saves crawl budget — these pages have zero public content (auth-gated)
// 2. Prevents "soft 404" signals — crawlers hitting auth-gated pages may
//    interpret redirect-to-login as a broken page, hurting domain authority.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/payment'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
