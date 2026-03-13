'use client'

import { useState } from 'react'

import { ConnectWalletModal } from '@/components/ui/modal'
import { useWalletAuth } from '@/hooks'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import { WalletIcon } from '@phosphor-icons/react'
import { useAccount, useDisconnect } from 'wagmi'

type TConnectWalletButtonProps = {
  className?: string
}

// Truncate wallet address to "0x1234...abcd" for display
const truncateAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`

export const ConnectWalletButton = ({
  className,
}: TConnectWalletButtonProps) => {
  const [openConnectWalletModal, setOpenConnectWalletModal] =
    useState<boolean>(false)

  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const userInfo = useAuthStore((s) => s.userInfo)
  const { connectWallet, isConnecting } = useWalletAuth()

  // Wallet is connected at the wagmi level but not yet verified with BE
  const isConnectedButUnverified =
    isConnected && address && !userInfo?.walletAddress

  // Wallet is fully verified (address stored in user profile)
  const isVerified = isConnected && !!userInfo?.walletAddress

  if (isVerified) {
    return (
      <div className={cn('relative flex h-full w-fit', className)}>
        <button
          className='rounded-2 text-14! from-secondary-300 hidden cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow md:flex'
          onClick={() => disconnect()}
          title='Click to disconnect'
        >
          <WalletIcon size={18} />
          {truncateAddress(userInfo.walletAddress!)}
        </button>
      </div>
    )
  }

  if (isConnectedButUnverified) {
    return (
      <div className={cn('relative flex h-full w-fit', className)}>
        <button
          className='rounded-2 text-14! hidden cursor-pointer items-center justify-center gap-1 border border-yellow-500 bg-yellow-50 px-2 py-1 leading-[160%] font-semibold text-yellow-700 shadow md:flex'
          onClick={connectWallet}
          disabled={isConnecting}
        >
          <WalletIcon size={18} />
          {isConnecting ? 'Verifying...' : 'Verify Wallet'}
        </button>
      </div>
    )
  }

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
