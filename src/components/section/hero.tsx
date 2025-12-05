'use client'

import { coffeeShop, ngooCfText } from '@/assets/images'
import { Button } from '@/components/ui'
import { cn } from '@/utils'
import { ArrowRightIcon, CowIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ANIMATION_DURATION = 700 // 700ms

export const Hero = () => {
  const [animationEnded, setAnimationEnded] = useState<boolean>(false)
  useEffect(() => {
    const animationTimeOut = setTimeout(
      () => setAnimationEnded(true),
      ANIMATION_DURATION,
    )

    return () => {
      clearTimeout(animationTimeOut)
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', !animationEnded)
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [animationEnded])

  return (
    <section className='bg-dark-600 relative overflow-hidden px-2 pt-6 pb-10 md:px-6 md:pt-10 md:pb-20 lg:px-10 lg:pt-20 lg:pb-30'>
      {/* Background image */}
      <div className='absolute z-0 size-full'>
        <Image
          alt='banner'
          src={coffeeShop}
          className='size-full object-cover object-[40%_50%] opacity-20 duration-300 md:object-fill md:object-center'
          width={1920}
          height={1080}
          unoptimized
        />
      </div>

      {/* Main Content */}
      <div className='relative z-10 mx-auto flex h-[480px] w-full max-w-[1200px] grow items-center gap-4 overflow-hidden md:gap-6 lg:h-[calc(100dvh-322px)] lg:gap-10'>
        <div
          className={cn(
            'z-10 flex w-full translate-x-0 flex-col items-center gap-2 duration-1000 md:items-start md:gap-6',
            animationEnded
              ? 'translate-x-0 opacity-100'
              : '-translate-x-full opacity-0',
          )}
        >
          <h1 className='text-28! md:text-35! lg:text-44! text-beige-300 w-full text-center font-bold md:w-fit md:text-left'>
            Everything <br className='hidden md:inline' /> is better with
            <br />
            <span className='text-secondary-500 flex w-full items-center justify-center md:w-fit md:justify-normal'>
              Ng
              <CowIcon className='text-secondary-400 size-10' weight='fill' />
              o&nbsp;<span className='text-beige-300'>Coffee</span>
            </span>
          </h1>
          <p className='text-beige-50 text-18! px-4 text-center md:max-w-none md:text-left'>
            NgOo Coffee is the missing piece that makes everyday complete,
            <br className='md:hidden' />a simple yet delicious joy in life
          </p>
          <div className='from-beige-100 hidden h-0.25 w-full bg-linear-to-r to-transparent md:inline' />
          <div className='flex w-full max-w-[320px] flex-col items-center justify-center gap-2 px-4 text-lg md:w-fit md:max-w-none md:flex-row md:gap-4'>
            <Button
              className='bg-secondary-500 w-full border border-white/10 md:w-fit'
              icon={<ArrowRightIcon size={16} />}
            >
              Order Now
            </Button>
            <Button
              className='w-full border border-white/10 bg-neutral-900 text-white md:w-fit'
              disableAnimation
            >
              Learn more
            </Button>
          </div>
        </div>

        <div className='relative hidden min-h-60 w-full md:flex'>
          <Image
            alt='main-herobanner'
            src={ngooCfText}
            width={3287}
            height={1641}
            className='absolute -top-10 size-full object-fill lg:left-17 lg:min-h-70'
            priority
          />
        </div>
      </div>
    </section>
  )
}
