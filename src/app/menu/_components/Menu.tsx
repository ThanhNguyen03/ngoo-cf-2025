'use client'

import MenuDetail from './ui/MenuDetail'
import MenuSearch from './ui/MenuSearch'

const Menu = () => {
  return (
    <section className='relative h-[500px] px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30'>
      <div className='mx-auto flex size-full max-w-[1024px] flex-col items-start gap-4 md:gap-6'>
        <h2 className='text-32! text-secondary-500 font-lobster font-medium duration-700'>
          Menu Search
        </h2>
        <div className='flex size-full items-start gap-3 md:gap-6'>
          <MenuSearch />
          <div className='from-primary-500 to-dark-600/10 h-full w-0.25 bg-gradient-to-b' />
          <MenuDetail />
        </div>
      </div>
    </section>
  )
}

export default Menu
