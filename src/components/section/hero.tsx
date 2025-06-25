'use client'

import { useEffect, useState } from 'react'
import { ArrowRightIcon, CowIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Button from '../ui/Button'
import { animatedCoffeeShop, ngooCfText } from '@/images'
import { cn } from '@/utils'
import { LOCALSTORAGE_KEY, ONE_MONTH_MS } from '@/constants'

const ANIMATION_DURATION = 9700 // 9.7s
const CONTENT_DELAY = 7000 // 7s

const Hero = () => {
  const [animationEnded, setAnimationEnded] = useState<boolean>(false)
  const [renderContent, setRenderContent] = useState<boolean>(false)

  useEffect(() => {
    const now = Date.now()
    const lastVisit = localStorage.getItem(LOCALSTORAGE_KEY)
    const isFirstVisit = !lastVisit || now - Number(lastVisit) > ONE_MONTH_MS

    if (isFirstVisit) {
      localStorage.setItem(LOCALSTORAGE_KEY, now.toString())

      const timeout1 = setTimeout(
        () => setAnimationEnded(true),
        ANIMATION_DURATION
      )
      const timeout2 = setTimeout(() => setRenderContent(true), CONTENT_DELAY)

      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
      }
    } else {
      const timeout1 = setTimeout(() => setAnimationEnded(true), 700)
      const timeout2 = setTimeout(() => setRenderContent(true), 300)

      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
      }
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', !animationEnded)
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [animationEnded])

  return (
    <section
      className={cn(
        'px-2 pt-6 pb-10 md:px-6 md:pb-20 md:pt-10 lg:pt-20 lg:px-10 lg:pb-30 bg-dark-600',
        animationEnded && 'relative overflow-hidden'
      )}
    >
      {/* Background image */}
      <div
        className={cn(
          'fixed inset-0 overflow-hidden z-20',
          animationEnded && 'absolute size-full z-0'
        )}
      >
        <Image
          alt='banner'
          src={animatedCoffeeShop}
          className={cn(
            'object-fill size-full duration-300',
            !animationEnded ? 'homepage-animation' : 'opacity-20'
          )}
          width={1920}
          height={1080}
        />
      </div>

      {/* Main Content */}
      {renderContent && (
        <div className='mx-auto w-full max-w-[960px] flex gap-10 grow z-10 h-[69svh] items-center relative overflow-hidden'>
          <div
            className={cn(
              'flex flex-col gap-2 md:gap-6 items-start z-10 duration-1000 w-full',
              animationEnded
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-full'
            )}
          >
            <h1 className='text-28! md:text-35! lg:text-44! font-bold text-beige-300'>
              Everything <br /> is better with
              <br />
              <span className='flex items-center text-secondary-500 w-fit'>
                Ng
                <CowIcon className='size-10 text-secondary-400' weight='fill' />
                o&nbsp;<span className='text-beige-300'>Coffee</span>
              </span>
            </h1>
            <p className='text-beige-50 text-18!'>
              NgOo Coffee is the missing piece that makes everyday complete, a
              simple yet delicious joy in life
            </p>
            <div className='bg-linear-to-r from-beige-100 to-transparent h-0.25 w-full' />
            <div className='flex gap-2 md:gap-4 text-lg w-fit items-center justify-center'>
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

          <div className='relative w-full min-h-60'>
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
      )}
    </section>
  )
}

export default Hero
