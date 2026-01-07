import { useState } from 'react'

import { LIST_CHAIN_ICON } from '@/constants'
import { useClickOutside } from '@/hooks/use-click-outside'
import { cn } from '@/utils'
import { CaretDownIcon, CheckIcon, WarningIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { useAccount, useSwitchChain } from 'wagmi'

type TSwitchChainButtonProps = {
  className?: string
}

export const SwitchChainButton = ({ className }: TSwitchChainButtonProps) => {
  const { chain, chainId } = useAccount()
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const { chains, switchChain } = useSwitchChain()

  const isOnlyOneChain = chains.length === 1

  const { ref: containerRef } = useClickOutside<HTMLDivElement>(() => {
    if (isPopoverOpen) {
      setIsPopoverOpen(false)
    }
  })

  const handleSwitchChain = (chainId: number) => {
    switchChain({ chainId })
    setIsPopoverOpen(false)
  }

  const handleSwitchSingleChain = () => {
    if (isOnlyOneChain && chain === chains[0]) {
      return
    }

    if (isOnlyOneChain) {
      switchChain({ chainId: chains[0].id })
    } else {
      setIsPopoverOpen((prev) => !prev)
    }
  }

  return (
    <div
      className={cn(
        'rounded-3 relative flex size-full flex-col items-center justify-start border-2 transition-all duration-500',
        !chain
          ? 'border-pink-500 bg-pink-100'
          : 'border-primary-100 hover:from-primary-100/30 hover:to-secondary-100/30 bg-gradient-to-r',
        isPopoverOpen ? 'max-h-[147px] bg-white' : 'max-h-[54px]',
      )}
      ref={containerRef}
    >
      <button
        className={cn(
          'rounded-t-2.5 relative flex w-full cursor-pointer items-center justify-between p-2 pr-3 pl-2 font-semibold text-black',
          chain
            ? isPopoverOpen
              ? 'hover:from-primary-50 hover:to-beige-50 bg-gradient-to-r'
              : 'rounded-b-2.5 bg-white'
            : '',
          className,
        )}
        onClick={handleSwitchSingleChain}
      >
        {/* chain name */}
        <div className='flex items-center gap-2'>
          {chain && (
            <Image
              src={LIST_CHAIN_ICON[chain.id]}
              className='size-5'
              alt={`${chain.name} icon`}
              width={20}
              height={20}
            />
          )}
          <div className='flex flex-col text-left'>
            <p className='text-14 font-semibold text-black/90'>
              {' '}
              {chain?.name || 'Wrong network'}
            </p>
            <p className='text-12 text-black/50'>
              {chain ? (
                '(Network)'
              ) : isOnlyOneChain ? (
                <>
                  (Click to switch to <strong>{chains[0].name}</strong>)
                </>
              ) : (
                '(Click to select another)'
              )}
            </p>
          </div>
        </div>

        {/* connect sign */}
        <div className='flex items-center gap-2'>
          {chain ? (
            <div className='rounded-6 flex h-fit items-center gap-0.5 bg-green-300 px-1.5 py-0.5'>
              <CheckIcon size={14} />
              <p className='text-12 font-medium'>Connected</p>
            </div>
          ) : (
            <div className='rounded-1 px-1 py-0.5'>
              <WarningIcon size={16} className='text-pink-500' weight='fill' />
            </div>
          )}

          <CaretDownIcon
            size={14}
            className={cn(
              isPopoverOpen && '-rotate-180',
              'text-black/70 transition-all duration-500',
              isOnlyOneChain && 'hidden',
            )}
          />
        </div>
      </button>

      <div className='h-px w-[90%] bg-linear-to-r from-neutral-900/2 via-neutral-900/10 to-neutral-900/2' />
      <div
        className={cn(
          'rounded-b-4 bottom-0 left-0 flex size-full flex-col duration-500',
          isPopoverOpen
            ? 'max-h-[147px] opacity-100'
            : '-z-10 max-h-0 opacity-0',
        )}
      >
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => handleSwitchChain(chain.id)}
            className={cn(
              chainId === chain.id && 'hidden',
              'hover:from-primary-100/30 hover:to-beige-50/30 cursor-pointer gap-2 bg-gradient-to-r p-0.5',
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
