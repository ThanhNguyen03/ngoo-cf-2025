'use client'
import { liptonTea } from '@/products'
import { TItemCardProps } from '@/types'
import React from 'react'
import { Slider } from '../ui/Slider'
import ItemCard from '../ui/ItemCard'

const MOCKED_ITEMS_DATA: TItemCardProps[] = [
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$', salePrice: '10$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$', salePrice: '10$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$', salePrice: '8$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$', salePrice: '5$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$' },
  { image: liptonTea, title: 'Lipton Xi Muoi', price: '12$', salePrice: '9$' },
]

const BestSeller = () => {
  return (
    <section className='flex flex-col gap-2 md:gap-6 lg:gap-10'>
      <h2 className='text-28 md:text-25 lg:text-44 font-semibold text-secondary-400 text-center'>
        Best Seller
      </h2>
      <Slider>
        {MOCKED_ITEMS_DATA.map((item) => (
          <ItemCard
            key={item.title}
            image={item.image}
            title={item.title}
            price={item.price}
            salePrice={item.salePrice}
          />
        ))}
      </Slider>
    </section>
  )
}

export default BestSeller
