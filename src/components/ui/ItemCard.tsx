import { TItem } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import SaleTagIcon from './icons/SaleTag'
import Button from './Button'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'

type TItemCardProps = {
  data: TItem
  setSelectedItem: Dispatch<SetStateAction<TItem | undefined>>
}

const ItemCard: FC<TItemCardProps> = ({ data, setSelectedItem }) => {
  return (
    <>
      <div className='border-dark-600/10 rounded-2 bg-beige-50 relative max-w-60 border'>
        {/* sale tag */}
        <div className='absolute top-5 left-0'>
          <SaleTagIcon
            width={40}
            height={20}
            amountDiscount={data.amountDiscount || 0}
          />
        </div>
        <Image
          alt={`image-${data.title}`}
          src={data.image}
          width={240}
          height={240}
          className='rounded-t-2 size-60 object-cover'
        />

        <div className='flex flex-col items-start gap-2 p-2 md:gap-3 md:p-4'>
          <h4 className='text-16! text-dark-600 font-semibold'>{data.title}</h4>
          <div className='flex justify-between w-full items-center'>
            <div className='flex items-end justify-center gap-2'>
              {data.amountDiscount && (
                <p className='text-14! text-dark-600/70'>
                  {data.price - (data.price * data.amountDiscount) / 100}$
                </p>
              )}
              <p
                className={cn(
                  'text-14! text-dark-600/70',
                  !!data.amountDiscount &&
                    'text-dark-600/50 text-12! line-through',
                )}
              >
                {data.price}$
              </p>
            </div>
            <Button
              className='bg-green-500 rounded-full w-10 h-fit py-1 px-0 gap-0 text-16!'
              icon={<PlusIcon size={12} className='text-beige-50' />}
              disableAnimation
              onClick={() => setSelectedItem(data)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ItemCard
