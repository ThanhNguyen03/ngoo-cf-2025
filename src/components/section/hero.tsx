'use client'

import { LOCALSTORAGE_KEY, ONE_MONTH_MS } from '@/constants'
import { animatedCoffeeShop, ngooCfText } from '@/images'
import { cn } from '@/utils'
import { ArrowRightIcon, CowIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Button from '../ui/Button'

type THeroBannerProps = {
  animationEnded: boolean
  setAnimationEnded: Dispatch<SetStateAction<boolean>>
}

const ANIMATION_DURATION = 9700 // 9.7s
const CONTENT_DELAY = 7000 // 7s

const Hero: FC<THeroBannerProps> = ({ animationEnded, setAnimationEnded }) => {
  const [renderContent, setRenderContent] = useState<boolean>(false)

  useEffect(() => {
    const now = Date.now()
    const lastVisit = localStorage.getItem(LOCALSTORAGE_KEY)
    const isFirstVisit = !lastVisit || now - Number(lastVisit) > ONE_MONTH_MS

    const animationTimeOut = setTimeout(
      () => setAnimationEnded(true),
      isFirstVisit ? ANIMATION_DURATION : ANIMATION_DURATION / 10,
    )
    const renderContentTimeOut = setTimeout(
      () => setRenderContent(true),
      isFirstVisit ? CONTENT_DELAY : CONTENT_DELAY / 10,
    )

    return () => {
      clearTimeout(animationTimeOut)
      clearTimeout(renderContentTimeOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        'bg-dark-600 px-2 pt-6 pb-10 md:px-6 md:pt-10 md:pb-20 lg:px-10 lg:pt-20 lg:pb-30',
        animationEnded ? 'relative overflow-hidden' : 'h-[100dvh]',
      )}
    >
      {/* Background image */}
      <div
        className={cn(
          'fixed inset-0 z-20 overflow-hidden',
          animationEnded && 'absolute z-0 size-full',
        )}
      >
        <Image
          alt='banner'
          src={animatedCoffeeShop}
          className={cn(
            'size-full object-fill duration-300',
            !animationEnded ? 'homepage-animation' : 'opacity-20',
          )}
          width={1920}
          height={1080}
          unoptimized
        />
      </div>

      {/* Main Content */}
      {renderContent && (
        <div className='relative z-10 mx-auto flex h-[calc(100dvh-322px)] w-full max-w-[960px] grow items-center gap-10 overflow-hidden'>
          <div
            className={cn(
              'z-10 flex w-full flex-col items-start gap-2 duration-1000 md:gap-6',
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
      )}
    </section>
  )
}

export default Hero
