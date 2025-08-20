'use client'

import { liptonTea } from '@/products'
import { TItem } from '@/types'
import { useState } from 'react'
import ItemCard from '../ui/ItemCard'
import { Slider } from '../ui/Slider'
import ItemDetailModal from '../ui/modal/ItemDetailModal'

const MOCKED_ITEMS_DATA: TItem[] = [
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    amountDiscount: 10,
  },
  {
    image: liptonTea,
    title: 'Olong Milk Tea',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    additionalOption: [
      {
        title: 'topping',
        listOption: [
          { name: 'Black Bubbles', extraPrice: 0.5 },
          { name: 'White Bubbles', extraPrice: 0.5 },
          { name: 'Olong Tea Bubbles', extraPrice: 0.7 },
          { name: 'Flan Cake', extraPrice: 0.7 },
        ],
      },
    ],
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    amountDiscount: 10,
  },
  {
    image: liptonTea,
    title: 'XaiGon Coffee',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    amountDiscount: 8,
    additionalOption: [
      {
        title: 'extra',
        listOption: [{ name: '+1 Coffee Shot', extraPrice: 0.5 }],
      },
    ],
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    amountDiscount: 5,
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
  },
  {
    image: liptonTea,
    title: 'Lipton Xi Muoi',
    price: 12,
    description: 'The richest flavor with long-standing family recipe',
    amountDiscount: 9,
  },
]

const ProductPosition = () => {
  return (
    <>
      <div id='cherry' className='absolute -top-95 right-20 z-50' />
      <div id='kiwi' className='absolute top-30 -left-30 z-50' />
      <div id='orange' className='absolute top-15 right-100 z-50' />
      <div id='strawberry' className='absolute -top-100 left-0 z-50' />
    </>
  )
}

const BestSeller = () => {
  const [selectedItem, setSelectedItem] = useState<TItem | undefined>()

  return (
    <section id='best-seller' className='relative overflow-hidden'>
      <ProductPosition />
      <div className='z-0 mb-20 px-2 pt-6 pb-10 md:px-6 md:pb-20 lg:px-10 lg:pt-10 lg:pb-30'>
        <div className='relative mx-auto flex w-full max-w-[1024px] flex-col gap-2 md:gap-6'>
          <h2 className='text-44 md:text-55 font-lobster mx-auto w-fit bg-[url(/images/title-background.jpg)] bg-clip-text text-center font-black text-transparent'>
            Best Seller
          </h2>

          <Slider
            numsItemsPerSlice={3}
            isDot
            onPause={!!selectedItem}
            className='[--webkit-mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)] [mask:linear-gradient(to_right,#0000,#000_20%,#000_80%,#0000)]'
          >
            {MOCKED_ITEMS_DATA.map((item, i) => (
              <ItemCard
                key={`${item.title}-${i}`}
                data={item}
                setSelectedItem={setSelectedItem}
              />
            ))}
          </Slider>
        </div>
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
}

export default BestSeller
