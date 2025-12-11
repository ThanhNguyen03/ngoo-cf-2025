import { confuseCow } from '@/assets/images'
import { TModalProps } from '@/types'
import { XIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC } from 'react'
import { Button } from '../Button'
import { Modal } from './Modal'

export const ConfirmModal: FC<TModalProps & { message: string }> = ({
  isOpen,
  onClose,
  message,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='rounded-4 max-h-[80%] w-90 overflow-hidden'
      closable={false}
      closeOnOutsideClick
    >
      <div className='rounded-4 relative flex size-full flex-col overflow-hidden'>
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/60 fixed top-4 right-4 z-10 flex items-center justify-center gap-0 rounded-full border border-neutral-900/10 p-1 backdrop-blur-2xl'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>

        <div className='flex flex-col gap-4 px-4'>
          <div className='border-dark-600/10 border-b py-4'>
            <h5 className='text-18 font-shantell font-bold text-red-500'>
              Are you sure?
            </h5>
          </div>
          <div className='border-dark-600/10 center text-14 size-full flex-col border-b py-4 font-medium'>
            <Image
              alt='confuse cow'
              src={confuseCow}
              width={798}
              height={313}
              className='h-40 w-full object-cover'
            />
            <p>This action can&apos;t be undo!</p>
            <p>{message}</p>
          </div>
          <div className='center w-full py-4'></div>
        </div>
      </div>
    </Modal>
  )
}
