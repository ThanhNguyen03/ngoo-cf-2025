'use client'
import { iceCube, leaf } from '@/images'
import { liptonTea } from '@/products'
import { TItemCardProps } from '@/types'
import Image from 'next/image'
import ItemCard from '../ui/ItemCard'
import { Slider } from '../ui/Slider'

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
    <section className='relative overflow-hidden bg-beige-100/10'>
      <div className='absolute bottom-0 -left-2'>
        <Image
          alt='ice-cube'
          src={iceCube}
          width={474}
          height={448}
          className='size-50 object-cover'
        />
      </div>
      <div className='absolute top-0 -right-2'>
        <Image
          alt='leaf'
          src={leaf}
          width={740}
          height={740}
          className='size-70 object-cover'
        />
      </div>
      <div className='px-2 pt-6 pb-10 md:px-6 md:pt-10 md:pb-20 lg:px-10 lg:pt-20 lg:pb-30'>
        <div className='relative mx-auto flex w-full max-w-[1024px] flex-col gap-2 md:gap-6'>
          <h2 className='text-44 md:text-55 font-lobster mx-auto w-fit bg-[url(/images/title-background.jpg)] bg-clip-text text-center font-black text-transparent'>
            Best Seller
          </h2>

          <Slider numsItemsPerSlice={3} isDot>
            {MOCKED_ITEMS_DATA.map((item, i) => (
              <ItemCard
                key={`${item.title}-${i}`}
                image={item.image}
                title={item.title}
                price={item.price}
                salePrice={item.salePrice}
              />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
