import { TItemCardProps } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { FC } from 'react'
import SaleTagIcon from './icons/SaleTag'

const ItemCard: FC<TItemCardProps> = ({ image, title, price, salePrice }) => {
  return (
    <div className='border-dark-600/10 rounded-2 bg-beige-50 relative max-w-60 border'>
      {/* sale tag */}
      <div className='absolute top-5 left-0'>
        <SaleTagIcon size={20} />
      </div>
      <Image
        alt={`image-${title}`}
        src={image}
        width={240}
        height={240}
        className='rounded-t-2 size-60 object-cover'
      />

      <div className='flex flex-col items-start gap-2 p-2 md:gap-3 md:p-4'>
        <h4 className='text-16! text-dark-600 font-semibold'>{title}</h4>
        <div className='flex items-end justify-center gap-2'>
          {salePrice && (
            <p className='text-14! text-dark-600/70'>{salePrice}</p>
          )}
          <p
            className={cn(
              'text-14! text-dark-600/70',
              !!salePrice && 'text-dark-600/50 text-12! line-through',
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
