'use client'

import { coffeeShop, ngooCfText } from '@/images'
import { cn } from '@/utils'
import { ArrowRightIcon, CowIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Button from '../ui/Button'

const ANIMATION_DURATION = 700 // 700ms

const Hero = () => {
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
          className='size-full object-fill opacity-20 duration-300'
          width={1920}
          height={1080}
          unoptimized
        />
      </div>

      {/* Main Content */}
      <div className='relative z-10 mx-auto flex h-[calc(100dvh-322px)] w-full max-w-[960px] grow items-center gap-10 overflow-hidden'>
        <div
          className={cn(
            'z-10 flex w-full translate-x-0 flex-col items-start gap-2 opacity-100 duration-1000 md:gap-6',
            animationEnded
              ? 'translate-x-0 opacity-100'
              : '-translate-x-full opacity-0',
          )}
        >
          <h1 className='text-28! md:text-35! lg:text-44! text-beige-300 font-bold'>
            Everything <br /> is better with
            <br />
            <span className='text-secondary-500 flex w-fit items-center'>
              Ng
              <CowIcon className='text-secondary-400 size-10' weight='fill' />
              o&nbsp;<span className='text-beige-300'>Coffee</span>
            </span>
          </h1>
          <p className='text-beige-50 text-18!'>
            NgOo Coffee is the missing piece that makes everyday complete, a
            simple yet delicious joy in life
          </p>
          <div className='from-beige-100 h-0.25 w-full bg-linear-to-r to-transparent' />
          <div className='flex w-fit items-center justify-center gap-2 text-lg md:gap-4'>
            <Button
              className='bg-secondary-500'
              icon={<ArrowRightIcon size={16} />}
            >
              Order Now
            </Button>
            <Button className='text-white' disableAnimation>
              Learn more
            </Button>
          </div>
        </div>

        <div className='relative min-h-60 w-full'>
          <Image
            alt='main-herobanner'
            src={ngooCfText}
            width={3287}
            height={1641}
            className='size-full object-fill'
            priority
          />
        </div>
      </div>
    </section>
  )
}

export default Hero
