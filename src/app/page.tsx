'use client'

import { notifyBg } from '@/assets/images'
import {
  BestSeller,
  ContactForWork,
  Hero,
  NewCollection,
  Services,
} from '@/components/section'
import { InfiniteCarousel } from '@/components/ui/InfiniteCarousel'
import { client } from '@/lib/apollo-client'
import {
  EItemStatus,
  ListItemByStatusDocument,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import { TCollectionData } from '@/types'
import { apolloWrapper } from '@/utils'
import { SealPercentIcon } from '@phosphor-icons/react/dist/ssr'
import { useInView } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const collectionContainerRef = useRef<HTMLDivElement>(null)
  const sellerContainerRef = useRef<HTMLDivElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<TCollectionData>()
  const [bestSellerItem, setBestSellerItem] = useState<TItemResponse[]>([])

  const inSellerView = useInView(sellerContainerRef, {
    margin: '-10%',
  })
  const inCollectionView = useInView(collectionContainerRef, {
    margin: '-30%',
  })

  useEffect(() => {
    const getBestSeller = apolloWrapper(async () => {
      const { data, error } = await client.query({
        query: ListItemByStatusDocument,
        variables: {
          status: [EItemStatus.Seller],
        },
      })

      if (error) {
        throw error
      }

      if (data) {
        setBestSellerItem(data.listItemByStatus.records)
      }
    })

    getBestSeller()
  }, [])

  return (
    <main className='relative flex size-full flex-col overflow-hidden'>
      <Hero />
      <div className='from-beige-100 relative bg-linear-to-b via-white via-70% to-white transition-colors duration-500'>
        <div className='from-dark-600 to-beige-300 h-10 bg-linear-to-r from-50% to-50%' />
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
              <span className='font-bold text-green-600/70'>sale off 20%</span>
            </p>
          </div>
        </InfiniteCarousel>
        <BestSeller
          ref={sellerContainerRef}
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
  )
}
