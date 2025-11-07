import { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

import { cn, formatNumber, truncateAddress } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'
import { CaretDownIcon, WarningIcon } from '@phosphor-icons/react/dist/ssr'
import { formatUnits } from 'viem'
import { AccountModal, ConnectWalletModal } from '../modal'

type TConnectWalletButtonProps = {
  className?: string
}

export const ConnectWalletButton = ({
  className,
}: TConnectWalletButtonProps) => {
  const { address, isConnected, chain } = useAccount()
  const { data: nativeBalance } = useBalance({ address })

  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false)
  const [openAccountPopup, setOpenAccountPopup] = useState<boolean>(false)

  return (
    <div className={cn('relative flex h-full w-fit', className)}>
      {isConnected ? (
        <>
          <button
            className='rounded-2 flex h-8 cursor-pointer items-center justify-center gap-1 text-[14px] leading-[160%] text-black'
            onClick={() => setOpenAccountPopup(true)}
          >
            {chain && nativeBalance ? ( // show native balance
              <div className='rounded-2 flex flex-col items-end'>
                <p className='text-14 text-primary-600 max-w-[113px]! truncate font-bold -tracking-[0.32px]'>
                  {truncateAddress(address || '', 6)}
                </p>
                <p className='text-12 font-medium'>
                  {`${formatNumber(formatUnits(nativeBalance.value, nativeBalance.decimals), 0, 4)} ${nativeBalance.symbol}`}
                </p>
              </div>
            ) : (
              <div className='rounded-2 bg-cherry-50 flex items-center gap-1 px-2 py-1 text-pink-500'>
                <WarningIcon size={16} weight='fill' />
                <p className='text-14 flex font-medium text-nowrap'>
                  Wrong network!
                </p>
                <CaretDownIcon
                  size={14}
                  weight='bold'
                  className={cn(
                    'transion-all duration-300',
                    openAccountPopup && '-rotate-180',
                  )}
                />
              </div>
            )}
          </button>
          {openAccountPopup && (
            <div className='absolute top-15 right-0 hidden lg:flex'>
              <AccountModal
                className='w-70'
                isOpen={openAccountPopup}
                onClose={() => setOpenAccountPopup(false)}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <button
            className='rounded-2 text-14! from-secondary-300 hidden cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow md:flex'
            onClick={() => setIsConnectWalletModalOpen(true)}
          >
            <WalletIcon size={18} />
            Connect Wallet
          </button>
          <ConnectWalletModal
            isOpen={isConnectWalletModalOpen}
            onClose={() => setIsConnectWalletModalOpen(false)}
          />
        </>
      )}
    </div>
  )
}
