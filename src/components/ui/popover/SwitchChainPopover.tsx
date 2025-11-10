import { ComponentPropsWithRef, FC, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

import { LIST_CHAIN_ICON } from '@/constants'
import { TPopoverProps } from '@/types'
import { cn } from '@/utils'
import { CheckIcon } from '@phosphor-icons/react'
import Image from 'next/image'

export const SwitchChainPopover: FC<
  TPopoverProps & ComponentPropsWithRef<'div'>
> = ({ isOpen, onClose, ref }) => {
  const { isConnected, chainId } = useAccount()
  const { chains, switchChain } = useSwitchChain()

  const handleSwitchChain = (chainId: number) => {
    switchChain({ chainId })
  }

  useEffect(() => {
    if (!isConnected) {
      onClose()
    }
  }, [isConnected, onClose])

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-4 absolute h-fit w-full border border-black/[0.02] bg-white p-4 shadow-md',
        isOpen ? 'flex flex-col' : 'hidden',
      )}
    >
      <div className='flex w-full flex-col gap-2'>
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => handleSwitchChain(chain.id)}
            className={cn(
              chainId === chain.id && 'from-primary-100 to-secondary-100',
              'rounded-2 hover:from-primary-100/30 hover:to-secondary-100/30 cursor-pointer gap-2 bg-gradient-to-r p-0.5',
            )}
          >
            <div className='rounded-1.5 hover:from-primary-100/30 hover:to-secondary-100/30 flex h-full w-full items-center justify-between bg-white bg-gradient-to-r p-2'>
              <div className='flex items-center gap-2'>
                <Image
                  src={LIST_CHAIN_ICON[chain.id]}
                  className='size-5'
                  alt={`${chain.name} Icon`}
                  width={20}
                  height={20}
                />
                <span className='font-semibold'>{chain.name}</span>
              </div>

              <div
                className={cn(
                  'rounded-6 bg-zk-green-300 flex h-fit items-center gap-0.5 px-1.5 py-0.5',
                  chainId !== chain.id && 'hidden',
                )}
              >
                <CheckIcon size={12} />
                <p className='text-12 font-medioum'>Connected</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
