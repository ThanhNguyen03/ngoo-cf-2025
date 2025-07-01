'use client'

import { iceCube, leaf } from '@/images'
import { liptonTea } from '@/products'
import { TItem } from '@/types'
import Image from 'next/image'
import ItemCard from '../ui/ItemCard'
import { Slider } from '../ui/Slider'
import ItemDetailModal from '../ui/modal/ItemDetailModal'
import { useState } from 'react'

const MOCKED_ITEMS_DATA: TItem[] = [
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12, amountDiscount: 10 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12, amountDiscount: 10 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12, amountDiscount: 8 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12, amountDiscount: 5 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12 },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: 12, amountDiscount: 9 },
]

const BestSeller = () => {
  const [selectedItem, setSelectedItem] = useState<TItem | undefined>()

  return (
    <section className='relative overflow-hidden bg-beige-100/10'>
      <div className='absolute z-20 bottom-0 -left-2'>
        <Image
          alt='ice-cube'
          src={iceCube}
          width={474}
          height={448}
          className='size-50 object-cover'
        />
      </div>
      <div className='absolute z-20 top-0 -right-2'>
        <Image
          alt='leaf'
          src={leaf}
          width={740}
          height={740}
          className='size-70 object-cover'
        />
      </div>
      <div className='px-2 pt-6 pb-10 md:px-6 md:pt-10 md:pb-20 lg:px-10 lg:pt-20 lg:pb-30 z-0'>
        <div className='relative mx-auto flex w-full max-w-[1024px] flex-col gap-2 md:gap-6'>
          <h2 className='text-44 md:text-55 font-lobster mx-auto w-fit bg-[url(/images/title-background.jpg)] bg-clip-text text-center font-black text-transparent'>
            Best Seller
          </h2>

          <Slider numsItemsPerSlice={3} isDot onPause={!!selectedItem}>
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
