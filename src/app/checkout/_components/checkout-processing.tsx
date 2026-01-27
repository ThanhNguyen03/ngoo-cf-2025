import { checkoutCancel, checkoutLoading } from '@/assets/images'
import { SwitchButton, toast } from '@/components/ui'
import { EPaymentStatus } from '@/lib/graphql/generated/graphql'
import { connectPaymentSocket } from '@/lib/socket-client'
import useCartStore from '@/store/cart-store'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'

type TCheckoutProcessProps = {
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  processingTimeout: number
}
export const CheckoutProcess: FC<TCheckoutProcessProps> = ({
  isProcessing,
  processingTimeout,
  setIsProcessing,
}) => {
  const searchParams = useSearchParams().get('status')
  const router = useRouter()
  const clearCart = useCartStore((state) => state.clearCart)

  const [retry, setRetry] = useState<boolean>(false)
  const paypalWindowRef = useRef<Window | null>(null)
  const url = localStorage.getItem('paypal-approve-url')

  const handleOpenApproveWindow = (url: string) => {
    if (paypalWindowRef.current && !paypalWindowRef.current.closed) {
      paypalWindowRef.current.focus()
      return
    }
    try {
      paypalWindowRef.current = window.open(
        url,
        '_blank',
        'width=993,height=650',
      )
    } catch (error) {
      console.error('Error to open approval PayPal popup', error)
    }
  }

  useEffect(() => {
    if (!isProcessing) {
      return
    }

    if (!url) {
      return
    }

    handleOpenApproveWindow(url)

    const interval = setInterval(() => {
      // Check if popup was blocked
      if (paypalWindowRef.current?.closed && isProcessing) {
        clearInterval(interval)
        toast.error('PayPal window was closed')
        setRetry(true)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [isProcessing, url])

  useEffect(() => {
    if (!isProcessing) {
      return
    }

    const handleEmitSocket = () => {
      const orderId = localStorage.getItem('paypal-order-id')
      if (!orderId) {
        return
      }
      connectPaymentSocket(orderId, async (socketData) => {
        if (socketData.orderId !== orderId) {
          return
        }
        switch (socketData.status) {
          case EPaymentStatus.Success:
            toast.success('Payment successful')
            router.replace(`/payment/${socketData.paymentId}`)
            setIsProcessing(false)
            clearCart()
            break
          case EPaymentStatus.Failed:
            toast.error('Payment failed')
            router.replace(`/payment/${socketData.paymentId}`)
            setIsProcessing(false)
            clearCart()
            break
          case EPaymentStatus.Cancelled:
            toast.error('Payment cancelled')
            router.replace(`/payment/${socketData.paymentId}`)
            setIsProcessing(false)
            clearCart()
            break
        }
        // Clean up
        localStorage.removeItem('paypal-order-id')
        localStorage.removeItem('paypal-approve-url')
      })
    }

    handleEmitSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isProcessing])

  return (
    <>
      {(isProcessing || searchParams) && (
        <div className='center bg-[radial-gradient(circle,hsla(30,60%,98%,0.3)_0%,hsla(345,7%,10%,0.3)_100%) fixed top-0 left-0 z-[999] h-screen w-screen flex-col gap-4 overflow-hidden backdrop-blur-md md:gap-6'>
          <div className='flex flex-col gap-3'>
            {searchParams === 'cancel' || retry ? (
              <Image
                src={checkoutCancel}
                alt='checkout-cancel'
                width={798}
                height={313}
                className='object-cover'
              />
            ) : (
              <Image
                src={checkoutLoading}
                alt='checkout-loading'
                width={798}
                height={313}
                className='object-cover'
              />
            )}
            <p className='text-18 text-dark-600 text-center font-medium'>
              <>
                We are processing your payment request, please wait in
                <b className='text-secondary-500'> {processingTimeout} </b>
                seconds...
              </>
              {searchParams === 'cancel'
                ? 'User canceled order!'
                : retry
                  ? 'PayPal window was closed! Re-launch the window to complete your purchase'
                  : ''}
            </p>
          </div>
          <div className='mx-auto w-full max-w-[500px] px-6'>
            {retry ? (
              <div className='center w-full gap-2 md:gap-4'>
                <SwitchButton variant='pink' className='w-fit'>
                  Cancel Payment
                </SwitchButton>
                {url && (
                  <SwitchButton
                    variant='white'
                    className='w-fit'
                    onClick={() => {
                      handleOpenApproveWindow(url)
                      setRetry(false)
                    }}
                  >
                    Retry Payment
                  </SwitchButton>
                )}
              </div>
            ) : (
              <div className='center rounded-2 border-dark-600/20 bg-beige-50 relative h-1.5 w-full items-start overflow-hidden border'>
                <div className='rounded-2 animate-loading h-full w-2/5 bg-green-500' />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
