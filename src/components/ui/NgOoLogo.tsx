import { cn } from '@/utils'
import { CoffeeBeanIcon, CowIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FC } from 'react'

type TNgOoLogoProps = {
  isDark?: boolean
}

export const NgOoLogo: FC<TNgOoLogoProps> = ({ isDark }) => {
  return (
    <Link href='/' className='z-10 flex items-center justify-center gap-2 py-2'>
      {/* logo */}
      <div
        className={cn(
          'rounded-1 border-dark-600/10 border p-1 shadow',
          isDark ? 'bg-white' : 'bg-beige-100',
        )}
      >
        <CowIcon size={30} weight='fill' className='text-primary-600' />
      </div>
      <h1 className='text-18 flex flex-col items-start leading-5 font-bold text-red-500'>
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
  )
}
