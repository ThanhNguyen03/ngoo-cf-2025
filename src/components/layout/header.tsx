'use client'

import { LIST_HEADER_NAVIGATION } from '@/constants'
import { cn } from '@/utils'
import {
  CoffeeBeanIcon,
  CowIcon,
  ListIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ConnectWalletButton } from '../ui/wallet-button'
import { useAccount } from 'wagmi'

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const pathname = usePathname()
  const { isConnected, address } = useAccount()

  return (
    <header className='sticky top-0 z-50 border-b border-white/[2%] bg-beige-300 px-2 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] md:px-6'>
      <div className='mx-auto flex h-12 w-full max-w-[960px] items-center justify-between'>
        {/* left */}
        <Link href='/' className='flex items-center justify-center gap-2 py-2'>
          {/* logo */}
          <div className='rounded-1 p-0.75 bg-white'>
            <CowIcon size={24} weight='fill' className='text-primary-500' />
          </div>
          <h1 className='text-18 font-bold leading-5 flex flex-col items-start text-red-500'>
            <span className='flex items-center'>
              Ng
              <CoffeeBeanIcon
                size={18}
                className='text-secondary-400'
                weight='fill'
              />
              o
            </span>
            <span className='text-dark-600'>Coffee</span>
          </h1>
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
                'flex h-full items-center justify-center gap-2 px-3',
                pathname === link.href
                  ? 'underline-active text-dark-600'
                  : 'underline-hover text-dark-600/70 hover:text-dark-600'
              )}
            >
              <div className='shrink-0'>{link.icon}</div>
              <p className='text-14 font-semibold'>{link.name}</p>
            </Link>
          ))}
        </div>

        {/* right */}
        <div className='flex h-full items-center justify-center gap-2 py-2'>
          {/* demo connect wallet button */}
          <ConnectWalletButton isConnected={isConnected} address={address} />

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
