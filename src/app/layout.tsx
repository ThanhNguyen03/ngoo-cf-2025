import { DEV_APP_URL } from '@/constants'
import type { Metadata } from 'next'
import Toaster from '@/components/ui/Toaster'
import './globals.css'
import Header from '@/components/layout/header'
import { cookieToInitialState } from 'wagmi'
import getConfig from 'next/config'
import { headers } from 'next/headers'
import { WalletConnectProvider } from '@/providers/wallet-connect-provider'

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
    (await headers()).get('cookie')
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

      <body className='font-raleway scroll-smooth lining-nums antialiased bg-white'>
        <WalletConnectProvider initialState={initialState}>
          <Header />
          {children}
          <Toaster />
        </WalletConnectProvider>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
