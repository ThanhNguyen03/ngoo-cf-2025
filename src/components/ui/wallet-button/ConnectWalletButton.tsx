import { useState } from 'react'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'

import { cn, formatBalance } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { AccountModal, ConnectWalletModal } from '../modal'
import { defaultAvatar } from '@/images'

type TConnectWalletButtonProps = {
  accountButtonclassName?: string
  connectWalletButtonClassName?: string
  address: Address | undefined
  isConnected: boolean
}

export const ConnectWalletButton = ({
  accountButtonclassName,
  connectWalletButtonClassName,
  address,
  isConnected,
}: TConnectWalletButtonProps) => {
  const { data: balance } = useBalance({ address })
  const [isConnectWalletModalOpen, setIsConnectWalletModalOpen] =
    useState<boolean>(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false)

  return (
    <>
      {isConnected ? (
        <button
          className={cn(
            'rounded-2 flex h-10 cursor-pointer items-center justify-center gap-2 border border-white/10 bg-white/10 px-4 py-2 font-semibold text-white shadow',
            accountButtonclassName
          )}
          onClick={() => setIsAccountModalOpen(true)}
        >
          <p>
            {balance &&
              formatBalance(
                balance.value,
                balance.decimals,
                balance.symbol
              ).toPrecision()}
          </p>
          <Image alt='default-avt' src={defaultAvatar} className='size-4' />
        </button>
      ) : (
        <button
          className={cn(
            'rounded-2 flex cursor-pointer items-center text-14! leading-[160%] justify-center gap-1 bg-secondary-500 px-2 py-1 font-semibold text-white shadow',
            connectWalletButtonClassName
          )}
          onClick={() => setIsConnectWalletModalOpen(true)}
        >
          <WalletIcon size={18} />
          Connect Wallet
        </button>
      )}
      <ConnectWalletModal
        isOpen={isConnectWalletModalOpen}
        onClose={() => setIsConnectWalletModalOpen(false)}
      />
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
      />
    </>
  )
}
