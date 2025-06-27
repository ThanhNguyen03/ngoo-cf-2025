import { useState } from 'react'
import type { Address } from 'viem'
import { useBalance } from 'wagmi'

import { defaultAvatar } from '@/images'
import { cn, formatBalance } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'
import Image from 'next/image'
import { AccountModal, ConnectWalletModal } from '../modal'

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
            'rounded-2 text-14! border-beige-50 to-primary-500/70 from-secondary-500/70 flex cursor-pointer items-center justify-center gap-2 border bg-linear-to-br px-2 py-1 leading-[160%] font-semibold text-white shadow backdrop-blur-2xl',
            accountButtonclassName,
          )}
          onClick={() => setIsAccountModalOpen(true)}
        >
          <p>
            {balance &&
              formatBalance(
                balance.value,
                balance.decimals,
                balance.symbol,
              ).toPrecision()}
          </p>
          <Image alt='default-avt' src={defaultAvatar} className='size-4.5' />
        </button>
      ) : (
        <button
          className={cn(
            'rounded-2 text-14! from-secondary-300 flex cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow',
            connectWalletButtonClassName,
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
