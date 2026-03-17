'use client'

import { type FC, useEffect } from 'react'
import { Connector, CreateConnectorFn, useAccount, useConnect } from 'wagmi'

import type { TModalProps } from '@/types'

import { SwitchButton } from '@/components/ui'
import { METAMASK_BASE64_ICON } from '@/constants'
import { useIsHydrated, useWalletAuth } from '@/hooks'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import { SpinnerIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { useDisconnect } from 'wagmi'
import { Modal } from './Modal'

type TWalletConnetorProps = {
  connector: Connector<CreateConnectorFn>
  className?: string
}
const WalletConnetor: FC<TWalletConnetorProps> = ({ connector, className }) => {
  const { connect } = useConnect()
  const connectorIcon =
    connector.id === 'metaMaskSDK' ? METAMASK_BASE64_ICON : connector.icon

  return (
    <SwitchButton
      variant='white'
      onClick={() => connect({ connector })}
      className={cn(
        'border-dark-600/10 h-14 w-full cursor-pointer justify-normal gap-2 border-2',
        className,
      )}
    >
      <div className='p-2'>
        <Image
          alt={connector.name}
          src={connectorIcon || connector.icon || ''}
          height={32}
          width={32}
          className='rounded-1 size-6'
        />
      </div>
      <span className='text-16 text-neutral-900'>{connector.name}</span>
    </SwitchButton>
  )
}

export const ConnectWalletModal: FC<TModalProps> = ({ isOpen, onClose }) => {
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const isHydrate = useIsHydrated()
  const { connectors } = useConnect()
  const userInfo = useAuthStore((s) => s.userInfo)
  const { connectWallet, isConnecting, isSuccess, error, reset } =
    useWalletAuth()

  // If the user closes the modal while the signature is pending, disconnect the
  // wagmi wallet so the app doesn't stay in an "isConnected but unverified" limbo.
  const handleClose = () => {
    if (isConnecting || (isConnected && !userInfo?.walletAddress)) {
      disconnect()
      reset()
    }
    onClose()
  }

  const metamaskWalletConnector =
    connectors.length > 0
      ? connectors.find((wallet) => wallet.id.includes('metamask'))
      : undefined

  // After wallet provider connects, check if we still need to verify ownership.
  // If walletAddress is already set in user profile, just close the modal.
  // Otherwise trigger the nonce → sign → verify flow.
  useEffect(() => {
    if (!isConnected || !address) return

    if (userInfo?.walletAddress) {
      // Already verified — close immediately
      onClose()
      return
    }

    // Start verification flow
    connectWallet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address])

  // Handle successful verification
  useEffect(() => {
    if (!isSuccess) return
    toast.success('Wallet connected successfully!')
    onClose()
  }, [isSuccess, onClose])

  // Handle verification error — disconnect wallet and show error toast
  useEffect(() => {
    if (!error) return
    toast.error(error)
    disconnect()
    reset()
  }, [error, disconnect, reset])

  return (
    <Modal
      title='Connect Wallet'
      isOpen={isOpen}
      onClose={onClose}
      className='rounded-4 h-fit w-full max-w-[460px] border-4 border-white/50 bg-transparent'
      closable={false}
    >
      {isHydrate && (
        <div className='font-shantell rounded-3 from-primary-300 to-beige-50 relative flex w-full flex-col bg-white bg-gradient-to-b to-60% shadow-md'>
          <div className='flex w-full items-center justify-between p-4 md:p-6'>
            <p className='text-18 text-dark-600 font-bold'>Connect a wallet</p>
            <SwitchButton
              variant='white'
              className='rounded-2! h-8 min-h-8 w-fit p-1.5'
            >
              <XIcon
                className='text-dark-600 cursor-pointer'
                onClick={handleClose}
                size={16}
              />
            </SwitchButton>
          </div>
          <div className='h-[2px] bg-gradient-to-r from-white to-white/[0.02]' />

          {/* Verification pending state — shown after wallet connects */}
          {isConnecting && (
            <div className='flex min-h-40 flex-col items-center justify-center gap-3 p-6'>
              <SpinnerIcon size={32} className='text-primary-500 animate-spin' />
              <p className='text-16 text-dark-600 text-center font-medium'>
                Verifying wallet ownership...
                <br />
                <span className='text-14 text-dark-600/60'>
                  Please sign the message in your wallet
                </span>
              </p>
            </div>
          )}

          {!isConnecting && connectors.length > 0 && (
            <div className='flex w-full flex-col gap-4 p-4 md:p-6'>
              {metamaskWalletConnector && (
                <div className='flex w-full flex-col gap-2'>
                  <p className='text-16 font-medium text-black/50'>
                    Suggested wallet
                  </p>
                  <WalletConnetor connector={metamaskWalletConnector} />
                </div>
              )}

              <div className='flex w-full flex-col gap-2'>
                <p className='text-16 font-medium text-black/50'>
                  Popular wallet
                </p>
                <div
                  className={cn(
                    'scrollbar-none flex max-h-[300px] flex-col gap-3 overflow-y-scroll',
                  )}
                >
                  {connectors.map((connector) => {
                    return (
                      <WalletConnetor
                        key={connector.uid}
                        connector={connector}
                        className={cn(
                          connector.id.includes('metamask') && 'hidden',
                        )}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {!isConnecting && connectors.length === 0 && (
            <div className='flex min-h-60 flex-col items-center justify-center gap-4 p-4'>
              <p className='text-16 text-dark-600/70 text-center font-medium'>
                No wallet detected.
                <br />
                Please install at least one{' '}
                <Link
                  target='_blank'
                  href='https://metamask.io/download'
                  className='font-semibold underline'
                >
                  wallet
                </Link>{' '}
                to continue.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
