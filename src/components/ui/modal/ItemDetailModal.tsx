import { TItem, TModalProps } from '@/types'
import React, { FC } from 'react'
import { Modal } from './Modal'

const ItemDetailModal: FC<TModalProps & { data: TItem }> = ({
  isOpen,
  onClose,
  data,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='flex w-full flex-col gap-3 p-4'>{data.title}</div>
    </Modal>
  )
}

export default ItemDetailModal
