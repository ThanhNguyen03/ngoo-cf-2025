import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { DEV_APP_URL } from '@/constants'
import authOptions from '@/lib/auth-option'
import { ApolloProvider } from '@/providers/apollo-provider'
import { WalletConnectProvider } from '@/providers/wallet-connect-provider'
import type { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || DEV_APP_URL),
  title: 'NgOo Coffee',
  description: '',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <html lang='en' className='scroll-smooth'>
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

      <body className='font-raleway scroll-smooth bg-white lining-nums antialiased'>
        <ApolloProvider session={session}>
          <WalletConnectProvider>
            <Header />
            {children}
            <Footer />
          </WalletConnectProvider>
        </ApolloProvider>
      </body>
    </html>
  )
}
