'use client'

import AmountCounter from '@/components/ui/AmountCounter'
import Button from '@/components/ui/Button'
import { LIST_NEW_PRODUCT, NEW_PRODUCT_DATA, SIZE_OPTION } from '@/constants'
import useCartStore, { calculateItemPrice } from '@/store/cart-store'
import { ENewProduct, TItem } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Bottle3D from './ui/Bottle3D'

const ANIMATION_DURATION = 700 // ms

const Hero = () => {
  const { addToCart, removeFromCart, updateCartItem, listCartItem } =
    useCartStore()
  const [selectedProduct, setSelectedProduct] = useState<ENewProduct>(
    ENewProduct.Cherry,
  )
  const [animation, setAnimation] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [itemAmount, setItemAmount] = useState<number>(1)
  const [selectedSize, setSelectedSize] = useState<string>(
    NEW_PRODUCT_DATA[selectedProduct].additionalOption?.[0].name || '',
  )

  const handleSelectItem = (id: ENewProduct) => {
    setAnimation(false)
    setItemAmount(1)
    const timeout = setTimeout(() => {
      setSelectedProduct(id)
      setAnimation(true)
    }, ANIMATION_DURATION)

    return () => clearTimeout(timeout)
  }

  const handleSubmit = () => {
    if (itemAmount === 0) {
      removeFromCart(NEW_PRODUCT_DATA[selectedProduct].title)
      return
    }
    const data = {
      image: NEW_PRODUCT_DATA[selectedProduct].image,
      title: NEW_PRODUCT_DATA[selectedProduct].title,
      price: NEW_PRODUCT_DATA[selectedProduct].price,
      discountPercent: NEW_PRODUCT_DATA[selectedProduct].discountPercent,
    }
    const newItem: TItem = {
      ...data,
      amount: itemAmount,
      additionalOption: SIZE_OPTION.filter((opt) => opt.name === selectedSize),
    }
    const existed = listCartItem.some(
      (i) => i.title === NEW_PRODUCT_DATA[selectedProduct].title,
    )
    if (existed) {
      updateCartItem(newItem)
    } else {
      addToCart(newItem)
    }
  }

  useEffect(() => {
    setAnimation(false)
    const timeout = setTimeout(() => setAnimation(true), ANIMATION_DURATION)
    return () => clearTimeout(timeout)
  }, [selectedSize])

  useEffect(() => {
    setTotalPrice(
      calculateItemPrice(
        NEW_PRODUCT_DATA[selectedProduct],
        SIZE_OPTION.filter((opt) => opt.name === selectedSize),
        itemAmount,
      ),
    )
  }, [itemAmount, selectedProduct, selectedSize])

  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30',
        NEW_PRODUCT_DATA[selectedProduct].bgClassName,
      )}
    >
      <div className='mx-auto flex h-[calc(100dvh-322px)] w-full max-w-[1024px] justify-center gap-4'>
        {/* Left column */}
        <div className='mt-8 flex h-full w-[30%] flex-col items-start justify-between gap-4 md:gap-6 lg:gap-10'>
          <div className='flex flex-col items-start gap-2'>
            <h2
              className={cn(
                'text-28 md:text-32 font-lobster bg-clip-text leading-[120%] font-black text-transparent capitalize duration-500',
                NEW_PRODUCT_DATA[selectedProduct].titleClassName,
                animation ? 'opacity-100' : 'opacity-0',
              )}
            >
              {selectedProduct} Juice
            </h2>
            <p className='text-14 leading-[160%] text-white'>
              {selectedSize === 'M' ? '350ml' : '500ml'}
            </p>
          </div>

          <div className='flex flex-col items-start gap-2 md:gap-4'>
            <p
              className={cn(
                'text-14 leading-[160%] text-white duration-700',
                animation ? 'translate-x-0' : '-translate-x-[200%] opacity-0',
              )}
            >
              {NEW_PRODUCT_DATA[selectedProduct].description}
            </p>

            <div className='z-20 flex items-center gap-2 md:gap-3'>
              {LIST_NEW_PRODUCT.map((item) => {
                const product = item.title as ENewProduct
                return (
                  <button
                    key={product}
                    onClick={() => handleSelectItem(product)}
                    className={cn(
                      'rounded-2 cursor-pointer border border-white/10 bg-white/10 p-1 shadow backdrop-blur-3xl',
                      NEW_PRODUCT_DATA[product].buttonClassName,
                      selectedProduct === product &&
                        'border-white/30 bg-linear-to-br from-white/50',
                    )}
                  >
                    <Image
                      alt={product}
                      src={item.img}
                      width={1024}
                      height={1024}
                      className='size-12'
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Center column */}
        <div className='relative flex h-full min-h-70 w-[40%] flex-col items-center justify-center'>
          <Bottle3D
            isRotate={animation}
            glbUrl={NEW_PRODUCT_DATA[selectedProduct].model}
            className={cn(
              'absolute z-10',
              animation
                ? 'animate-translate-vertical-in'
                : 'animate-translate-vertical-out',
            )}
          />

          <p className='text-28 absolute -bottom-8 z-20 text-center font-bold text-white lining-nums'>
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Right column */}
        <div className='mt-8 flex h-full w-[30%] flex-col items-start justify-between'>
          <div className='flex flex-col items-start gap-2 md:gap-4'>
            <h3
              className={cn(
                'font-lobster !text-20 text-beige-50 h-[56px] font-medium duration-700',
                animation ? 'translate-x-0' : 'translate-x-[200%] opacity-0',
              )}
            >
              {NEW_PRODUCT_DATA[selectedProduct].tag}
            </h3>

            <div className='flex w-full items-center justify-end gap-2'>
              {NEW_PRODUCT_DATA[selectedProduct].additionalOption?.map(
                (option) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedSize(option.name)}
                    className={cn(
                      'rounded-2 cursor-pointer border border-white/30 bg-linear-to-br from-white/50 to-white/10 p-1 font-semibold text-white shadow backdrop-blur-3xl duration-700',
                      animation ? 'opacity-100' : 'opacity-0',
                      option.name === selectedSize
                        ? 'text-secondary-500 bg-beige-50 border-primary-500 font-bold'
                        : 'hover:border-white/50 hover:from-white/70',
                    )}
                  >
                    <p className='text-14 size-5.5 leading-[160%]'>
                      {option.name}
                    </p>
                  </button>
                ),
              )}
            </div>
          </div>
          <div className='flex w-full items-center justify-between'>
            <AmountCounter
              onChange={setItemAmount}
              amount={itemAmount}
              buttonClassName='rounded-2! border border-white p-1.5 bg-transparent'
            />
            <Button
              disableAnimation
              onClick={handleSubmit}
              disabled={
                !listCartItem.some(
                  (i) => i.title === NEW_PRODUCT_DATA[selectedProduct].title,
                ) && itemAmount === 0
              }
              className={cn(
                'rounded-3 text-secondary-500 w-fit px-4 py-2 text-nowrap duration-200',
                itemAmount === 0 ? 'bg-red-500 text-white' : 'bg-beige-50',
              )}
            >
              {itemAmount === 0 ? <>Delete Order</> : <>Add to cart</>}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
