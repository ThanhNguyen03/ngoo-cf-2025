import { useState } from 'react'

import { ConnectWalletModal } from '@/components/ui/modal'
import { cn } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'

type TConnectWalletButtonProps = {
  className?: string
}

export const ConnectWalletButton = ({
  className,
}: TConnectWalletButtonProps) => {
  const [openConnectWalletModal, setOpenConnectWalletModal] =
    useState<boolean>(false)

  return (
    <div className={cn('relative flex h-full w-fit', className)}>
      <button
        className='rounded-2 text-14! from-secondary-300 hidden cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow md:flex'
        onClick={() => setOpenConnectWalletModal(true)}
      >
        <WalletIcon size={18} />
        Connect Wallet
      </button>
      <ConnectWalletModal
        isOpen={openConnectWalletModal}
        onClose={() => setOpenConnectWalletModal(false)}
      />
    </div>
  )
}
