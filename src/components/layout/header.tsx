'use client'
import { LIST_HEADER_NAVIGATION } from '@/constants'
import { cn } from '@/utils'
import { ListIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const pathname = usePathname()

  console.log('first', pathname)

  return (
    <header className='sticky top-0 z-50 border-b border-white/[2%] bg-white px-2 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] md:px-6'>
      <div className='mx-auto flex h-12 w-full max-w-[960px] items-center justify-between'>
        {/* left */}
        <Link
          href='/'
          className='flex items-center justify-center gap-1.5 py-2'
        >
          {/* logo */}
          <div className='rounded-0.5 size-5 bg-neutral-900' />
          <h1 className='text-18 font-bold text-neutral-900'>NgOo</h1>
        </Link>

        {/* center content */}
        <div className='hidden h-full items-center justify-center md:flex lg:gap-4'>
          {LIST_HEADER_NAVIGATION.map((link) => (
            <Link
              key={link.name}
              target={link.openInNewTab ? '_blank' : '_self'}
              href={link.href}
              title={link.name}
              className={cn(
                'flex h-full items-center justify-center gap-2 px-3 opacity-70 hover:opacity-100',
                pathname === link.href
                  ? 'underline-active opacity-100'
                  : 'underline-hover'
              )}
            >
              <div className='shrink-0'>{link.icon}</div>
              <p className='text-14! font-semibold text-neutral-900'>
                {link.name}
              </p>
            </Link>
          ))}
        </div>

        {/* right */}
        <div className='flex h-full items-center justify-center gap-2 py-2'>
          {/* demo connect wallet button */}
          {/* <WalletConnect
            connectWalletButtonClassName='bg-primary-500 px-2 py-1.25 h-fit text-[14px] leading-[160%] text-white font-normal border border-neutral-900/10'
            accountButtonClassName='text-black text-[14px] leading-[160%] h-fit'
            switchChainButtonClassName='text-[14px] leading-[160%] hidden'
          /> */}

          {/* menu button */}
          {
            <div
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className={cn(
                'rounded-2 cursor-pointer p-1.5 md:hidden',
                isDrawerOpen
                  ? 'border-primary-500 bg-primary-600 border-2 text-white'
                  : 'border border-neutral-900/10 bg-white'
              )}
            >
              {isDrawerOpen ? <XIcon /> : <ListIcon />}
            </div>
          }
        </div>
      </div>
    </header>
  )
}

export default Header
