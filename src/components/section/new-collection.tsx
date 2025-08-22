'use client'
import { FC, RefObject, useEffect, useState } from 'react'

import { useParallaxLayer } from '@/hooks/use-parallax-layer'
import {
  cloudCube,
  cloudDoubleCube,
  cloudDoubleRectangle,
  cloudFlat,
} from '@/icons'
import { collectionBanner } from '@/images'
import {
  cherryJuiceBottle,
  kiwiJuiceBottole,
  orangeJuiceBottle,
  strawberryJuiceBottle,
} from '@/products'
import { ENewProduct, TNewCollection } from '@/types'
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

const LIST_PRODUCT_IMG: TNewCollection[] = [
  {
    title: ENewProduct.Cherry,
    img: cherryJuiceBottle,
    tag: 'Sweet, fresh, and a sip of happiness.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(335,75%,30%)_0%,hsla(345,7%,10%,1)_70%)]',
    description:
      'Our Cherry Juice shines with a vibrant ruby-red color and a naturally sweet-tart taste from fresh cherries. Packed with antioxidants, it not only refreshes but also supports glowing skin and heart health. A perfect balance of sweetness and lightness in every sip.',
  },
  {
    title: ENewProduct.Kiwi,
    img: kiwiJuiceBottole,
    tag: 'Tangy, refreshing, and naturally energizing.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,41%)_0%,hsla(345,7%,10%,1)_70%)]',
    description:
      'Kiwi Juice delivers a refreshing surprise with its tangy-sweet balance and distinctive fragrance of fresh kiwi. Rich in vitamin C and fiber, it boosts your energy while keeping you light, fresh, and healthy throughout the day.',
  },
  {
    title: ENewProduct.Orange,
    img: orangeJuiceBottle,
    tag: 'One glass of orange, one brighter day.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,52%)_0%,hsla(345,7%,10%,1)_70%)]',
    description:
      'Nothing beats the freshness of pure Orange Juice. With its sweet, zesty flavor and vitamin C richness, it strengthens immunity, brightens your mood, and fuels your day with vitality. A timeless classic that never goes out of style.',
  },
  {
    title: ENewProduct.Strawberry,
    img: strawberryJuiceBottle,
    tag: 'Naturally sweet, love at first sip.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,42%)_0%,hsla(345,7%,10%,1)_70%)]',
    description:
      'Strawberry Juice bursts with the sweet, refreshing taste of ripe strawberries. Each sip delivers freshness and a natural energy boost. More than just a drink, it’s a delightful treat for your senses that you’ll fall in love with instantly.',
  },
]

type TNewCollectionProps = {
  setSelectedProduct: (item?: TNewCollection) => void
  selectedProduct?: TNewCollection
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

    setSelectedProduct(LIST_PRODUCT_IMG.find((p) => p.title === id))
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
                      src={LIST_PRODUCT_IMG[i].img}
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
              className='text-16 flex items-center justify-center gap-2 rounded-[10px] bg-linear-to-b from-white to-blue-200 px-4 py-2 font-semibold text-neutral-900 duration-1000 hover:to-blue-300'
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
