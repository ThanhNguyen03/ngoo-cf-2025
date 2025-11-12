'use client'

import { NgOoLogo, SwitchButton } from '@/components/ui'
import { AuthenButton } from '@/components/ui/wallet-button'
import { LIST_HEADER_NAVIGATION } from '@/constants'
import { cn } from '@/utils'
import {
  ListIcon,
  ShoppingCartSimpleIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const pathname = usePathname()

  return (
    <header className='bg-beige-100 sticky top-0 z-50 border-b border-white/[2%] px-2 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] md:px-6'>
      <div className='mx-auto flex h-12 w-full max-w-[1024px] items-center justify-between'>
        {/* left */}
        <NgOoLogo isDark />

        {/* center content */}
        <div className='absolute left-1/2 hidden size-full -translate-x-1/2 items-center justify-center md:flex lg:gap-4'>
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
                  : 'underline-hover text-dark-600/70 hover:text-dark-600',
              )}
            >
              <div className='shrink-0'>{link.icon}</div>
              <p className='text-14 font-semibold'>{link.name}</p>
            </Link>
          ))}
        </div>

        {/* right */}
        <div className='z-10 flex h-full items-center justify-center gap-2 py-2'>
          {/* authen button */}
          <AuthenButton />

          <div className='hidden h-full w-0.25 bg-neutral-900/10 md:inline' />

          <ShoppingCartSimpleIcon size={24} className='hidden md:inline' />
          {/* menu button */}
          {
            <SwitchButton
              variant='white'
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className='rounded-2! h-8.25 min-h-8.25 w-fit px-2 md:hidden'
            >
              {isDrawerOpen ? <XIcon /> : <ListIcon />}
            </SwitchButton>
          }
        </div>
      </div>
    </header>
  )
}
