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
  useCallback,
  useEffect,
  useMemo,
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
  onPause?: boolean
}

export const Slider: FC<PropsWithChildren & TSliderProps> = ({
  children,
  className,
  hiddenButton,
  numsItemsPerSlice = 3,
  step = 1,
  isInfinity = false,
  isDot,
  onPause,
}) => {
  const items = Children.toArray(children)

  // clone items hai đầu nếu isInfinity
  const initialItems = useMemo(() => {
    return isInfinity
      ? [
          ...items.slice(-numsItemsPerSlice),
          ...items,
          ...items.slice(0, numsItemsPerSlice),
        ]
      : items
  }, [items, numsItemsPerSlice, isInfinity])

  const [activeIndex, setActiveIndex] = useState<number>(
    isInfinity ? numsItemsPerSlice : -1,
  )
  const [transition, setTransition] = useState<boolean>(true)

  const itemRef = useRef<HTMLLIElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const itemWidth = useContainerWidth(itemRef)
  const containerWidth = useContainerWidth(containerRef)

  const itemGap = useMemo(() => {
    return isInfinity
      ? 8
      : (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2 < itemWidth
        ? (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2
        : itemWidth
  }, [containerWidth, itemWidth, numsItemsPerSlice, isInfinity])

  const numOfDot = isDot
    ? Math.max(1, Math.ceil(items.length / step) - numsItemsPerSlice + 1)
    : undefined

  const translateX = useMemo(() => {
    return -(activeIndex + 0.5) * itemWidth - itemGap * 2 * (activeIndex + 0.5)
  }, [activeIndex, itemWidth, itemGap])

  const handleSlide = useCallback(
    (dir: TDirection) => {
      setTransition(true)

      setActiveIndex((prev) => {
        const lastItemIndex = items.length - numsItemsPerSlice - 1
        let nextIndex = prev

        if (!isInfinity) {
          if (dir === 'next' && prev >= lastItemIndex) {
            nextIndex = -1
          } else if (dir === 'prev' && prev <= -1) {
            nextIndex = lastItemIndex
          } else {
            nextIndex = dir === 'prev' ? prev - step : prev + step
          }
        } else {
          nextIndex = dir === 'prev' ? prev - step : prev + step
        }

        return nextIndex
      })
    },
    [isInfinity, items.length, numsItemsPerSlice, step],
  )

  // autoplay
  useEffect(() => {
    if (onPause) {
      return
    }
    const interval = setInterval(() => handleSlide('next'), NEXT_SLIDE_DURATION)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPause])

  useEffect(() => {
    if (!isInfinity) {
      return
    }
    if (activeIndex < numsItemsPerSlice) {
      // reset to end
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(items.length)
      }, ANIMATION_DURATION)
    } else if (activeIndex >= items.length + numsItemsPerSlice) {
      // reset to start
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(activeIndex - items.length)
      }, ANIMATION_DURATION)
    } else {
      setTransition(true)
    }
  }, [activeIndex, items.length, isInfinity, numsItemsPerSlice])

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden', className)}
    >
      {/* <div className='absolute left-0 z-10 h-full w-1/4 bg-gradient-to-r from-[inherit] to-transparent to-99%' />
      <div className='absolute right-0 z-10 h-full w-1/4 bg-gradient-to-l from-[inherit] to-transparent to-99%' /> */}
      <div className='flex h-full w-full items-center'>
        <ul
          className={cn(
            'flex flex-nowrap items-center',
            isInfinity && 'justify-center',
          )}
          style={{
            transform: `translateX(${translateX}px)`,
            transition: transition
              ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
              : 'none',
            willChange: 'transform',
          }}
        >
          {initialItems.map((child, i) => (
            <li
              ref={i === 0 ? itemRef : null}
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
                className='text-secondary-500'
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
                idx === activeIndex + 1 ? 'bg-secondary-500' : 'bg-gray-300',
              )}
              onClick={() => setActiveIndex(idx)}
            />
          ))}
          <Button
            aria-label='slide'
            disableAnimation
            className='size-4'
            icon={
              <CaretRightIcon
                size={14}
                className='text-secondary-500'
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
