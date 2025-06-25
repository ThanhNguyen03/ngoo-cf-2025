'use client'
import React, { FC, useEffect, useRef } from 'react'

import { cn } from '@/utils'

type TInfiniteCarousel = {
  children: string | React.ReactNode
  length: number
  background?: React.ReactNode
  className?: string
  animation?: 'reversed' | 'leftToRight' | 'rightToLeft'
}

export const InfiniteCarousel: FC<TInfiniteCarousel> = ({
  children,
  length,
  background,
  className,
  animation = 'reversed',
}) => {
  const variantAnimation = {
    reversed: '-animate-return-horizontal-scroll',
    leftToRight: 'animate-infinite-horizontal-scroll',
    rightToLeft: '-animate-infinite-horizontal-scroll',
  }
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const list = container.querySelector('ul')
    if (!list) {
      return
    }

    const rect = list.getBoundingClientRect()
    if (rect.width < container.offsetWidth) {
      container.style.justifyContent = 'center'
    } else {
      const clonedList = list.cloneNode(true) as HTMLUListElement
      list.append(...Array.from(clonedList.children))

      list.classList.add(variantAnimation[animation])
      list.style.willChange = 'transform'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cn(className, !!background && 'relative')}>
      {background}
      <div ref={containerRef} className='flex overflow-hidden'>
        <ul className='flex flex-nowrap items-center'>
          {Array.from({ length: length }).map((_, index) => (
            <div key={`line-${index}`}>{children}</div>
          ))}
        </ul>
      </div>
    </div>
  )
}
