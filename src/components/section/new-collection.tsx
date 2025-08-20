'use client'
import { useParallaxLayer } from '@/hooks/use-parallax-layer'
import { useEffect, useRef, useState } from 'react'

import {
  cherryJuiceBottle,
  kiwiJuiceBottole,
  orangeJuiceBottle,
  strawberryJuiceBottle,
} from '@/products'
import { cubicBezier, motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { FenceHead } from '../icons'

type TPosition = { x: number; y: number; r: number; s?: number }

const LIST_PRODUCT_IMG = [
  cherryJuiceBottle,
  kiwiJuiceBottole,
  orangeJuiceBottle,
  strawberryJuiceBottle,
]

const variants = {
  start: {
    x: 0,
    y: -56,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  },
  middle: (pos: TPosition) => ({
    x: pos.x,
    y: pos.y,
    rotate: pos.r,
    scale: pos.s,
    transition: {
      duration: 2,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  }),
  end: {
    x: 0,
    y: -56,
    rotate: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  },
}

const NewCollection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const headFenceRef = useParallaxLayer<SVGSVGElement>(containerRef, {
    translateRatio: -3,
  })
  const isInView = useInView(containerRef, { margin: '-100px' })

  const [positions, setPositions] = useState<TPosition[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const getOffset = (id: string, r: number, s?: number) => {
      const rectEl = document.getElementById(id)
      if (!rectEl) {
        return { x: 0, y: 0, r, s }
      }
      const rect = rectEl.getBoundingClientRect()
      const cont = container.getBoundingClientRect()
      return {
        x: rect.left - cont.left,
        y: rect.top - cont.top,
        r,
        s,
      }
    }

    requestAnimationFrame(() => {
      setPositions([
        getOffset('cherry', -40),
        getOffset('kiwi', -20, 1.2),
        getOffset('orange', 40, 0.7),
        getOffset('strawberry', 60, 0.6),
      ])
    })
  }, [])

  return (
    <section className='h-[1000px] w-full' ref={containerRef}>
      <div className='4k:h-[460px] relative h-[360px] overflow-hidden'>
        <div className='absolute top-0 -left-2 z-0 flex h-fit w-[101dvw] items-center justify-center'>
          <FenceHead
            ref={headFenceRef}
            width={1440}
            height={196}
            fill='#e0eefa'
            className='4k:h-[460px] absolute -top-10 z-20 h-[360px] w-full min-w-[1440px] object-center md:-bottom-24'
          />
        </div>
      </div>
      <div className='z-30 flex size-full'>
        {positions.length > 0 &&
          positions.map((pos, i) => (
            <motion.div
              key={`product-${i}`}
              custom={pos}
              initial='start'
              animate={isInView ? 'end' : 'middle'}
              variants={variants}
              className='size-32'
            >
              <Image
                src={LIST_PRODUCT_IMG[i]}
                alt={`product-${i}`}
                width={1024}
                height={1024}
                className='pointer-events-none absolute top-0 left-0 z-30 object-cover drop-shadow-2xl'
              />
            </motion.div>
          ))}
      </div>
    </section>
  )
}

export default NewCollection
