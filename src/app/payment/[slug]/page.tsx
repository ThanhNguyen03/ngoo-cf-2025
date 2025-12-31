'use client'

import { loginBg } from '@/assets/images'
import { SwitchButton } from '@/components/ui'
import { TOrderItem } from '@/lib/graphql/generated/graphql'
import { calculateItemPrice } from '@/store/cart-store'
import { cn } from '@/utils'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC, useMemo, useState } from 'react'

type TPaymentItemProps = {
  item: TOrderItem
}
const PaymentItem: FC<TPaymentItemProps> = ({ item }) => {
  const totalItemPrice = useMemo(() => {
    return calculateItemPrice(item, item.selectedOptions, item.amount)
  }, [])

  return (
    <div className='border-dark-600/20 flex w-full cursor-pointer items-start gap-4 border-b pb-4 duration-300 last:border-0 last:pb-0'>
      <Image
        alt={item.name}
        src={item.image}
        width={200}
        height={200}
        className='rounded-2 aspect-square size-20 object-cover object-center'
      />
      <div className='center size-full gap-10'>
        <div className='flex w-full flex-col items-start gap-2 text-left'>
          <div className='flex w-full items-start justify-between'>
            <div className='flex flex-col items-start gap-1'>
              <h5 className='text-18 font-bold text-green-500'>{item.name}</h5>

              {/* options */}
              <div className='flex flex-col items-start'>
                {item.selectedOptions.map((option) => (
                  <p key={option.group} className='text-14 text-dark-600'>
                    {option.group === 'size' ? 'Size' : ''} {option.name}
                  </p>
                ))}
                <p className='text-14 text-dark-600'>{item.note}</p>
              </div>
            </div>

            <div className='text-16 font-shantell flex min-w-20 flex-col items-end justify-end font-semibold'>
              {item.discountPercent && (
                <p>
                  {(
                    totalItemPrice -
                    (totalItemPrice * item.discountPercent) / 100
                  ).toFixed(2)}
                  $
                </p>
              )}
              <p
                className={cn(
                  item.discountPercent &&
                    'text-dark-600/50 text-[13px] leading-[160%] font-normal line-through',
                )}
              >
                {totalItemPrice.toFixed(2)}$
              </p>
            </div>
          </div>
        </div>
        <p className='text-18 font-shantell border-dark-600/10 center min-w-20 border-l pl-10 font-bold text-blue-500'>
          x{item.amount}
        </p>
      </div>
    </div>
  )
}

const Mock: TOrderItem[] = [
  {
    name: 'asdads',
    amount: 1,
    image: loginBg.src,
    price: 12,
    selectedOptions: [
      {
        group: 'size',
        name: 'L',
        extraPrice: 2,
      },
    ],
  },
  {
    name: 'sfsdfsdfsdf',
    amount: 3,
    image: loginBg.src,
    discountPercent: 10,
    price: 12,
    selectedOptions: [
      {
        group: 'size',
        name: 'L',
        extraPrice: 2,
      },
    ],
  },
  {
    name: '1231213',
    amount: 1,
    image: loginBg.src,
    price: 12,
    selectedOptions: [
      {
        group: 'size',
        name: 'L',
        extraPrice: 2,
      },
    ],
  },
  {
    name: 'sdfsfsdfsftwertwer',
    amount: 3,
    image: loginBg.src,
    discountPercent: 10,
    price: 12,
    selectedOptions: [
      {
        group: 'size',
        name: 'L',
        extraPrice: 2,
      },
    ],
  },
]
const PaymentPage = () => {
  const [listPaymentItem, setListPaymentItem] = useState<TOrderItem[]>(Mock)

  return (
    <main className='bg-paper relative w-full overflow-x-hidden'>
      <div className='border-dark-600/30 relative mx-auto flex size-full min-h-[calc(100dvh-57px)] max-w-[640px] flex-col gap-10 overflow-x-hidden border-x bg-white px-2 py-5 md:px-6 lg:px-10'>
        {/* status */}
        <div className='center flex w-full flex-col gap-6'>
          <div className='center relative size-40 w-full'>
            <div className='absolute left-1/2 size-40 -translate-x-1/2 animate-[ping_1.25s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-200/20' />
            <div className='absolute left-1/2 size-20 -translate-x-1/2 animate-[ping_0.75s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-500/30' />
            <CheckCircleIcon
              weight='fill'
              size={60}
              className='absolute left-1/2 -translate-x-1/2 text-green-500'
            />
          </div>
          <div className='center flex flex-col gap-3'>
            <h2 className='text-23 md:text-28 font-shantell text-shadow-stroke-2 font-bold -tracking-[0.32px] text-white'>
              Payment successful
            </h2>
            <p className='text-16 text-dark-600 font-medium'>
              Thank you for your purchase!
            </p>
          </div>

          <div className='flex w-full items-center justify-center gap-4'>
            <SwitchButton
              className='rounded-3! w-fit font-semibold text-nowrap'
              variant='white'
            >
              Back to History
            </SwitchButton>
            <SwitchButton
              className='rounded-3! w-fit font-semibold text-nowrap'
              variant='green'
            >
              Continue Shopping
            </SwitchButton>
          </div>
        </div>

        <div className='from-dark-600/2 to-dark-600/2 via-dark-600/20 h-px w-full bg-gradient-to-r' />

        <div className='flex w-full flex-col items-start gap-4'>
          <div className='flex w-full items-center justify-between font-medium'>
            <p className='text-dark-600 text-16'>Transaction details</p>
            <p className='text-primary-500 text-18 font-small-caps font-bold underline'>
              #Payment ID
            </p>
          </div>

          <div className='shadow-box border-dark-600/10 rounded-4 relative flex w-full flex-col items-start border bg-white p-6'>
            <div className='flex w-full flex-col items-start gap-2'>
              <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
                <p>Payment method</p>
                <p className='font-bold'>Paypal</p>
              </div>
              <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
                <p>Invoice date</p>
                <p className='font-bold'>{new Date().toDateString()}</p>
              </div>
            </div>

            <div className='bg-dark-600/10 mt-4 h-px w-full' />

            <div className='scrollbar-none relative size-full max-h-60 overflow-y-scroll'>
              <div className='flex flex-col items-start gap-4 pt-4'>
                {listPaymentItem.map((item) => (
                  <PaymentItem key={item.name} item={item} />
                ))}
              </div>
            </div>
          </div>

          <div className='shadow-box border-dark-600/10 rounded-4 text-16 text-dark-600 relative flex w-full items-center justify-between border bg-white p-6'>
            <p>Discount</p>
            <p className='font-shantell font-bold'>$0</p>
          </div>

          <div className='shadow-box border-dark-600/10 rounded-4 text-16 relative flex w-full items-center justify-between border bg-white p-6 font-bold'>
            <p className='text-dark-600'>Total cost</p>
            <p className='font-shantell text-green-500'>$123</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
