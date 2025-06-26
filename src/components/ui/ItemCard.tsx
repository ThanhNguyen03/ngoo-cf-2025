import { cn } from '@/utils'
import Image from 'next/image'
import React, { FC } from 'react'
import SaleTagIcon from './icons/SaleTag'
import { TItemCardProps } from '@/types'

const ItemCard: FC<TItemCardProps> = ({ image, title, price, salePrice }) => {
  return (
    <div className='max-w-60 border border-dark-600/10 rounded-2 relative'>
      {/* sale tag */}
      <div className='absolute top-5 left-0'>
        <SaleTagIcon size={20} />
      </div>
      <Image
        alt={`image-${title}`}
        src={image}
        width={240}
        height={240}
        className='object-cover size-60 rounded-t-2'
      />

      <div className='p-2 md:p-4 flex flex-col gap-2 md:gap-3 items-start'>
        <h4 className='text-16! font-semibold text-dark-600'>{title}</h4>
        <div className='flex gap-2 items-end justify-center'>
          {salePrice && (
            <p className='text-14! text-dark-600/70'>{salePrice}</p>
          )}
          <p
            className={cn(
              'text-14! text-dark-600/70',
              !!salePrice && 'line-through text-dark-600/50 text-12!'
            )}
          >
            {price}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ItemCard
