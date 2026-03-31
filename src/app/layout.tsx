import { Header } from '@/components/layout/header'
import { DEV_APP_URL } from '@/constants'
import authOptions from '@/lib/auth-option'
import { ApolloProvider } from '@/providers/apollo-provider'
import { WalletConnectProvider } from '@/providers/wallet-connect-provider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import './globals.css'

// NOTE: page.tsx is 'use client' so it cannot export metadata — all SEO metadata
// must live here in the root layout (Server Component). The title template pattern
// lets sub-pages like /menu set their own prefix while keeping the brand suffix.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || DEV_APP_URL),
  title: {
    // Default title shown on the homepage
    default: 'NgOo Coffee — Premium Vietnamese Coffee, Delivered Fresh',
    // Sub-page titles render as e.g. "Menu | NgOo Coffee"
    template: '%s | NgOo Coffee',
  },
  // NOTE: description was empty string '' — Google auto-generates from page body
  // which for a 'use client' Apollo-fetched page means skeleton text or nothing.
  // Explicit description gives control over the SERP snippet.
  description:
    'Order premium Vietnamese coffee, fresh juices, and specialty drinks online. Pay with cash, bank transfer, or crypto. Browse our best-seller menu today.',
  keywords: [
    'vietnamese coffee',
    'coffee delivery',
    'order coffee online',
    'crypto payment coffee',
    'ngoo coffee',
    'specialty drinks',
  ],
  // Open Graph — controls appearance when shared on Facebook, Discord, iMessage, etc.
  openGraph: {
    type: 'website',
    siteName: 'NgOo Coffee',
    title: 'NgOo Coffee — Premium Vietnamese Coffee, Delivered Fresh',
    description:
      'Order premium Vietnamese coffee, fresh juices, and specialty drinks online. Pay with cash, bank transfer, or crypto.',
    locale: 'en_US',
  },
  // Twitter card — controls appearance when shared on X / Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'NgOo Coffee — Premium Vietnamese Coffee, Delivered Fresh',
    description:
      'Order premium Vietnamese coffee, fresh juices, and specialty drinks online. Pay with cash, bank transfer, or crypto.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' className='scroll-smooth' data-scroll-behavior='smooth'>
      <head>
        <link
          rel='icon'
          href='/favicon.svg'
          media='(prefers-color-scheme: light)'
        />
        <link
          rel='icon'
          href='/favicon-dark.svg'
          media='(prefers-color-scheme: dark)'
        />
      </head>

      <body className='font-raleway scrollbar-none scroll-smooth bg-white lining-nums antialiased'>
        <ApolloProvider session={session}>
          <WalletConnectProvider>
            <Header />
            {children}
          </WalletConnectProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
