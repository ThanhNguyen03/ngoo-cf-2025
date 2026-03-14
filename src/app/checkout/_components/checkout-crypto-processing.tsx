'use client'

import { SwitchButton, toast } from '@/components/ui'
import { useCryptoPayment } from '@/hooks'
import { EPaymentStatus, TCryptoPaymentProof } from '@/lib/graphql/generated/graphql'
import { connectPaymentSocket } from '@/lib/socket-client'
import useCartStore from '@/store/cart-store'
import {
  ArrowSquareOutIcon,
  SpinnerIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef } from 'react'

type TCheckoutCryptoProcessingProps = {
  orderId: string
  cryptoProof: TCryptoPaymentProof
}

// BNB Testnet block explorer URL
const BSCSCAN_TESTNET_TX = 'https://testnet.bscscan.com/tx'

// Handles the on-chain payment step for crypto orders.
// Shown as a full-screen overlay after createOrder returns a cryptoPaymentProof.
//
// Flow:
// 1. Auto-triggers sendPayment on mount (user signs the tx in their wallet)
// 2. Shows tx hash link to BscScan once submitted
// 3. Listens on Socket.IO for BE confirmation of the on-chain payment
// 4. On success: clears cart + cart backup, redirects to /payment/{paymentId}
// 5. On error: shows retry/cancel options; cart backup in sessionStorage allows retry
export const CheckoutCryptoProcessing: FC<TCheckoutCryptoProcessingProps> = ({
  orderId,
  cryptoProof,
}) => {
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)
  const { sendPayment, isPending, isConfirming, txHash, isSuccess, reset } =
    useCryptoPayment()

  // Track whether we've already triggered sendPayment to avoid double-invocation
  const hasSentRef = useRef(false)

  // Auto-trigger wallet transaction on mount
  useEffect(() => {
    if (hasSentRef.current) return
    hasSentRef.current = true
    sendPayment(cryptoProof)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // After the tx is confirmed on-chain, subscribe to Socket.IO for BE confirmation
  useEffect(() => {
    if (!isSuccess || !orderId) return

    const setupSocket = async () => {
      const connected = await connectPaymentSocket(orderId, (socketData) => {
        if (socketData.orderId !== orderId) return

        if (socketData.status === EPaymentStatus.Success) {
          toast.success('Payment confirmed!')
          // Clear cart and backup now that payment is fully confirmed
          clearCart()
          sessionStorage.removeItem('checkout-cart-backup')
          setTimeout(() => {
            router.replace(`/payment/${socketData.paymentId}`)
          }, 1000)
        } else if (
          socketData.status === EPaymentStatus.Failed ||
          socketData.status === EPaymentStatus.Cancelled
        ) {
          toast.error(`Payment ${socketData.status.toLowerCase()}`)
        }
      })

      if (!connected) {
        toast.error('Failed to connect to payment server')
      }
    }

    setupSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, orderId])

  const handleCancel = () => {
    // Cancelling only dismisses the overlay — the on-chain tx is already submitted.
    // The cart backup remains in sessionStorage so the user can retry from /payment.
    reset()
    hasSentRef.current = false
    router.replace(`/payment/${orderId}`)
  }

  const handleRetry = () => {
    reset()
    hasSentRef.current = false
    sendPayment(cryptoProof)
    hasSentRef.current = true
  }

  return (
    <div className='center fixed top-0 left-0 z-[999] h-screen w-screen flex-col gap-6 bg-black/60 px-4 backdrop-blur-sm'>
      <div className='font-shantell from-primary-300 to-beige-50 rounded-3 flex w-full max-w-[460px] flex-col gap-6 bg-gradient-to-b bg-white p-6 shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <p className='text-18 text-dark-600 font-bold'>Crypto Payment</p>
          <button
            className='text-dark-600/50 hover:text-dark-600 cursor-pointer'
            onClick={handleCancel}
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className='h-px bg-gradient-to-r from-white to-white/[0.02]' />

        {/* Status content */}
        <div className='flex flex-col items-center gap-4 py-2 text-center'>
          {/* Pending wallet signature */}
          {isPending && (
            <>
              <SpinnerIcon
                size={40}
                className='text-orange-500 animate-spin'
              />
              <p className='text-16 text-dark-600 font-medium'>
                Confirm the transaction in your wallet
              </p>
              <p className='text-14 text-dark-600/60'>
                Please check MetaMask or your connected wallet
              </p>
            </>
          )}

          {/* Waiting for on-chain confirmation */}
          {isConfirming && txHash && (
            <>
              <SpinnerIcon
                size={40}
                className='text-orange-500 animate-spin'
              />
              <p className='text-16 text-dark-600 font-medium'>
                Transaction submitted — waiting for confirmation
              </p>
              <a
                href={`${BSCSCAN_TESTNET_TX}/${txHash}`}
                target='_blank'
                rel='noopener noreferrer'
                className='text-14 flex items-center gap-1 font-medium text-orange-500 underline'
              >
                View on BscScan <ArrowSquareOutIcon size={14} />
              </a>
            </>
          )}

          {/* Tx confirmed, waiting for BE */}
          {isSuccess && (
            <>
              <SpinnerIcon
                size={40}
                className='text-green-500 animate-spin'
              />
              <p className='text-16 text-dark-600 font-medium'>
                Transaction confirmed!
              </p>
              <p className='text-14 text-dark-600/60'>
                Waiting for payment to be processed...
              </p>
              {txHash && (
                <a
                  href={`${BSCSCAN_TESTNET_TX}/${txHash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-14 flex items-center gap-1 font-medium text-green-500 underline'
                >
                  View on BscScan <ArrowSquareOutIcon size={14} />
                </a>
              )}
            </>
          )}

          {/* Idle state before wallet prompt */}
          {!isPending && !isConfirming && !isSuccess && !txHash && (
            <p className='text-14 text-dark-600/60'>
              Initializing payment...
            </p>
          )}
        </div>

        {/* Amount info */}
        <div className='rounded-2 border-dark-600/10 flex items-center justify-between border bg-white/50 px-4 py-3'>
          <span className='text-14 text-dark-600/70 font-medium'>Amount</span>
          <span className='text-16 font-bold text-orange-500'>
            {cryptoProof.amountDisplay} BNB
          </span>
        </div>

        {/* Action buttons: only show retry/cancel when not actively processing */}
        {!isPending && !isConfirming && !isSuccess && (
          <div className='flex w-full gap-3'>
            <SwitchButton
              variant='pink'
              className='flex-1'
              onClick={handleCancel}
            >
              Cancel
            </SwitchButton>
            <SwitchButton
              variant='white'
              className='flex-1'
              onClick={handleRetry}
            >
              Retry
            </SwitchButton>
          </div>
        )}
      </div>
    </div>
  )
}
