'use client'

import { loginBg } from '@/assets/images'
import { TOrderItem } from '@/lib/graphql/generated/graphql'
import { cn } from '@/utils'
import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC, useState } from 'react'

type TPaymentItemProps = {
  item: TOrderItem
}
const PaymentItem: FC<TPaymentItemProps> = ({ item }) => {
  return (
    <div className='flex w-full cursor-pointer items-start gap-4 duration-300'>
      <Image
        alt={item.name}
        src={item.image}
        width={200}
        height={200}
        className='rounded-2 aspect-square size-20 object-cover object-center'
      />
      <div className='flex w-full flex-col items-start gap-1 text-left'>
        <div className='flex w-full items-start justify-between'>
          <h5 className='text-18 font-bold text-green-500'>{item.name}</h5>
          <div className='flex min-w-20 items-end justify-end gap-2'>
            <p
              className={cn(
                'text-16 font-semibold',
                item.discountPercent &&
                  'text-dark-600/50 text-[13px] font-normal line-through',
              )}
            >
              {item.price}$
            </p>
            {item.discountPercent && (
              <p className='text-16! font-semibold'>
                {item.price - (item.price * item.discountPercent) / 100}$
              </p>
            )}
          </div>
        </div>

        {/* options */}
        {item.selectedOptions.map((option) => (
          <p key={option.group} className='text-14 text-dark-600/70'>
            {option.group === 'size' ? 'Size' : ''} {option.name}{' '}
            {option.extraPrice && option.extraPrice > 0
              ? `+${option.extraPrice}$`
              : ''}
          </p>
        ))}
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
]
const PaymentPage = () => {
  const [listPaymentItem, setListPaymentItem] = useState<TOrderItem[]>(Mock)

  return (
    <main className='bg-paper relative overflow-x-hidden px-2 md:px-6 lg:px-10'>
      <div className='mx-auto flex w-full max-w-[640px] flex-col gap-10 py-5'>
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
        </div>

        <div className='shadow-container border-dark-600/10 rounded-4 size-full border bg-white p-6'>
          <div className='flex flex-col items-start gap-4'>
            {listPaymentItem.map((item) => (
              <PaymentItem key={item.name} item={item} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
