import Footer from '@/components/layout/footer'
import Header from '@/components/layout/header'
import Toaster from '@/components/ui/Toaster'
import { DEV_APP_URL } from '@/constants'
import { WalletConnectProvider } from '@/providers/wallet-connect-provider'
import type { Metadata } from 'next'
import getConfig from 'next/config'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
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
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie'),
  )

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
        <WalletConnectProvider initialState={initialState}>
          <Header />
          {children}
          <Toaster />
          <Footer />
        </WalletConnectProvider>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
