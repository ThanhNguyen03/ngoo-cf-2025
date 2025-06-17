'use client'
import { cn } from '@/utils'
import { ListIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import React, { useState } from 'react'

export const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <header
        className={cn(
          'fixed top-0 z-50 flex h-16 w-full items-center justify-between rounded-b-2xl bg-white px-2 md:h-20 md:rounded-b-3xl md:px-6 lg:px-10',
          isOpen && 'shadow-[0px_4px_24px_0px_var(--color-primary-100)]'
        )}
      >
        <Link
          href='/'
          className='font-climate-crisis cursor-pointer text-lg uppercase md:text-2xl'
        >
          ONtegrity
        </Link>
        <div className='flex items-center gap-2 md:gap-3 lg:gap-4'>
          {/* button mobile menu */}
          <div
            className='cursor-pointer rounded-lg border border-neutral-900/10 bg-white p-[6px] lg:hidden'
            onClick={toggleMobileMenu}
          >
            {isOpen ? <XIcon size={16} /> : <ListIcon size={16} />}
          </div>
        </div>
      </header>
    </>
  )
}
