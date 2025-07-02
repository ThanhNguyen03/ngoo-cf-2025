import { TItem, TModalProps } from '@/types'
import React, { FC } from 'react'
import { Modal } from './Modal'
import Image from 'next/image'
import { TagIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Button from '../Button'
import { cn } from '@/utils'

const ItemDetailModal: FC<TModalProps & { data: TItem }> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='min-w-60 bg-beige-50'
      closable={false}
    >
      <div className='relative size-full flex flex-col'>
        <Button
          onClick={onClose}
          disableAnimation
          className='p-1 gap-0 absolute right-4 top-4 z-10 bg-beige-50/50 rounded-full flex items-center justify-center'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>
        <Image
          alt={`image-${data.title}`}
          src={data.image}
          width={240}
          height={240}
          className='rounded-t-2 w-full h-60 object-cover'
        />
        <div className='p-2 md:p-4 flex flex-col gap-2 md:gap-4 w-full'>
          <div className='flex flex-col gap-0.25'>
            <div className='flex w-full items-center justify-between'>
              <h3 className='font-bold text-18'>{data.title}</h3>
              <div className='flex items-start justify-center gap-2'>
                <p
                  className={cn(
                    'text-16! text-dark-600/70 mt-1.25',
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
                <TagIcon size={14} className='rotate-90 text-secondary-500' />
                <p className='text-12! text-dark-600/70'>Sale {data.amountDiscount}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ItemDetailModal
