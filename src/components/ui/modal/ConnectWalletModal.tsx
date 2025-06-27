import { type FC, useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

import type { TModalProps } from '@/types'

import Image from 'next/image'
import { Modal } from './Modal'

export const ConnectWalletModal: FC<TModalProps> = ({ isOpen, onClose }) => {
  const { isConnected } = useAccount()
  const { connectors, connect } = useConnect()

  useEffect(() => {
    if (isConnected) {
      onClose()
    }
  }, [isConnected, onClose])

  return (
    <Modal title='Connect Wallet' isOpen={isOpen} onClose={onClose}>
      <div className='flex w-full flex-col gap-3 p-4'>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            className='rounded-2 flex cursor-pointer items-center gap-4 p-2 hover:bg-white/10 md:gap-6'
          >
            {connector.icon && (
              <Image
                alt='connetor-icon'
                src={connector.icon}
                className='size-10'
                width={40}
                height={40}
              />
            )}
            <span className='font-semibold'>{connector.name}</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}
