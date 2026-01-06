import { TOrderItem } from '@/lib/graphql/generated/graphql'
import { calculateItemPrice } from '@/store/cart-store'
import { cn } from '@/utils'
import Image from 'next/image'
import { FC } from 'react'

type TPaymentItemProps = {
  item: TOrderItem
}
export const PaymentItem: FC<TPaymentItemProps> = ({ item }) => {
  const totalItemPrice = calculateItemPrice(
    item,
    item.selectedOptions,
    item.amount,
  )

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
