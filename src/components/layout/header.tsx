'use client'

import { NgOoLogo, SwitchButton } from '@/components/ui'
import { AuthenButton } from '@/components/ui/wallet-button'
import { LIST_HEADER_NAVIGATION } from '@/constants'
import { cn } from '@/utils'
import { ListIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MobileHeader } from './mobile-header'

export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.classList.add('overflow-hidden!', 'lg:overflow-auto!')
    } else {
      document.body.classList.remove('overflow-hidden!', 'lg:overflow-auto!')
    }
    return () =>
      document.body.classList.remove('overflow-hidden!', 'lg:overflow-auto!')
  }, [isDrawerOpen])

  return (
    <header className='sticky top-0 z-50'>
      <div
        className={cn(
          'bg-beige-50 relative z-10 border-b border-white/[2%] px-2 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] md:px-6 lg:px-10',
          isDrawerOpen && 'border-dark-600/10',
        )}
      >
        <div className='mx-auto flex min-h-12 w-full max-w-[1200px] items-center justify-between'>
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

            <SwitchButton
              variant='white'
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className='rounded-2! size-fit min-h-0 p-2! md:hidden'
            >
              {isDrawerOpen ? <XIcon size={20} /> : <ListIcon size={20} />}
            </SwitchButton>
          </div>
        </div>
      </div>
      {/* menu button */}
      <MobileHeader
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  )
}
