'use client'

import { useRef } from 'react'
import { MenuDetail } from './ui/MenuDetail'
import { MenuSearch } from './ui/MenuSearch'

export const Menu = () => {
  const sectionRef = useRef(new Map<string, HTMLDivElement | null>())

  return (
    <section className='from-paper/10 to-paper/2 relative bg-linear-to-b px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30'>
      <div className='mx-auto flex size-full max-w-[1024px] flex-col items-start gap-4 md:gap-6'>
        <h2 className='text-32! text-secondary-500 font-lobster font-medium duration-700'>
          Menu Search
        </h2>
        <div className='relative flex size-full items-start gap-3 md:gap-6'>
          <MenuSearch sectionRef={sectionRef} />
          <div className='from-primary-500 to-dark-600/10 sticky top-20 h-80 w-0.25 bg-gradient-to-b' />
          <MenuDetail sectionRef={sectionRef} />
        </div>
      </div>
    </section>
  )
}
