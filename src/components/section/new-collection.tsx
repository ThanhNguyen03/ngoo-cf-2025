'use client'
import { FC, RefObject, useEffect, useState } from 'react'

import { LIST_NEW_PRODUCT } from '@/constants'
import { useParallaxLayer } from '@/hooks/use-parallax-layer'
import {
  cloudCube,
  cloudDoubleCube,
  cloudDoubleRectangle,
  cloudFlat,
} from '@/icons'
import { collectionBanner } from '@/images'
import { ENewProduct, TCollection } from '@/types'
import { cn } from '@/utils'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import { cubicBezier, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

type TPosition = {
  id: ENewProduct
  x: number
  y: number
  r: number
  s?: number
}

const collectionVariants = {
  start: {
    x: 0,
    y: 1,
    rotate: 0,
    scale: 2,
    opacity: 1,
    transition: {
      duration: 1,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  },
  middle: (pos: TPosition) => ({
    x: pos.x,
    y: pos.y,
    rotate: pos.r,
    scale: pos.s,
    transition: {
      duration: 1.5,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  }),
  end: {
    x: 0,
    y: 1,
    rotate: 0,
    scale: 2,
    opacity: 1,
    transition: {
      duration: 2,
      ease: cubicBezier(0.66, -0.3, 0.47, 1.3),
    },
  },
}

type TNewCollectionProps = {
  setSelectedProduct: (item?: TCollection) => void
  selectedProduct?: TCollection
  inCollectionView: boolean
  inSellerView: boolean
  ref: RefObject<HTMLDivElement | null>
}

const NewCollection: FC<TNewCollectionProps> = ({
  setSelectedProduct,
  selectedProduct,
  ref,
  inCollectionView,
  inSellerView,
}) => {
  const [positions, setPositions] = useState<TPosition[]>([])
  const [readyHover, setReadyHover] = useState<boolean>(false)
  const cloudConfigs = [
    { translateRatio: 38 },
    { translateRatio: 36 },
    { translateRatio: 35 },
    { translateRatio: 37 },
  ]

  const [
    doubleCubecloudRef,
    cubeCloudRef,
    doubleRectangleCloudRef,
    flatCloudRef,
  ] = useParallaxLayer<HTMLImageElement>(ref, cloudConfigs)

  const handleSelectItem = (id: ENewProduct) => {
    if (!readyHover) {
      return
    }

    setSelectedProduct(LIST_NEW_PRODUCT.find((p) => p.title === id))
  }

  useEffect(() => {
    const container = ref.current
    if (!container) {
      return
    }

    const getOffset = (id: ENewProduct, r: number, s?: number) => {
      const rectEl = document.getElementById(id)
      if (!rectEl) {
        return { id, x: 0, y: 0, r, s }
      }
      const rect = rectEl.getBoundingClientRect()
      const cont = container.getBoundingClientRect()
      return {
        id,
        x: rect.left - cont.left,
        y: rect.top - cont.top,
        r,
        s,
      }
    }

    requestAnimationFrame(() => {
      setPositions([
        getOffset(ENewProduct.Cherry, -40),
        getOffset(ENewProduct.Kiwi, -20, 1.4),
        getOffset(ENewProduct.Orange, 40, 0.9),
        getOffset(ENewProduct.Strawberry, 60, 0.8),
      ])
    })
  }, [ref])

  return (
    <section
      className='relative z-10 w-full'
      ref={ref}
      style={{
        background: `linear-gradient(180deg, #e0eefa 0%, #0000 100%), url(${collectionBanner.src}) lightgray 50% / cover no-repeat`,
        backgroundBlendMode: 'hard-light, normal',
      }}
    >
      <div
        className={cn(
          'flex size-full flex-col px-2 pt-10 pb-10 duration-1000 md:px-6 md:py-20 lg:px-10 lg:py-30',
          inCollectionView && selectedProduct
            ? selectedProduct.bgClassName
            : 'from-sky-blue-100 bg-linear-to-b to-white/30 to-20%',
        )}
      >
        <div className='relative mx-auto flex w-full max-w-[1024px] flex-col items-center justify-center gap-2 md:gap-6'>
          <h2 className='text-44 md:text-55 font-lobster text-shadow-dark-600 mx-auto w-fit bg-[radial-gradient(ellipse_at_center,hsla(46,100%,61%)_0%,hsl(32,99%,60%)_80%)] bg-clip-text font-black text-transparent drop-shadow-2xl'>
            New Collection
          </h2>
          <div className='relative z-10 mx-auto flex h-[220px] w-full md:h-[320px]'>
            {/* cloud */}
            <Image
              ref={doubleCubecloudRef}
              alt='double-cube-cloud'
              src={cloudDoubleCube}
              width={200}
              height={200}
              className={cn(
                'pointer-events-none absolute -top-20 left-230 size-30 duration-[1400ms]',
                (!inCollectionView || selectedProduct) && '-left-[200dvw]',
              )}
            />
            <Image
              ref={flatCloudRef}
              alt='flat-cloud'
              src={cloudFlat}
              width={200}
              height={151}
              className={cn(
                'pointer-events-none absolute top-70 right-30 h-22 w-30 duration-700',
                (!inCollectionView || selectedProduct) && '-right-[100dvw]',
              )}
            />
            <Image
              ref={doubleRectangleCloudRef}
              alt='double-rectangle-cloud'
              src={cloudDoubleRectangle}
              width={200}
              height={186}
              className={cn(
                'pointer-events-none absolute top-0 right-250 h-28 w-30 duration-1000',
                (!inCollectionView || selectedProduct) && '-right-[200dvw]',
              )}
            />
            <Image
              ref={cubeCloudRef}
              alt='cube-cloud'
              src={cloudCube}
              width={51}
              height={60}
              className={cn(
                'pointer-events-none absolute -top-50 right-200 h-15 w-12 duration-[1200ms]',
                (!inCollectionView || selectedProduct) && '-right-[200dvw]',
              )}
            />
            <div className='flex w-full items-center justify-center gap-2 md:gap-6 lg:gap-10'>
              {positions.length > 0 &&
                positions.map((pos, i) => (
                  <motion.div
                    key={pos.id}
                    custom={pos}
                    initial='start'
                    animate={
                      inCollectionView
                        ? 'end'
                        : inSellerView
                          ? 'middle'
                          : 'start'
                    }
                    variants={collectionVariants}
                    onAnimationStart={() => setReadyHover(false)}
                    onAnimationComplete={() => setReadyHover(true)}
                    className={cn(
                      'size-25 bg-transparent duration-300',
                      inCollectionView &&
                        selectedProduct &&
                        selectedProduct.title === pos.id &&
                        'rounded-2 mx-10 flex cursor-pointer items-end justify-center bg-white/10 shadow-2xl backdrop-blur-2xl hover:size-30',
                    )}
                    onHoverStart={() => handleSelectItem(pos.id)}
                    onHoverEnd={() => setSelectedProduct(undefined)}
                    onClick={() => window.open('/menu', '_self')}
                  >
                    <Image
                      src={LIST_NEW_PRODUCT[i].img}
                      alt={pos.id}
                      width={1024}
                      height={1024}
                      className={cn(
                        'pointer-events-none absolute top-0 left-0 z-30 object-cover drop-shadow-2xl duration-500',
                        inCollectionView &&
                          selectedProduct &&
                          selectedProduct.title === pos.id &&
                          '-translate-y-1/4 scale-70 -rotate-12',
                      )}
                    />

                    <p
                      className={cn(
                        'text-16 mb-6 text-center font-semibold text-nowrap text-white capitalize opacity-0',
                        inCollectionView &&
                          selectedProduct &&
                          selectedProduct.title === pos.id &&
                          'opacity-100',
                      )}
                    >
                      {selectedProduct?.title}
                    </p>
                  </motion.div>
                ))}
            </div>
          </div>
          <div
            className={cn(
              'rounded-3 bg-white/10 p-0.5 opacity-0 backdrop-blur-3xl',
              inCollectionView && 'opacity-100',
            )}
          >
            <Link
              href='/menu'
              className={cn(
                'text-16 flex items-center justify-center gap-2 rounded-[10px] px-4 py-2 font-semibold text-neutral-900 duration-700',
                selectedProduct
                  ? 'bg-[radial-gradient(ellipse_at_center,hsla(46,100%,61%)_0%,hsl(32,99%,60%)_80%)] text-white'
                  : 'bg-linear-to-b from-white to-blue-200 hover:to-blue-300',
              )}
            >
              More detail
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewCollection
