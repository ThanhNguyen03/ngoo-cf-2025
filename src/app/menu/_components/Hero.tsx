'use client'

import { LIST_NEW_PRODUCT, NEW_PRODUCT_DATA } from '@/constants'
import { ENewProduct } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Bottle3D from './ui/Bottle3D'

const ANIMATION_DURATION = 700 // 700ms

const Hero = () => {
  const [selectedProduct, setSelectedProduct] = useState<ENewProduct>(
    ENewProduct.Cherry,
  )
  const [animation, setAnimation] = useState<boolean>(false)

  const handleSelectItem = (id: ENewProduct) => {
    setAnimation(false)
    const animationTimeOut = setTimeout(() => {
      setAnimation(true)
      setSelectedProduct(id)
    }, ANIMATION_DURATION)

    return () => {
      clearTimeout(animationTimeOut)
    }
  }

  useEffect(() => {
    const animationTimeOut = setTimeout(
      () => setAnimation(true),
      ANIMATION_DURATION,
    )

    return () => {
      clearTimeout(animationTimeOut)
    }
  }, [])

  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-40',
        NEW_PRODUCT_DATA[selectedProduct].bgClassName,
      )}
    >
      <div className='mx-auto flex h-[calc(100dvh-372px)] w-full max-w-[1024px] justify-center gap-4'>
        <div className='flex h-full w-[30%] flex-col items-start justify-between gap-4 md:gap-6 lg:gap-10'>
          <h2
            className={cn(
              'text-23 md:text-32 font-lobster bg-clip-text leading-[120%] font-black text-transparent capitalize',
              NEW_PRODUCT_DATA[selectedProduct].titleClassName,
            )}
          >
            {selectedProduct} Juice
          </h2>
          <div className='flex flex-col items-start gap-2 md:gap-4'>
            <p className='text-14 leading-[160%] text-white'>
              {NEW_PRODUCT_DATA[selectedProduct].description}
            </p>
            <div className='z-20 flex items-center gap-2 md:gap-3'>
              {LIST_NEW_PRODUCT.map((item) => (
                <button
                  onClick={() => handleSelectItem(item.title as ENewProduct)}
                  key={item.title}
                  className={cn(
                    'rounded-2 cursor-pointer border border-white/10 bg-white/10 p-1 shadow backdrop-blur-3xl',
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
                    className='size-12'
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className='relative flex h-full min-h-70 w-[40%] items-center justify-center'>
          <Bottle3D
            isRotate={animation}
            className={cn(
              'absolute z-10',
              animation
                ? 'animate-translate-vertical-in'
                : 'animate-translate-vertical-out',
            )}
            glbUrl={NEW_PRODUCT_DATA[selectedProduct].model}
          />
        </div>
        <div className='flex h-full w-[30%] flex-col items-start justify-between'>
          <h3 className='font-lobster text-18 text-beige-50 font-medium'>
            {NEW_PRODUCT_DATA[selectedProduct].tag}
          </h3>
        </div>
      </div>
    </section>
  )
}

export default Hero
