'use client'

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
  useMemo,
  useRef,
  useState,
} from 'react'
import { Button } from './Button'

const ANIMATION_DURATION = 600
const AUTO_SLIDE_MS = 4500
const gap = 12

export type TSliderProps = {
  className?: string
  numsItemsPerSlice?: number
  step?: number
  isPause?: boolean
  dotButton?: boolean
  isInfinity?: boolean
  hiddenButton?: boolean
}

export const Slider: FC<PropsWithChildren & TSliderProps> = ({
  children,
  className,
  numsItemsPerSlice = 3,
  step = 1,
  isPause,
  dotButton,
  isInfinity = true,
  hiddenButton = false,
}) => {
  const items = Children.toArray(children)

  // RESPONSIVE VISIBLE COUNT
  const [visibleCount, setVisibleCount] = useState<number>(numsItemsPerSlice)

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth

      if (w < 768) {
        // 425px - 768px => ALWAYS 1 item + 0.5 + 0.5 side preview
        setVisibleCount(1)
      } else if (w < 1024) {
        // tablet => ALWAYS 3
        setVisibleCount(3)
      } else {
        setVisibleCount(numsItemsPerSlice)
      }
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [numsItemsPerSlice])

  // INFINITE CLONES
  const initialItems = useMemo(() => {
    if (!isInfinity) {
      return items
    }
    return [
      ...items.slice(-visibleCount),
      ...items,
      ...items.slice(0, visibleCount),
    ]
  }, [items, visibleCount, isInfinity])

  const initialIndex = isInfinity ? visibleCount : 0
  const [activeIndex, setActiveIndex] = useState<number>(initialIndex)
  const [transition, setTransition] = useState<boolean>(true)

  // WIDTH CALC
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRef = useRef<HTMLLIElement>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const [itemWidth, setItemWidth] = useState<number>(0)

  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const resize = () => {
      setContainerWidth(containerRef.current!.offsetWidth)
      if (itemRef.current) {
        setItemWidth(itemRef.current.offsetWidth)
      }
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // TRANSLATE CALC
  const translateX = useMemo(() => {
    if (!itemWidth || !containerWidth) {
      return 0
    }

    const total = itemWidth + gap * 2

    // mobile 1-item half preview hack
    if (visibleCount === 1) {
      const visibleWidth = itemWidth
      const offset = containerWidth / 2 - visibleWidth / 2 - activeIndex * total
      return offset
    }

    return containerWidth / 2 - activeIndex * total - itemWidth / 2
  }, [activeIndex, itemWidth, containerWidth, visibleCount])

  // SLIDE HANDLER
  const slide = (dir: 'next' | 'prev') => {
    setTransition(true)
    setActiveIndex((prev) => prev + (dir === 'next' ? step : -step))
  }

  // AUTO SLIDE
  useEffect(() => {
    if (isPause) {
      return
    }
    const timer = setInterval(() => {
      slide('next')
    }, AUTO_SLIDE_MS)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, isPause])

  // LOOP RESET
  useEffect(() => {
    if (!isInfinity) {
      return
    }

    if (activeIndex < visibleCount) {
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(activeIndex + items.length)
      }, ANIMATION_DURATION)
    } else if (activeIndex >= items.length + visibleCount) {
      setTimeout(() => {
        setTransition(false)
        setActiveIndex(activeIndex - items.length)
      }, ANIMATION_DURATION)
    }
  }, [activeIndex, visibleCount, items.length, isInfinity])

  // DOT BUTTONS (ORIGINAL UI PRESERVED)
  const totalReal = items.length
  const realIndex =
    (((activeIndex - visibleCount) % totalReal) + totalReal) % totalReal

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden pb-10', className)}
    >
      <ul
        className='flex flex-nowrap items-center'
        style={{
          transform: `translateX(${translateX}px)`,
          transition: transition
            ? `transform ${ANIMATION_DURATION}ms cubic-bezier(0.22,0.61,0.36,1)`
            : 'none',
        }}
      >
        {initialItems.map((child, i) => (
          <li
            key={i}
            ref={i === visibleCount ? itemRef : undefined}
            className='flex-shrink-0'
            style={{ margin: `0 ${gap}px` }}
          >
            {child}
          </li>
        ))}
      </ul>

      {!hiddenButton && !dotButton && (
        <>
          <button
            aria-label='prev'
            onClick={() => slide('prev')}
            className='absolute top-1/2 left-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow'
          >
            <ArrowLeftIcon size={20} />
          </button>
          <button
            aria-label='next'
            onClick={() => slide('next')}
            className='absolute top-1/2 right-0 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow'
          >
            <ArrowRightIcon size={20} />
          </button>
        </>
      )}

      {/* --- DOT BUTTON UI --- */}
      {dotButton && items.length > 0 && (
        <div className='center absolute bottom-0 left-1/2 z-20 -translate-x-1/2 gap-2'>
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
            onClick={() => slide('prev')}
          />
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i + visibleCount)}
              className={cn(
                'size-2 rounded-full transition-all',
                realIndex === i ? 'scale-110 bg-black' : 'bg-zinc-300',
              )}
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
            onClick={() => slide('next')}
          />
        </div>
      )}
    </div>
  )
}
