'use client'

import { Tooltip } from '@/components/ui'
import AmountCounter from '@/components/ui/AmountCounter'
import SwitchButton from '@/components/ui/SwitchButton'
import { LIST_NEW_PRODUCT, NEW_PRODUCT_DATA, SIZE_OPTION } from '@/constants'
import useCartStore, { calculateItemPrice } from '@/store/cart-store'
import { ENewProduct, TItem } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Bottle3D } from './ui/Bottle3D'

const ANIMATION_DURATION = 700 // ms

const Hero = () => {
  const { addToCart, removeFromCart, updateCartItem, listCartItem } =
    useCartStore()
  const [selectedProduct, setSelectedProduct] = useState<ENewProduct>(
    ENewProduct.Cherry,
  )
  const [animation, setAnimation] = useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<string>('')
  const [showMore, setShowMore] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [itemAmount, setItemAmount] = useState<number>(1)
  const [selectedSize, setSelectedSize] = useState<string>(
    NEW_PRODUCT_DATA[selectedProduct].additionalOption?.[0].name || '',
  )

  const containerRef = useRef<HTMLDivElement>(null)

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

  // handle click outside to close
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const listener = () => {
      if (showMore) {
        setShowMore(false)
      }
    }

    document.addEventListener('click', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('click', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [showMore])

  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30',
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          NEW_PRODUCT_DATA[selectedProduct].bgClassName,
          'bg-[length:200%_100%] bg-left lg:bg-[length:100%_100%] lg:bg-center',
        )}
      />
      <div className='relative mx-auto flex h-[calc(100dvh-300px)] max-h-[885px] w-full max-w-[1024px] justify-center md:gap-4'>
        {/* Left column */}
        <div className='mt-8 flex h-full w-[30%] flex-col items-start gap-10 md:justify-between'>
          <div className='absolute flex flex-col items-start gap-2 md:relative'>
            <h2
              className={cn(
                'md:text-32 font-lobster text-28! bg-clip-text leading-[120%] font-black text-transparent capitalize duration-500',
                NEW_PRODUCT_DATA[selectedProduct].titleClassName,
                animation ? 'opacity-100' : 'opacity-0',
              )}
            >
              {selectedProduct} Juice
            </h2>

            <Tooltip
              content={
                <p className='text-14 font-semibold -tracking-[0.32px] text-white'>
                  Show more description
                </p>
              }
              className='z-20 bg-white/50 shadow-md backdrop-blur-2xl min-[550px]:hidden'
              position='bottom'
              offset={0}
            >
              <h3
                onClick={() => setShowMore(!showMore)}
                className={cn(
                  'font-lobster text-18 text-beige-50 max-w-50 cursor-pointer truncate text-left font-medium duration-700 select-none hover:underline min-[550px]:max-w-none min-[550px]:cursor-default',
                  animation ? 'translate-x-0' : '-translate-x-[200%] opacity-0',
                )}
              >
                {NEW_PRODUCT_DATA[selectedProduct].tag}
              </h3>
            </Tooltip>
            <p className='text-14 hidden leading-[160%] text-white md:block'>
              {selectedSize === 'M' ? '350ml' : '500ml'}
            </p>
          </div>

          <div className='mt-30 flex flex-col items-start gap-2 md:mt-0 md:gap-4'>
            {/* description */}
            <p
              className={cn(
                'text-14! hidden leading-[160%] text-white duration-700 md:mb-20 md:block lg:mb-0',
                animation ? 'translate-x-0' : '-translate-x-[200%] opacity-0',
              )}
            >
              <span
                className={cn(
                  'text-ellipsis',
                  isShowMore === selectedProduct &&
                    'line-clamp-2 md:line-clamp-4 lg:line-clamp-none',
                )}
              >
                {NEW_PRODUCT_DATA[selectedProduct].description}
              </span>
              <span
                onClick={() => setIsShowMore(isShowMore ? '' : selectedProduct)}
                className={cn(
                  'cursor-pointer font-semibold text-nowrap underline lg:hidden',
                  isShowMore !== selectedProduct && 'pl-2',
                )}
              >
                {isShowMore === selectedProduct ? 'Show more' : 'Show less'}
              </span>
            </p>

            {/* list product */}
            <div className='z-20 flex flex-col items-center gap-2 md:absolute md:-bottom-8 md:w-full md:flex-row md:gap-3 lg:relative lg:bottom-0'>
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

          <div className='absolute bottom-0 flex w-full items-center justify-between gap-2 md:hidden'>
            <AmountCounter
              onChange={setItemAmount}
              amount={itemAmount}
              buttonClassName='rounded-2! border border-white p-1.5 bg-transparent'
            />
            <p className='text-23 z-20 font-bold text-white lining-nums'>
              ${totalPrice.toFixed(2)}
            </p>
            <SwitchButton
              variant={itemAmount === 0 ? 'pink' : 'white'}
              onClick={handleSubmit}
              disabled={
                !listCartItem.some(
                  (i) => i.title === NEW_PRODUCT_DATA[selectedProduct].title,
                ) && itemAmount === 0
              }
              className={cn(
                'rounded-2! h-8 min-h-8 w-fit font-semibold text-nowrap duration-200',
                'disabled:shadow-btn-transparent disabled:border-0 disabled:bg-red-500',
              )}
            >
              {itemAmount === 0 ? 'Delete Order' : 'Add to cart'}
            </SwitchButton>
          </div>
        </div>

        {/* Center column */}
        <div className='relative flex h-full min-h-70 w-3/5 flex-col items-center justify-center md:w-[40%]'>
          <Bottle3D
            isRotate={animation}
            glbUrl={NEW_PRODUCT_DATA[selectedProduct].model}
            className={cn(
              'absolute -left-25 z-10 min-[620px]:-left-10 sm:-left-20 lg:left-0',
              animation
                ? 'animate-translate-vertical-in'
                : 'animate-translate-vertical-out',
            )}
          />

          {/* price */}
          <p className='text-28 absolute -bottom-8 z-20 hidden text-center font-bold text-white lining-nums lg:flex'>
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Right column */}
        <div className='z-20 mt-8 flex h-full w-[10%] flex-col items-end justify-between min-[620px]:w-[30%] md:items-start'>
          <div className='relative flex w-full flex-col items-end gap-2 md:gap-4'>
            <h3
              className={cn(
                'font-lobster text-20! text-beige-50 hidden h-[56px] text-right font-medium duration-700 md:flex lg:h-fit',
                animation ? 'translate-x-0' : 'translate-x-[200%] opacity-0',
              )}
            >
              {NEW_PRODUCT_DATA[selectedProduct].tag}
            </h3>

            <p
              className={cn(
                'text-14! mt-25 hidden text-right leading-[160%] text-white duration-700 min-[620px]:block md:hidden',
                animation ? 'translate-x-0' : 'translate-x-[200%] opacity-0',
                isShowMore !== selectedProduct && 'absolute w-full',
              )}
            >
              <span
                className={cn(
                  'text-ellipsis',
                  isShowMore === selectedProduct && 'line-clamp-4',
                )}
              >
                {NEW_PRODUCT_DATA[selectedProduct].description}
              </span>
              <span
                onClick={() => setIsShowMore(isShowMore ? '' : selectedProduct)}
                className={cn(
                  'cursor-pointer font-semibold text-nowrap underline lg:hidden',
                  isShowMore !== selectedProduct && 'pl-2',
                )}
              >
                {isShowMore === selectedProduct ? 'Show more' : 'Show less'}
              </span>
            </p>

            <p
              className={cn(
                'text-14 mt-50 flex leading-[160%] text-white md:hidden',
                isShowMore !== selectedProduct
                  ? 'min-[620px]:mt-110'
                  : 'min-[620px]:mt-55',
              )}
            >
              {selectedSize === 'M' ? '350ml' : '500ml'}
            </p>

            <div className='flex w-full flex-col items-end justify-end gap-2 min-[620px]:flex-row md:items-center'>
              {NEW_PRODUCT_DATA[selectedProduct].additionalOption?.map(
                (option) => (
                  <button
                    key={option.name}
                    onClick={() => setSelectedSize(option.name)}
                    className={cn(
                      'rounded-2 size-fit cursor-pointer border border-white/30 bg-linear-to-br from-white/50 to-white/10 p-1 font-semibold text-white shadow backdrop-blur-3xl duration-700',
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
          <div className='hidden w-full flex-col items-end justify-between gap-2 md:flex lg:flex-row lg:items-center lg:justify-end lg:gap-6'>
            <p className='text-23 z-20 mb-4 text-right font-bold text-white lining-nums lg:hidden'>
              ${totalPrice.toFixed(2)}
            </p>
            <AmountCounter
              onChange={setItemAmount}
              amount={itemAmount}
              buttonClassName='rounded-2! border border-white p-1.5 bg-transparent'
            />
            <SwitchButton
              variant='pink'
              onClick={handleSubmit}
              disabled={
                !listCartItem.some(
                  (i) => i.title === NEW_PRODUCT_DATA[selectedProduct].title,
                ) && itemAmount === 0
              }
              className={cn(
                'rounded-2! lg:rounded-3! h-8 min-h-8 w-fit border-0 px-4 font-semibold text-nowrap duration-200 lg:h-12 lg:min-h-12',
                'disabled:shadow-btn-transparent disabled:bg-red-500',
              )}
            >
              {itemAmount === 0 ? 'Delete Order' : 'Add to cart'}
            </SwitchButton>
          </div>
        </div>
      </div>

      {/* description mobile */}
      <div
        ref={containerRef}
        className={cn(
          'absolute top-0 right-0 z-50 flex h-full w-3/4 flex-col items-start justify-center gap-10 bg-neutral-900/50 px-4 backdrop-blur-2xl duration-300 min-[620px]:hidden',
          showMore
            ? 'translate-x-0 opacity-100'
            : 'translate-x-[600px] opacity-0',
        )}
      >
        <h3 className='font-lobster text-18 text-beige-50 text-left font-medium duration-700'>
          {NEW_PRODUCT_DATA[selectedProduct].tag}
        </h3>
        <p className='text-14 text-beige-50 leading-[160%]'>
          {NEW_PRODUCT_DATA[selectedProduct].description}
        </p>
      </div>
    </section>
  )
}

export default Hero
