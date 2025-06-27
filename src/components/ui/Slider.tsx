'use client'
import { useContainerWidth } from '@/hooks'
import { TDirection } from '@/types'
import { cn } from '@/utils'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  Children,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import Button from './Button'

const NEXT_SLIDE_DURATION = 7000
const ANIMATION_DURATION = 600

export type TSliderProps = {
  hiddenButton?: boolean
  className?: string
  numsItemsPerSlice?: number
  step?: number
  isInfinity?: boolean
  isDot?: boolean
}

export const Slider: FC<PropsWithChildren & TSliderProps> = ({
  children,
  className,
  hiddenButton,
  numsItemsPerSlice = 3,
  step = 1,
  isInfinity,
  isDot,
}) => {
  const items = Children.toArray(children)

  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [transition, setTransition] = useState(true)

  const itemRef = useRef<HTMLLIElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const infinityRef = useRef<HTMLDivElement>(null)

  const itemWidth = useContainerWidth(itemRef)
  const containerWidth = useContainerWidth(containerRef)

  const itemGap = isInfinity
    ? 8
    : (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2 < itemWidth
      ? (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2
      : itemWidth
  const numOfDot = isDot
    ? Math.max(1, Math.ceil(items.length / step) - numsItemsPerSlice + 1)
    : undefined

  useEffect(() => {
    if (!isInfinity) {
      return
    }
    const infinity = infinityRef.current
    if (!infinity) {
      return
    }

    const list = infinity.querySelector('ul')
    if (!list) {
      return
    }

    const clonedList = list.cloneNode(true) as HTMLUListElement
    list.append(...Array.from(clonedList.children))
    list.classList.add(
      `translateX(${
        -((activeIndex + 0.5) * itemWidth) - itemGap * 2 * (activeIndex + 0.5)
      }px)`,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide('next')
    }, NEXT_SLIDE_DURATION)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const handleSlide = (dir: TDirection) => {
    const lastItemIndex = items.length - 1 - numsItemsPerSlice

    setTransition(true)
    if (dir === 'next' && activeIndex === lastItemIndex && !isInfinity) {
      console.log('-1')
      setActiveIndex(-1)
    } else if (dir === 'prev' && activeIndex === -1 && !isInfinity) {
      setActiveIndex(lastItemIndex)
    } else {
      setActiveIndex((prev) => (dir === 'prev' ? prev - step : prev + step))
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden', className)}
    >
      <div className='absolute left-0 z-10 h-full w-1/3 bg-gradient-to-r from-white to-transparent to-99%' />
      <div className='absolute right-0 z-10 h-full w-1/3 bg-gradient-to-l from-white to-transparent to-99%' />
      <div
        className='flex h-full w-full items-center justify-center'
        ref={infinityRef}
      >
        <ul
          className={cn(
            'flex flex-nowrap items-center',
            isInfinity && 'justify-center',
          )}
          style={{
            transform: `translateX(${
              -((activeIndex + 0.5) * itemWidth) -
              itemGap * 2 * (activeIndex + 0.5)
            }px)`,
            transition: transition
              ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
              : 'none',
            willChange: 'transform',
          }}
        >
          {items.map((child, i) => (
            <li
              ref={itemRef}
              key={`child-${i}`}
              className='flex w-fit flex-shrink-0'
              style={{
                margin: `0px ${itemGap}px`,
              }}
            >
              {child}
            </li>
          ))}
        </ul>
      </div>
      {!hiddenButton && !isDot && (
        <>
          <div className='absolute top-1/2 left-0 z-20 flex -translate-y-1/2 gap-2'>
            <Button
              aria-label='slide'
              disableAnimation
              className='rounded-2 size-10 duration-300 hover:translate-x-1/4'
              icon={<ArrowLeftIcon size={20} className='text-secondary-500' />}
              onClick={() => handleSlide('prev')}
            />
          </div>
          <div className='absolute top-1/2 right-0 z-20 flex -translate-y-1/2 gap-2'>
            <Button
              aria-label='slide'
              disableAnimation
              className='rounded-2 size-10 duration-300 hover:translate-x-1/4'
              icon={<ArrowRightIcon size={20} className='text-secondary-500' />}
              onClick={() => handleSlide('next')}
            />
          </div>
        </>
      )}
      {isDot && numOfDot && (
        <div className='mt-4 flex items-center justify-center gap-2'>
          <Button
            aria-label='slide'
            disableAnimation
            className='size-4'
            icon={
              <CaretLeftIcon
                size={14}
                className='text-primary-500'
                weight='fill'
              />
            }
            onClick={() => handleSlide('prev')}
          />
          {Array.from({ length: numOfDot }).map((_, idx) => (
            <div
              key={idx}
              className={cn(
                'size-2 cursor-pointer rounded-full',
                idx === activeIndex + 1 ? 'bg-primary-500' : 'bg-gray-300',
              )}
              onClick={() => setActiveIndex(idx - 1)}
            />
          ))}
          <Button
            aria-label='slide'
            disableAnimation
            className='size-4'
            icon={
              <CaretRightIcon
                size={14}
                className='text-primary-500'
                weight='fill'
              />
            }
            onClick={() => handleSlide('next')}
          />
        </div>
      )}
    </div>
  )
}
