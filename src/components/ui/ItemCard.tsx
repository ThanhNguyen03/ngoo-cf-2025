import { TItem } from '@/types'
import { cn } from '@/utils'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import Button from './Button'
import { PlusIcon, TagIcon } from '@phosphor-icons/react/dist/ssr'
import { polygon } from '@/icons'

type TItemCardProps = {
  data: TItem
  setSelectedItem: Dispatch<SetStateAction<TItem | undefined>>
}

const ItemCard: FC<TItemCardProps> = ({ data, setSelectedItem }) => {
  return (
    <>
      <div className='border-dark-600/10 rounded-2 bg-beige-50 relative max-w-60 border'>
        {/* sale tag */}
        <div className='absolute top-4 -right-1 flex flex-col items-end'>
          <p className='rounded-t-1 rounded-l-1 font-shantell text-12! bg-[#d55551] px-2 py-1 leading-[140%] font-bold -tracking-[0.24px] text-white shadow-[-2px_2px_2px_0px_rgba(9,9,11,0.10)]'>
            Sale
          </p>
          <Image alt='polygon' src={polygon} width={4} height={4} />
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
            <div className='flex items-start justify-center gap-2'>
              {data.amountDiscount && (
                <p className='text-14! text-dark-600/70'>
                  {data.price - (data.price * data.amountDiscount) / 100}$
                </p>
              )}
              <div className='flex items-start gap-0.25'>
                <p
                  className={cn(
                    'text-14! text-dark-600/70',
                    !!data.amountDiscount &&
                      'text-dark-600/50 text-12! line-through',
                  )}
                >
                  {data.price}$
                </p>
                {data.amountDiscount && (
                  <TagIcon size={14} className='text-secondary-500' />
                )}
              </div>
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
