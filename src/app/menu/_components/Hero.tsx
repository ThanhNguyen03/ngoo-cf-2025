'use client'

import { LIST_NEW_PRODUCT, NEW_PRODUCT_DATA } from '@/constants'
import { ENewProduct } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { useState } from 'react'
import Bottle3D from './ui/Bottle3D'

const Hero = () => {
  const [selectedProduct, setSelectedProduct] = useState<ENewProduct>(
    ENewProduct.Cherry,
  )

  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 pt-6 pb-10 md:px-6 md:pt-10 md:pb-20 lg:px-10 lg:pt-20 lg:pb-30',
        NEW_PRODUCT_DATA[ENewProduct.Cherry].bgClassName,
      )}
    >
      <div className='mx-auto flex w-full max-w-[1024px] flex-col items-start gap-4 md:gap-6 lg:gap-10'>
        <div className='relative min-h-70 w-full'>
          <Bottle3D
            className='absolute top-0 right-0 z-10'
            glbUrl={NEW_PRODUCT_DATA[selectedProduct].model}
          />
        </div>

        <div className='z-20 flex items-center gap-2'>
          {LIST_NEW_PRODUCT.map((item) => (
            <button
              onClick={() => setSelectedProduct(item.title as ENewProduct)}
              key={item.title}
              className={cn(
                'rounded-2 cursor-pointer border border-white/10 bg-white/10 p-2 shadow backdrop-blur-3xl',
                NEW_PRODUCT_DATA[item.title as ENewProduct].buttonClassName,
                selectedProduct === item.title &&
                  'border-white/30 bg-linear-to-br from-white/50',
              )}
            >
              <Image
                alt={item.title}
                src={item.img}
                width={1024}
                height={1024}
                className='size-15'
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Hero
