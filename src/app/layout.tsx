import { Header } from '@/components/layout/header'
import { DEV_APP_URL } from '@/constants'
import authOptions from '@/lib/auth-option'
import { ApolloProvider } from '@/providers/apollo-provider'
import { WalletConnectProvider } from '@/providers/wallet-connect-provider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || DEV_APP_URL),
  title: {
    default: 'NgOo Coffee — Premium Vietnamese Coffee, Delivered Fresh',
    template: '%s | NgOo Coffee',
  },
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
  openGraph: {
    type: 'website',
    siteName: 'NgOo Coffee',
    title: 'NgOo Coffee — Premium Vietnamese Coffee, Delivered Fresh',
    description:
      'Order premium Vietnamese coffee, fresh juices, and specialty drinks online. Pay with cash, bank transfer, or crypto.',
    locale: 'en_US',
  },
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
