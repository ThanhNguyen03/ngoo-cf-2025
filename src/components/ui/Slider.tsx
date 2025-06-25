'use client'
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react'

import { TDirection } from '@/types'
import { cn } from '@/utils'
import Button from './Button'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'

const NEXT_SLIDE_DURATION = 3000
const ANIMATION_DURATION = 1000

export type TSliderProps = {
  hiddenButton?: boolean
  className?: string
  numsItemsPerSlice?: number
  step?: number
}

export const Slider: FC<PropsWithChildren & TSliderProps> = ({
  children,
  className,
  hiddenButton,
  numsItemsPerSlice = 3,
  step = 1,
}) => {
  const items = Array.isArray(children) ? children : [children]
  const total = items.length
  const [activeIndex, setActiveIndex] = useState(numsItemsPerSlice)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [transition, setTransition] = useState(true)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const extendedItems = [
    ...items.slice(-numsItemsPerSlice),
    ...items,
    ...items.slice(0, numsItemsPerSlice),
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide('next')
    }, NEXT_SLIDE_DURATION)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  useEffect(() => {
    if (!isAnimating) {
      return
    }
    if (activeIndex === total + numsItemsPerSlice) {
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(numsItemsPerSlice)
      }, ANIMATION_DURATION)
      setTimeout(() => setTransition(true), ANIMATION_DURATION + 20)
    }
    if (activeIndex === 0) {
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(total)
      }, ANIMATION_DURATION)
      setTimeout(() => setTransition(true), ANIMATION_DURATION + 20)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, isAnimating])

  const handleSlide = (dir: TDirection) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false)
      setActiveIndex((prev) => {
        if (dir === 'prev') {
          console.log('first')
          return prev - step
        } else {
          return prev + step
        }
      })
    }, ANIMATION_DURATION)
  }

  return (
    <div className={cn('relative overflow-hidden w-full', className)}>
      <div className='w-full h-full'>
        <ul
          className='flex flex-nowrap items-center'
          style={{
            transform: `translateX(-${
              (activeIndex * 100) / numsItemsPerSlice
            }%)`,
            transition: transition
              ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
              : 'none',
            willChange: 'transform',
          }}
        >
          {extendedItems.map((child, i) => (
            <li
              key={`child-${i}`}
              className='flex-shrink-0'
              style={{ width: `${100 / numsItemsPerSlice}%` }}
            >
              {child}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={cn(
          'absolute bottom-6 left-6 flex gap-2',
          hiddenButton && 'hidden'
        )}
      >
        <Button
          aria-label='slide'
          className={cn('size-2 rounded-1 bg-beige-50')}
          icon={<ArrowRightIcon size={20} />}
          onClick={() => handleSlide('next')}
          disableAnimation
        />
        <Button
          aria-label='slide'
          className={cn('size-2 rounded-1 bg-beige-50')}
          icon={<ArrowLeftIcon size={20} />}
          onClick={() => handleSlide('prev')}
          disableAnimation
        />
      </div>
    </div>
  )
}
