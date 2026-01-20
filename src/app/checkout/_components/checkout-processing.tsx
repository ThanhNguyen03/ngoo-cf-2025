import { checkoutCancel, checkoutLoading } from '@/assets/images'
import { toast } from '@/components/ui'
import { EPaymentStatus } from '@/lib/graphql/generated/graphql'
import { connectPaymentSocket } from '@/lib/socket-client'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

type TCheckoutProcessProps = {
  loading?: boolean
}
export const CheckoutProcess: FC<TCheckoutProcessProps> = ({ loading }) => {
  const searchParams = useSearchParams().get('status')
  const router = useRouter()

  const [finish, setFinish] = useState<boolean>(false)

  const orderId = localStorage.getItem('paypal-order-id')

  useEffect(() => {
    if (!orderId) {
      return
    }
    if (searchParams && finish) {
      window.close()
    } else {
      connectPaymentSocket(orderId, async (socketData) => {
        if (socketData.orderId !== orderId) {
          return
        }

        switch (socketData.status) {
          case EPaymentStatus.Success:
            toast.success('Payment successful')
            router.replace(`/payment/${socketData.paymentId}`)
            break
          case EPaymentStatus.Failed:
            toast.error('Payment failed')
            router.replace(`/payment/${socketData.paymentId}`)
            break
          case EPaymentStatus.Cancelled:
            toast.error('Payment cancelled')
            router.replace('/checkout?status=cancel')
            break
        }
        setFinish(true)
        localStorage.removeItem('paypal-order-id')
      })
    }

    if (searchParams === 'cancel') {
      localStorage.removeItem('paypal-order-id')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, searchParams, finish])

  return (
    <>
      {(loading || searchParams) && (
        <div className='center bg-[radial-gradient(circle,hsla(30,60%,98%,0.3)_0%,hsla(345,7%,10%,0.3)_100%) fixed top-0 left-0 z-[999] h-screen w-screen flex-col gap-4 overflow-hidden backdrop-blur-md md:gap-6'>
          <div className='flex flex-col gap-3'>
            {searchParams === 'cancel' ? (
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
            <p className='text-28 font-shantell text-beige-50 text-shadow-stroke-2 text-center font-semibold'>
              {searchParams === 'cancel'
                ? 'User cancled order!'
                : 'Confirming payment...'}
            </p>
          </div>
          {searchParams !== 'cancel' && (
            <div className='mx-auto w-full max-w-[500px] px-6'>
              <div className='center rounded-2 border-dark-600/20 bg-beige-50 relative h-1.5 w-full items-start overflow-hidden border'>
                <div className='rounded-2 animate-loading h-full w-2/5 bg-green-500' />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
