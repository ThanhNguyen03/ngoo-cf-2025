import { useRef, useState } from 'react'
import { useAccount } from 'wagmi'

import { useIsHydrated } from '@/hooks/use-is-hydrated'
import { cn, truncateAddress } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'
import { CaretDownIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { AccountModal, ConnectWalletModal } from '../modal'
import { SkeletonLoader } from '../SkeletonLoader'
import { Tooltip } from '../Tooltip'

type TConnectWalletButtonProps = {
  className?: string
}

export const ConnectWalletButton = ({
  className,
}: TConnectWalletButtonProps) => {
  const isHydrated = useIsHydrated()
  const { address, isConnected, connector, chain } = useAccount()

  const popupRef = useRef<HTMLDivElement | null>(null)
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false)
  const [openAccountPopup, setOpenAccountPopup] = useState<boolean>(false)

  return (
    <div className={cn('relative flex h-full w-fit', className)}>
      <SkeletonLoader loading={!isHydrated} className='min-h-8 w-40'>
        {isHydrated && (
          <>
            {isConnected && connector ? (
              <button
                className='hidden w-fit cursor-pointer items-center md:flex'
                onClick={() => setOpenAccountPopup(!openAccountPopup)}
              >
                <Tooltip
                  content={
                    <p className='font-shantell text-16 font-semibold -tracking-[0.32px] text-white'>
                      Wrong network
                    </p>
                  }
                  className={cn(
                    'z-[102] bg-pink-300 shadow-md',
                    chain && 'hidden',
                  )}
                  position='bottom'
                  offset={0}
                >
                  <div
                    className={cn(
                      'rounded-4 lg:rounded-l-2! lg:rounded-r-0! flex items-center gap-2 p-2 lg:py-1! lg:pr-3! lg:pl-1!',
                      chain ? 'bg-green-200' : 'bg-pink-200',
                    )}
                  >
                    <div className='rounded-2 flex items-center justify-center bg-white p-1 lg:rounded-[6px]!'>
                      {connector.icon && (
                        <Image
                          alt={connector.name}
                          src={connector.icon}
                          width={16}
                          height={16}
                          className='size-4'
                        />
                      )}
                    </div>
                    <p className='font-shantell text-14! max-w-16 truncate font-bold -tracking-[0.32px] select-none md:max-w-[113px]!'>
                      {chain
                        ? truncateAddress(address || '')
                        : truncateAddress(address || '', 4)}
                    </p>
                  </div>
                </Tooltip>
                <div className='z-10 h-full min-h-8 w-[1px] bg-white' />
                <div className='relative w-fit' ref={popupRef}>
                  <div
                    className={cn(
                      'rounded-r-2 hidden items-center justify-center bg-green-200 p-2 lg:flex!',
                      chain ? 'bg-green-200' : 'bg-pink-200',
                    )}
                  >
                    {!chain ? (
                      <WarningIcon className='text-pink-500' weight='fill' />
                    ) : (
                      <CaretDownIcon weight='fill' />
                    )}
                  </div>
                  {openAccountPopup && (
                    <div className='absolute top-15 right-0 hidden lg:flex'>
                      <AccountModal
                        className='w-70'
                        isOpen={openAccountPopup}
                        onClose={() => setOpenAccountPopup(false)}
                      />
                    </div>
                  )}
                </div>
              </button>
            ) : (
              <button
                className='rounded-2 text-14! from-secondary-300 hidden cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow md:flex'
                onClick={() => setIsConnectWalletModalOpen(true)}
              >
                <WalletIcon size={18} />
                Connect Wallet
              </button>
            )}
          </>
        )}
      </SkeletonLoader>
      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
    </div>
  )
}
