import { polygon } from '@/assets/icons'
import { TItemResponse } from '@/lib/graphql/generated/graphql'
import useCartStore from '@/store/cart-store'
import { TCartItem } from '@/types'
import { cn } from '@/utils'
import { PlusIcon, TagIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC } from 'react'
import { Button } from './Button'
import { EItemModalDetailStatus } from './modal'

type TItemCardProps = {
  data: TItemResponse
  handleSelectItem: (
    item: TItemResponse,
    status: EItemModalDetailStatus,
    cartItem?: TCartItem,
  ) => void
}

export const ItemCard: FC<TItemCardProps> = ({ data, handleSelectItem }) => {
  const { listCartItem } = useCartStore()
  const cartItem = listCartItem.find((c) => c.itemId === data.itemId)

  return (
    <>
      <div
        onClick={() => handleSelectItem(data, EItemModalDetailStatus.CREATE)}
        className='border-dark-600/10 rounded-2 bg-beige-50 relative max-w-60 cursor-pointer border'
      >
        {/* sale tag */}
        <div className='absolute top-4 -right-1 flex flex-col items-end'>
          <p className='rounded-t-1 rounded-l-1 font-shantell text-12! bg-[#d55551] px-2 py-1 leading-[140%] font-bold -tracking-[0.24px] text-white shadow-[-2px_2px_2px_0px_rgba(9,9,11,0.10)]'>
            Sale
          </p>
          <Image alt='polygon' src={polygon} width={4} height={4} />
        </div>
        <Image
          alt={data.itemId}
          src={data.image}
          width={240}
          height={240}
          className='rounded-t-2 size-60 object-cover'
        />

        <div className='flex flex-col items-start gap-2 p-2 md:gap-3 md:p-4'>
          <h4 className='text-16! text-dark-600 font-semibold'>{data.name}</h4>
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-start justify-center gap-2'>
              {data.discountPercent && (
                <p className='text-14! text-dark-600/70'>
                  {data.price - (data.price * data.discountPercent) / 100}$
                </p>
              )}
              <div className='flex items-start gap-0.25'>
                <p
                  className={cn(
                    'text-14! text-dark-600/70',
                    !!data.discountPercent &&
                      'text-dark-600/50 text-12! line-through',
                  )}
                >
                  {data.price}$
                </p>
                {data.discountPercent && (
                  <TagIcon size={14} className='text-secondary-500' />
                )}
              </div>
            </div>
            {cartItem ? (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectItem(
                    data,
                    EItemModalDetailStatus.UPDATE,
                    cartItem,
                  )
                }}
                className='text-14 cursor-pointer rounded-full border border-green-500 bg-white px-2.5 py-1'
              >
                {cartItem.amount}
              </button>
            ) : (
              <Button
                className='text-16! gap-0 rounded-full bg-green-500 p-1.25'
                icon={<PlusIcon size={12} className='text-beige-50' />}
                disableAnimation
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectItem(data, EItemModalDetailStatus.CREATE)
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
