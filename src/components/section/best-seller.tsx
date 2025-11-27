'use client'

import titleBackground from '@/assets/images/title-background.jpg'
import { liptonTea } from '@/assets/products'
import { ItemCard, Slider } from '@/components/ui'
import { ItemDetailModal } from '@/components/ui/modal'
import { useParallaxLayer } from '@/hooks'
import useCartStore from '@/store/cart-store'
import { TItem } from '@/types'
import { cn } from '@/utils'
import { forwardRef, useMemo, useState } from 'react'
import { FenceCloud } from '../icons'

const MOCKED_ITEMS_DATA: TItem[] = [
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 1',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 2',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    discountPercent: 10,
  },
  {
    image: liptonTea,
    title: 'Olong Milk Tea',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    additionalOption: [
      {
        group: 'topping',
        name: 'Black Bubbles',
        extraPrice: 0.5,
      },
      {
        group: 'topping',
        name: 'White Bubbles',
        extraPrice: 0.5,
      },
      {
        group: 'topping',
        name: 'Olong Tea Bubbles',
        extraPrice: 0.7,
      },
      {
        group: 'topping',
        name: 'Flan Cake',
        extraPrice: 0.7,
      },
    ],
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 3',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    discountPercent: 10,
  },
  {
    image: liptonTea,
    title: 'XaiGon Coffee',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    discountPercent: 8,
    additionalOption: [
      {
        group: 'extra',
        name: '+1 Coffee Shot',
        extraPrice: 0.5,
      },
    ],
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 4',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 5',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 6',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    discountPercent: 5,
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 7',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi 8',
    price: 12,
    amount: 0,
    description: 'The richest flavor with long-standing family recipe',
    discountPercent: 9,
  },
]

const ProductPosition = () => {
  return (
    <>
      <div id='cherry' className='absolute -top-75 right-110 z-50' />
      <div id='kiwi' className='absolute top-40 -left-120 z-50' />
      <div id='orange' className='absolute top-40 left-80 z-50' />
      <div id='strawberry' className='absolute -top-55 left-0 z-50' />
    </>
  )
}

type TBestSellerProps = {
  isInview: boolean
}

export const BestSeller = forwardRef<HTMLElement, TBestSellerProps>(
  ({ isInview }, ref) => {
    const cloudFenceRef = useParallaxLayer<SVGSVGElement>(
      ref as React.RefObject<HTMLElement | null>,
      {
        translateRatio: -3,
      },
    )
    const { listCartItem } = useCartStore()
    const [selectedItem, setSelectedItem] = useState<TItem>()

    const displayedItems = useMemo(() => {
      return MOCKED_ITEMS_DATA.map((mock) => {
        const amount =
          listCartItem.find((item) => item.title === mock.title)?.amount || 0
        return { ...mock, amount } as TItem
      })
    }, [listCartItem])

    return (
      <section
        id='best-seller'
        className='relative z-0 overflow-hidden'
        ref={ref}
      >
        <ProductPosition />
        <div className='z-30 mb-20 px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:pt-30 lg:pb-50'>
          <div className='relative mx-auto flex w-full max-w-[1200px] flex-col gap-2 md:gap-6'>
            <h2
              style={{ backgroundImage: `url(${titleBackground.src})` }}
              className='text-44 md:text-55 font-lobster mx-auto w-fit bg-clip-text text-center font-black text-transparent'
            >
              Best Seller
            </h2>

            <Slider
              numsItemsPerSlice={3}
              isDot
              onPause={!!selectedItem}
              className='z-10 [--webkit-mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)] [mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)]'
            >
              {displayedItems.map((item, i) => (
                <ItemCard
                  key={`${item.title}-${i}`}
                  data={item}
                  setSelectedItem={setSelectedItem}
                />
              ))}
            </Slider>
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
          />
        )}
      </section>
    )
  },
)

BestSeller.displayName = 'BestSeller'
