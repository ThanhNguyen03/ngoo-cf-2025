import { checkoutCancel, checkoutLoading } from '@/assets/images'
import Image from 'next/image'
import { FC } from 'react'

type TCheckoutProcessProps = {
  loading?: boolean
  status: string | null
}
export const CheckoutProcess: FC<TCheckoutProcessProps> = ({
  loading,
  status,
}) => {
  return (
    <>
      {(loading || status) && (
        <div className='center bg-[radial-gradient(circle,hsla(30,60%,98%,0.3)_0%,hsla(345,7%,10%,0.3)_100%) fixed top-0 left-0 z-[999] h-screen w-screen flex-col gap-4 overflow-hidden backdrop-blur-md md:gap-6'>
          <div className='flex flex-col gap-3'>
            {status === 'return' ? (
              <Image
                src={checkoutLoading}
                alt='checkout-loading'
                width={798}
                height={313}
                className='object-cover'
              />
            ) : (
              <Image
                src={checkoutCancel}
                alt='checkout-cancel'
                width={798}
                height={313}
                className='object-cover'
              />
            )}
            <p className='text-28 font-shantell text-beige-50 text-shadow-stroke-2 text-center font-semibold'>
              {status === 'return'
                ? 'Confirming payment...'
                : 'User cancled order!'}
            </p>
          </div>
          {status === 'return' && (
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
