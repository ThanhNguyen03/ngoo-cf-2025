'use client'

import Loading from '@/app/loading'
import { Tooltip } from '@/components/ui'
import { AmountCounter } from '@/components/ui/AmountCounter'
import { SwitchButton } from '@/components/ui/SwitchButton'
import { LIST_NEW_PRODUCT, SIZE_OPTION } from '@/constants'
import { useClickOutside } from '@/hooks/use-click-outside'
import {
  EItemStatus,
  ListItemByStatusDocument,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import useCartStore, {
  calculateItemPrice,
  getCartKey,
} from '@/store/cart-store'
import { ENewProduct } from '@/types'
import { cn } from '@/utils'
import { useQuery } from '@apollo/client/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Bottle3D } from './ui/Bottle3D'

const ANIMATION_DURATION = 700 // ms

type TNewItem = {
  item: TItemResponse
  model: string
  tag: string
  bgClassName?: string
  buttonClassName?: string
  titleClassName?: string
}
const NEW_PRODUCT_UI: Record<ENewProduct, Omit<TNewItem, 'item'>> = {
  [ENewProduct.Cherry]: {
    model: '/models/cherry.glb',
    tag: 'Sweet, fresh, and a sip of happiness.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(340,75%,30%)_0%,hsl(335,75%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-cherry-500/70 to-white/10',
    titleClassName: 'bg-linear-to-br from-cherry-300 to-white',
  },
  [ENewProduct.Kiwi]: {
    model: '/models/kiwi.glb',
    tag: 'Tangy, refreshing, and naturally energizing.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,30%)_0%,hsl(68,76%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-kiwi-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-kiwi-300 to-white',
  },
  [ENewProduct.Orange]: {
    model: '/models/orange.glb',
    tag: 'One glass of orange, one brighter day.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,30%)_0%,hsl(32,99%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-orange-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-orange-300 to-white',
  },
  [ENewProduct.Strawberry]: {
    model: '/models/strawberry.glb',
    tag: 'Naturally sweet, love at first sip.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,30%)_0%,hsl(0,96%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-strawberry-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-strawberry-300 to-white',
  },
}

const mapItemToNewProduct = (item: TItemResponse): ENewProduct | null => {
  switch (item.name) {
    case 'Cherry Juice':
      return ENewProduct.Cherry
    case 'Kiwi Juice':
      return ENewProduct.Kiwi
    case 'Orange Juice':
      return ENewProduct.Orange
    case 'Strawberry Juice':
      return ENewProduct.Strawberry
    default:
      return null
  }
}

export const Hero = () => {
  const { addToCart, removeFromCart, listCartItem, updateCartItem } =
    useCartStore()
  const { data, loading } = useQuery(ListItemByStatusDocument, {
    variables: {
      status: [EItemStatus.New],
    },
  })
  const NEW_PRODUCT_DATA: Record<ENewProduct, TNewItem> | null = useMemo(() => {
    if (loading || !data) {
      return null
    }

    const result = {} as Record<ENewProduct, TNewItem>

    for (const item of data.listItemByStatus.records) {
      const productKey = mapItemToNewProduct(item)
      if (!productKey) {
        continue
      }

      result[productKey] = {
        ...NEW_PRODUCT_UI[productKey],
        item,
      }
    }

    return result
  }, [loading, data])

  const [selectedProduct, setSelectedProduct] = useState<ENewProduct>(
    ENewProduct.Cherry,
  )
  const [animation, setAnimation] = useState<boolean>(false)
  const [isShowMore, setIsShowMore] = useState<string>('')
  const [showMore, setShowMore] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const [itemAmount, setItemAmount] = useState<number>(1)
  const [selectedSize, setSelectedSize] = useState<string>('')

  const { ref: containerRef } = useClickOutside<HTMLDivElement>(() => {
    if (showMore) {
      setShowMore(false)
    }
  })

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
    if (!NEW_PRODUCT_DATA) {
      return
    }
    const itemData = NEW_PRODUCT_DATA[selectedProduct]
    const selectedOptions = SIZE_OPTION.filter(
      (opt) => opt.name === selectedSize,
    )

    if (itemAmount === 0) {
      removeFromCart(itemData.item.itemId, selectedOptions)
      setItemAmount(1)
      return
    }

    const existingItem = listCartItem.find(
      (i) =>
        getCartKey(i.itemId, i.selectedOptions || []) ===
        getCartKey(itemData.item.itemId, selectedOptions),
    )

    if (existingItem) {
      updateCartItem(itemData.item.itemId, selectedOptions, {
        amount: itemAmount,
      })
    } else {
      addToCart(itemData.item, selectedOptions, itemAmount)
    }
  }

  useEffect(() => {
    if (!NEW_PRODUCT_DATA) {
      return
    }
    const itemData = NEW_PRODUCT_DATA[selectedProduct]
    const selectedOptions = SIZE_OPTION.filter(
      (opt) => opt.name === selectedSize,
    )
    const existingItem = listCartItem.find(
      (i) =>
        getCartKey(i.itemId, i.selectedOptions || []) ===
        getCartKey(itemData.item.itemId, selectedOptions),
    )
    if (existingItem) {
      setItemAmount(existingItem.amount)
      setTotalPrice(
        calculateItemPrice(
          existingItem.itemInfo,
          existingItem.selectedOptions || [],
          existingItem.amount,
        ),
      )
    }
  }, [selectedProduct, listCartItem, selectedSize, NEW_PRODUCT_DATA])

  useEffect(() => {
    setAnimation(false)
    const timeout = setTimeout(() => setAnimation(true), ANIMATION_DURATION)

    return () => clearTimeout(timeout)
  }, [selectedSize])

  useEffect(() => {
    if (!NEW_PRODUCT_DATA) {
      return
    }
    setTotalPrice(
      calculateItemPrice(
        NEW_PRODUCT_DATA[selectedProduct].item,
        SIZE_OPTION.filter((opt) => opt.name === selectedSize),
        itemAmount,
      ),
    )
  }, [itemAmount, selectedProduct, selectedSize, NEW_PRODUCT_DATA])

  console.log('first', NEW_PRODUCT_DATA)

  return (
    <>
      {loading || !NEW_PRODUCT_DATA ? (
        <Loading className='from-primary-50/30 to-secondary-50/30 text-beige-50 backdrop-blur-md' />
      ) : (
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
          <div className='relative mx-auto flex h-[calc(100dvh-200px)] max-h-[580px] w-full max-w-[1200px] justify-center md:h-[calc(100dvh-300px)] md:max-h-[885px] md:gap-4'>
            {/* Left column */}
            <div className='mt-8 flex h-full w-[30%] flex-col items-start gap-10 md:justify-between'>
              <div className='absolute flex flex-col items-start gap-2 md:relative'>
                <h2
                  className={cn(
                    'md:text-35! font-lobster text-28! bg-clip-text leading-[120%] font-black text-transparent capitalize duration-500',
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
                      'font-lobster text-18! text-beige-50 max-w-50 cursor-pointer truncate text-left font-medium duration-700 select-none hover:underline min-[550px]:max-w-none min-[550px]:cursor-default md:hidden',
                      animation
                        ? 'translate-x-0'
                        : '-translate-x-[200%] opacity-0',
                    )}
                  >
                    {NEW_PRODUCT_DATA[selectedProduct].tag}
                  </h3>
                </Tooltip>
                <p className='text-16! hidden leading-[160%] text-white md:block'>
                  {selectedSize === 'M' ? '350ml' : '500ml'}
                </p>
              </div>

              <div className='mt-30 flex flex-col items-start gap-2 md:mt-0 md:gap-4'>
                {/* description */}
                <p
                  className={cn(
                    'text-16! hidden leading-[160%] text-white duration-700 md:mb-20 md:block lg:mb-0',
                    animation
                      ? 'translate-x-0'
                      : '-translate-x-[200%] opacity-0',
                  )}
                >
                  <span
                    className={cn(
                      'font-medium text-ellipsis',
                      isShowMore === selectedProduct &&
                        'line-clamp-2 md:line-clamp-4 lg:line-clamp-none',
                    )}
                  >
                    {NEW_PRODUCT_DATA[selectedProduct].item.description}
                  </span>
                  <span
                    onClick={() =>
                      setIsShowMore(isShowMore ? '' : selectedProduct)
                    }
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
                          'rounded-2 xl:rounded-4 cursor-pointer border border-white/10 bg-white/10 p-1 shadow backdrop-blur-3xl',
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
                          className='size-12 xl:size-16'
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
                      (i) =>
                        i.itemId ===
                        NEW_PRODUCT_DATA[selectedProduct].item.itemId,
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
            <div className='relative flex h-full w-3/5 flex-col items-center justify-center md:min-h-70 md:w-[40%]'>
              <Bottle3D
                isRotate={animation}
                glbUrl={NEW_PRODUCT_DATA[selectedProduct].model}
                className={cn(
                  'absolute top-20 -left-25 z-10 min-[620px]:-left-10 sm:-left-20 md:top-auto lg:left-0 xl:size-[500px]',
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
                    animation
                      ? 'translate-x-0'
                      : 'translate-x-[200%] opacity-0',
                  )}
                >
                  {NEW_PRODUCT_DATA[selectedProduct].tag}
                </h3>

                <p
                  className={cn(
                    'text-14! mt-25 hidden text-right leading-[160%] text-white duration-700 min-[620px]:block md:hidden',
                    animation
                      ? 'translate-x-0'
                      : 'translate-x-[200%] opacity-0',
                    isShowMore !== selectedProduct && 'absolute w-full',
                  )}
                >
                  <span
                    className={cn(
                      'text-ellipsis',
                      isShowMore === selectedProduct && 'line-clamp-4',
                    )}
                  >
                    {NEW_PRODUCT_DATA[selectedProduct].item.description}
                  </span>
                  <span
                    onClick={() =>
                      setIsShowMore(isShowMore ? '' : selectedProduct)
                    }
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
                  {NEW_PRODUCT_DATA[selectedProduct].item.requireOption.map(
                    (option) => (
                      <button
                        key={option.name}
                        onClick={() => {
                          setItemAmount(1)
                          setSelectedSize(option.name)
                        }}
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
                      (i) =>
                        i.itemId ===
                        NEW_PRODUCT_DATA[selectedProduct].item.itemId,
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
              {NEW_PRODUCT_DATA[selectedProduct].item.description}
            </p>
          </div>
        </section>
      )}
    </>
  )
}
