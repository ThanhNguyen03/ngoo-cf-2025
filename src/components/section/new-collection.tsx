'use client'
import { useParallaxLayer } from '@/hooks/use-parallax-layer'
import { useRef } from 'react'
import { FenceHead } from '../icons'

const NewCollection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const headFenceRef = useParallaxLayer<SVGSVGElement>(containerRef, {
    translateRatio: -3,
  })

  return (
    <section
      className='relative h-[1000px] w-full overflow-hidden'
      ref={containerRef}
    >
      <div className='absolute top-0 -left-2 flex h-fit w-[101dvw] items-center justify-center'>
        {/* fence */}
        <FenceHead
          ref={headFenceRef}
          width={1440}
          height={196}
          fill='#e0eefa'
          className='4k:h-[460px] absolute -top-10 z-20 h-[360px] w-full min-w-[1440px] object-center md:-bottom-24'
        />
      </div>
    </section>
  )
}

export default NewCollection
