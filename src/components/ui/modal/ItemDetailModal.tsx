import { TItem, TModalProps } from '@/types'
import { cn } from '@/utils'
import { TagIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC } from 'react'
import Button from '../Button'
import { Modal } from './Modal'

const ItemDetailModal: FC<TModalProps & { data: TItem }> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='bg-beige-50 min-w-60'
      closable={false}
    >
      <div className='relative flex size-full flex-col'>
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/50 absolute top-4 right-4 z-10 flex items-center justify-center gap-0 rounded-full p-1'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>
        <Image
          alt={`image-${data.title}`}
          src={data.image}
          width={240}
          height={240}
          className='rounded-t-2 h-60 w-full object-cover'
        />
        <div className='flex w-full flex-col'>
          {/* main detail */}
          <div className='border-dark-600/10 flex flex-col gap-0.25 border-b p-2 pb-4 md:p-4 md:pb-6'>
            <div className='flex w-full items-start justify-between'>
              <h3 className='text-18 mt-1 leading-5 font-bold'>{data.title}</h3>
              <div className='flex items-start justify-center gap-2'>
                <p
                  className={cn(
                    'text-16! text-dark-600/50 mt-1.25',
                    !!data.amountDiscount &&
                      'text-dark-600/50 text-12! line-through',
                  )}
                >
                  {data.price}$
                </p>
                {data.amountDiscount && (
                  <p className='text-18! text-dark-600/70 font-bold'>
                    {data.price - (data.price * data.amountDiscount) / 100}$
                  </p>
                )}
              </div>
            </div>
            {data.amountDiscount && (
              <div className='flex items-start gap-1'>
                <TagIcon size={14} className='text-secondary-500 rotate-90' />
                <p className='text-12! text-dark-600/70'>
                  Sale {data.amountDiscount}%
                </p>
              </div>
            )}
            <p className='text-12 text-dark-600/50 pt-2.75'>
              {data.description}
            </p>
          </div>

          {/* add optional */}
          <div className='border-dark-600/10 flex flex-col gap-2 border-b p-2 pb-1 md:gap-6 md:p-4 md:pb-2'>
            <div className='flex items-center justify-between'>
              <h3 className='font-small-caps text-18 font-semibold'>SIZE</h3>
              <p className='rounded-2 bg-shade-700/10 text-dark-600/70 text-10 px-1 py-0.5'>
                Optional - maximum 1
              </p>
            </div>
            {/* checkbox */}
            
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ItemDetailModal
