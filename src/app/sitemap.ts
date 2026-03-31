import { DEV_APP_URL } from '@/constants'
import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || DEV_APP_URL

// NOTE: Next.js App Router generates /sitemap.xml automatically from this file.
// Priority and changeFrequency are hints to crawlers — not strict rules.
// /menu gets high priority (0.9) because it's the main conversion page.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      // Slightly lower than homepage — product catalog changes but brand stays same
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/profile`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      // Low priority — auth-gated, personal content, low SEO value
      priority: 0.3,
    },
  ]
}
