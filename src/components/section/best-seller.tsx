'use client'

import { ItemCard, SkeletonLoader, Slider } from '@/components/ui'
import { EItemModalDetailStatus, ItemDetailModal } from '@/components/ui/modal'
import { useParallaxLayer } from '@/hooks'
import { TItemResponse } from '@/lib/graphql/generated/graphql'
import { TCartItem } from '@/types'
import { cn } from '@/utils'
import React, { forwardRef, useState } from 'react'
import { FenceCloud } from '../icons'

const ProductPosition = () => {
  return (
    <>
      <div
        id='cherry'
        className='absolute -top-75 right-110 z-50 md:-top-140'
      />
      <div id='kiwi' className='absolute top-40 -left-120 z-50' />
      <div id='orange' className='absolute top-40 left-80 z-50' />
      <div id='strawberry' className='absolute -top-55 left-0 z-50 md:top-3' />
    </>
  )
}

type TBestSellerProps = {
  data: TItemResponse[]
  isInview: boolean
  isLoading?: boolean
}

export const BestSeller = forwardRef<HTMLElement, TBestSellerProps>(
  ({ isInview, data, isLoading }, ref) => {
    const cloudFenceRef = useParallaxLayer<SVGSVGElement>(
      ref as React.RefObject<HTMLElement | null>,
      {
        translateRatio: -3,
      },
    )
    const [selectedItem, setSelectedItem] = useState<TItemResponse>()
    const [cartItem, setCartItem] = useState<TCartItem>()
    const [modalStatus, setModalStatus] = useState<EItemModalDetailStatus>(
      EItemModalDetailStatus.CREATE,
    )

    const handleSelectItem = (
      item: TItemResponse,
      status: EItemModalDetailStatus,
      cartItem?: TCartItem,
    ) => {
      setSelectedItem(item)
      setModalStatus(status)
      setCartItem(cartItem)
    }

    return (
      <section
        id='best-seller'
        className='relative z-0 overflow-hidden'
        ref={ref}
      >
        <ProductPosition />
        <div className='z-30 mb-20 px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:pt-30 lg:pb-50'>
          <div className='center relative mx-auto flex w-full max-w-[1200px] flex-col gap-6'>
            <h2 className='text-44 md:text-55 text-shadow-stroke-2 font-lobster w-fit text-center font-black text-white'>
              Best Seller
            </h2>
            {isLoading ? (
              <SkeletonLoader
                loading={isLoading}
                className='min-h-100 w-full max-w-100'
              />
            ) : (
              <Slider
                numsItemsPerSlice={3}
                dotButton
                isPause={!!selectedItem}
                className='z-10 w-full [--webkit-mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)] [mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)]'
              >
                {data.map((item) => (
                  <ItemCard
                    key={item.itemId}
                    data={item}
                    handleSelectItem={handleSelectItem}
                  />
                ))}
              </Slider>
            )}
          </div>
        </div>
        <div className='absolute bottom-0 -left-2 z-0 flex h-fit w-[101dvw] items-center justify-center'>
          {/* fence */}
          <FenceCloud
            ref={cloudFenceRef}
            width={1440}
            height={196}
            className={cn(
              '4k:-bottom-5 absolute -bottom-20 z-0 h-[360px] w-full min-w-[1440px] object-center select-none md:-bottom-16.5',
              isInview ? 'text-dark-600' : 'text-sky-blue-100',
            )}
          />
        </div>
        {selectedItem && (
          <ItemDetailModal
            isOpen={!!selectedItem}
            onClose={() => setSelectedItem(undefined)}
            data={selectedItem}
            status={modalStatus}
            cartItem={cartItem}
          />
        )}
      </section>
    )
  },
)

BestSeller.displayName = 'BestSeller'
