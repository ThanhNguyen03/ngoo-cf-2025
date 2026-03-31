'use client'

import { notifyBg } from '@/assets/images'
import { Footer } from '@/components/layout/footer'
import {
  BestSeller,
  ContactForWork,
  Hero,
  NewCollection,
  Services,
} from '@/components/section'
import { FenceHead } from '@/components/icons'
import { InfiniteCarousel } from '@/components/ui/InfiniteCarousel'
import {
  EItemStatus,
  ListItemByStatusDocument,
} from '@/lib/graphql/generated/graphql'
import { TCollectionData } from '@/types'
import { useQuery } from '@apollo/client/react'
import { SealPercentIcon } from '@phosphor-icons/react/dist/ssr'
import { useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

export default function Home() {
  const collectionContainerRef = useRef<HTMLDivElement>(null)
  const sellerContainerRef = useRef<HTMLDivElement>(null)

  const [selectedProduct, setSelectedProduct] = useState<TCollectionData>()

  const { data: bestSellerData, loading } = useQuery(
    ListItemByStatusDocument,
    {
      variables: { status: [EItemStatus.Seller] },
    },
  )
  const bestSellerItem = bestSellerData?.listItemByStatus.records ?? []

  const inSellerView = useInView(sellerContainerRef, {
    margin: '-10%',
  })
  const inCollectionView = useInView(collectionContainerRef, {
    margin: '-30%',
  })

  return (
    <>
      <main className='relative flex size-full flex-col overflow-hidden'>
        <Hero />
        <div className='from-beige-100 relative bg-linear-to-b via-white via-70% to-white transition-colors duration-500'>
          {/* NOTE: FenceHead replaces the hard 50/50 geometric split bar that was here.
              The split bar (from-dark-600 to-beige-300) created the sharpest visual seam
              on the page — two flat colors meeting at a straight horizontal line.
              FenceHead is FenceCloud's counterpart: it fills the upper portion of its
              viewbox, painting a wavy dark-600 edge that organically dissolves into the
              beige gradient below. This mirrors the FenceCloud wave already at BestSeller's
              bottom, establishing a consistent "wave = section boundary" grammar.

              z-0: renders behind InfiniteCarousel (z-10) — carousel sits on top of the wave.
              overflow-hidden on the wrapper clips the wide SVG (min-w-[1440px]) to the
              container width, preventing horizontal scroll on narrow viewports.
              Mobile-first heights: h-10 (40px) on mobile, md:h-20 (80px) on tablet+.
              Mobile is shorter because the hero is shorter and less vertical space is needed
              to bridge the gap visually. */}
          <div className='pointer-events-none absolute top-0 left-0 z-0 h-fit w-full overflow-hidden'>
            <FenceHead
              width={1440}
              height={192}
              className='h-10 w-full min-w-[1440px] text-dark-600 select-none md:h-20'
            />
          </div>
          <InfiniteCarousel
            className='from-beige-300 to-beige-50 border-secondary-500/10 absolute -top-10 z-10 w-full -rotate-3 border-y bg-linear-to-b'
            length={7}
            animation='rightToLeft'
            background={
              <Image
                alt='notify-bg'
                src={notifyBg}
                width={2560}
                height={1440}
                className='absolute inset-0 z-0 size-full object-cover object-[85%_50%]'
              />
            }
          >
            <div className='mx-4 flex w-[340px] items-center justify-center gap-2 py-6 text-neutral-900'>
              <SealPercentIcon size={24} weight='fill' />
              <p className='text-14 select-none'>
                Use{' '}
                <span className='font-bold text-blue-600/70'>
                  Payment by Token{' '}
                </span>
                to get{' '}
                <span className='font-bold text-green-600/70'>
                  sale off 20%
                </span>
              </p>
            </div>
          </InfiniteCarousel>
          <BestSeller
            ref={sellerContainerRef}
            isLoading={loading || !bestSellerData}
            data={bestSellerItem}
            isInview={inSellerView && !!selectedProduct}
          />
        </div>
        <NewCollection
          ref={collectionContainerRef}
          inCollectionView={inCollectionView}
          inSellerView={inSellerView}
          setSelectedProduct={setSelectedProduct}
          selectedProduct={selectedProduct}
        />
        <Services isHover={!!selectedProduct} />
        <ContactForWork />
      </main>
      <Footer />
    </>
  )
}
