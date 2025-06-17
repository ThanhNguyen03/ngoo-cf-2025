import { DEV_APP_URL } from '@/constants'
import type { Metadata } from 'next'
import Toaster from '@/components/ui/Toaster'
import { Header } from '@/components/layout'
import '../styles/globals.css'

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
  // const initialState = cookieToInitialState(
  //   getConfig(),
  //   (await headers()).get('cookie')
  // )

  return (
    <html lang='en' className='scroll-smooth'>
      <body className='font-raleway scroll-smooth lining-nums antialiased'>
        <Header />
        {children}
        <Toaster />
        {/* <Footer /> */}
      </body>
    </html>
  )
}
