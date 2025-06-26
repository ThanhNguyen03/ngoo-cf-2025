'use client'
import {
  Children,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { cn } from '@/utils'
import Button from './Button'
import { ArrowLeftIcon, ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { useContainerWidth } from '@/hooks'

const NEXT_SLIDE_DURATION = 7000
const ANIMATION_DURATION = 600

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
  const items = Children.toArray(children)

  const [activeIndex, setActiveIndex] = useState<number>(numsItemsPerSlice)
  const [transition, setTransition] = useState(true)
  const itemRef = useRef<HTMLLIElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const itemWidth = useContainerWidth(itemRef)
  const containerWidth = useContainerWidth(containerRef)

  const itemGap =
    (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2 < itemWidth
      ? (containerWidth / (numsItemsPerSlice + 1) - itemWidth) / 2
      : itemWidth

  useEffect(() => {
    const interval = setInterval(() => {
      handleSlide('next')
    }, NEXT_SLIDE_DURATION)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  const handleSlide = (dir: 'next' | 'prev') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (dir === 'next' && activeIndex === items.length - numsItemsPerSlice) {
      setActiveIndex(0)
    } else if (dir === 'prev' && activeIndex === 0) {
      setActiveIndex(items.length - 1)
    }

    setTransition(true)
    setActiveIndex((prev) => (dir === 'prev' ? prev - step : prev + step))
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden w-full', className)}
    >
      <div className='w-full h-full flex items-center justify-center'>
        <ul
          className='flex flex-nowrap items-center'
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
              className='flex flex-shrink-0 w-fit'
              style={{
                margin: `0px ${itemGap}px`,
              }}
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
        />
        <Button
          aria-label='slide'
          className={cn('size-2 rounded-1 bg-beige-50')}
          icon={<ArrowLeftIcon size={20} />}
          onClick={() => handleSlide('prev')}
        />
      </div>
    </div>
  )
}
