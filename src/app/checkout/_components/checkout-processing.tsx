import { checkoutLoading } from '@/assets/images'
import { SwitchButton, toast } from '@/components/ui'
import type { useCooldown } from '@/hooks'
import { EPaymentStatus } from '@/lib/graphql/generated/graphql'
import { connectPaymentSocket } from '@/lib/socket-client'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useRef, useState } from 'react'

type PaypalMessage = {
  type: string
  timestamp: number
}
type TCheckoutProcessProps = {
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  cooldownHook: ReturnType<typeof useCooldown>
  checkoutData: {
    url: string
    orderId: string
  }
}
export const CheckoutProcess: FC<TCheckoutProcessProps> = ({
  isProcessing,
  cooldownHook,
  setIsProcessing,
  checkoutData,
}) => {
  const router = useRouter()

  const [retry, setRetry] = useState<boolean>(false)
  const [isPaypalClosed, setIsPaypalClosed] = useState<boolean>(false)
  const paypalWindowRef = useRef<Window | null>(null)
  const countdownRef = useRef<HTMLElement>(null)

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
      setIsPaypalClosed(false)
      setRetry(false)
    } catch (error) {
      console.error('Error to open approval PayPal popup', error)
    }
  }

  useEffect(() => {
    if (countdownRef.current) {
      cooldownHook.registerDisplay(countdownRef.current)
    }
  }, [cooldownHook])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return
      }

      const data = event.data as PaypalMessage

      if (data.type === 'PAYPAL_RETURN') {
        setIsPaypalClosed(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  useEffect(() => {
    if (!isProcessing || !checkoutData.url) {
      return
    }

    handleOpenApproveWindow(checkoutData.url)
    const interval = setInterval(() => {
      if (!paypalWindowRef.current || paypalWindowRef.current.closed) {
        if (isProcessing && !isPaypalClosed) {
          clearInterval(interval)
          toast.error('PayPal window was closed')
          setRetry(true)
        }
      }
    }, 500)

    return () => clearInterval(interval)
  }, [isProcessing, checkoutData.url, isPaypalClosed])

  useEffect(() => {
    if (!isProcessing || !checkoutData.orderId) {
      return
    }

    const handleEmitSocket = () => {
      connectPaymentSocket(checkoutData.orderId, async (socketData) => {
        if (socketData.orderId !== checkoutData.orderId) {
          return
        }

        if (socketData.status !== EPaymentStatus.Processing) {
          if (socketData.status === EPaymentStatus.Success) {
            toast.success('Payment successful!')
          } else {
            toast.error(`Payment ${socketData.status.toLowerCase()}`)
          }

          setIsProcessing(false)
          // Cleanup before redirect
          localStorage.removeItem('paypal-order-id')
          localStorage.removeItem('paypal-approve-url')

          // Timeout redirect to see toast toast
          setTimeout(() => {
            router.replace(`/payment/${socketData.paymentId}`)
          }, 1000)

          cooldownHook.clearCooldown()

          return
        }
      })
    }

    handleEmitSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, isProcessing, checkoutData.orderId])

  useEffect(() => {
    if (!isProcessing || !cooldownHook.getCurrent()) {
      return
    }

    const timeout = setTimeout(() => {
      if (isProcessing) {
        toast.error('Payment timeout. Please try again.')
        setIsProcessing(false)
        setRetry(false)

        // Cleanup
        localStorage.removeItem('paypal-order-id')
        localStorage.removeItem('paypal-approve-url')

        // Close popup if old popup still open
        if (paypalWindowRef.current && !paypalWindowRef.current.closed) {
          paypalWindowRef.current.close()
        }
      }
    }, cooldownHook.getCurrent() * 1000)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, setIsProcessing])

  return (
    <>
      {isProcessing && (
        <div className='center bg-[radial-gradient(circle,hsla(30,60%,98%,0.3)_0%,hsla(345,7%,10%,0.3)_100%) fixed top-0 left-0 z-[999] h-screen w-screen flex-col gap-4 overflow-hidden backdrop-blur-md md:gap-6'>
          <div className='flex flex-col gap-3'>
            <Image
              src={checkoutLoading}
              alt='checkout-loading'
              width={798}
              height={313}
              className='object-cover'
            />
            <p className='text-18 text-dark-600 text-center font-medium'>
              We are processing your payment request
              {!isPaypalClosed && (
                <span>
                  , please wait in{' '}
                  <b ref={countdownRef} className='text-secondary-500'>
                    {cooldownHook.getCurrent()}
                  </b>{' '}
                  seconds...{' '}
                </span>
              )}
              <br />
              {retry &&
                'PayPal window was closed! Re-launch the window to complete your purchase'}
            </p>
          </div>
          <div className='mx-auto w-full max-w-[500px] px-6'>
            {retry ? (
              <div className='center w-full gap-2 md:gap-4'>
                <SwitchButton
                  variant='pink'
                  className='w-fit'
                  onClick={() => {
                    setIsProcessing(false)
                    setRetry(false)
                    localStorage.removeItem('paypal-order-id')
                    localStorage.removeItem('paypal-approve-url')
                  }}
                >
                  Cancel Payment
                </SwitchButton>
                {checkoutData.url && (
                  <SwitchButton
                    variant='white'
                    className='w-fit'
                    onClick={() => {
                      handleOpenApproveWindow(checkoutData.url)
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
