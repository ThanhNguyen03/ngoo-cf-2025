'use client'

import { SwitchButton, toast } from '@/components/ui'
import { ConnectWalletModal } from '@/components/ui/modal'
import { CopySimpleIcon, WalletIcon } from '@phosphor-icons/react/dist/ssr'
import { type FC, useState } from 'react'

type TWalletSectionProps = {
  walletAddress: string | null | undefined
  onConnectSuccess: () => Promise<void>
}

export const WalletSection: FC<TWalletSectionProps> = ({
  walletAddress,
  onConnectSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const truncated = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : null

  const handleCopy = () => {
    if (!walletAddress) return
    navigator.clipboard.writeText(walletAddress)
    toast.success('Address copied!')
  }

  const handleModalClose = async () => {
    setIsModalOpen(false)
    if (walletAddress) return
    // Refetch in case the wallet was just connected
    await onConnectSuccess()
  }

  return (
    <>
      <div className='rounded-2 border-dark-600/10 flex w-full flex-col overflow-hidden border bg-white'>
        <div className='to-beige-100 via-beige-50 text-16 border-dark-600/10 text-dark-600 from-beige-50 border-b bg-gradient-to-r px-3 py-2 font-semibold'>
          EVM Wallet
        </div>
        <div className='flex w-full items-center justify-between px-4 py-5'>
          {walletAddress ? (
            <div className='flex items-center gap-3'>
              <WalletIcon size={20} className='text-dark-600/60 shrink-0' />
              <span
                className='text-14 text-dark-600 font-mono font-medium'
                title={walletAddress}
              >
                {truncated}
              </span>
              <button
                onClick={handleCopy}
                className='text-dark-600/50 hover:text-dark-600 focus-visible:ring-2 cursor-pointer transition-colors'
                aria-label='Copy wallet address'
              >
                <CopySimpleIcon size={16} />
              </button>
            </div>
          ) : (
            <p className='text-14 text-dark-600/50'>No wallet connected</p>
          )}
          {!walletAddress && (
            <SwitchButton
              variant='white'
              className='text-13 rounded-2! h-8 min-h-8 w-fit gap-1.5 px-3 font-semibold'
              onClick={() => setIsModalOpen(true)}
            >
              <WalletIcon size={14} />
              Connect Wallet
            </SwitchButton>
          )}
        </div>
      </div>

      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </>
  )
}
