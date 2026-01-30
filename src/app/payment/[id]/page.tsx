'use client'

import { checkoutLoading } from '@/assets/images'
import { SkeletonLoader } from '@/components/ui'
import { client } from '@/lib/apollo-client'
import {
  EPaymentMethod,
  PaymentUserHistoryDocument,
  TUserPaymentResponse,
} from '@/lib/graphql/generated/graphql'
import { apolloWrapper, cn } from '@/utils'
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PaymentDetail } from '../_components/payment-detail'

const step = [
  { name: 'Order accepted' },
  { name: 'Order preparing' },
  { name: 'Delivering' },
  { name: 'Success' },
]

const MOCKED_TIME_STEPS = [1, 10, 20, 1] // minutes

const PaymentDetailPage = () => {
  const { id } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [paymentInfo, setPaymentInfo] = useState<TUserPaymentResponse>()

  useEffect(() => {
    if (!id) {
      return
    }
    const handleGetPaymentDetail = apolloWrapper(
      async () => {
        setLoading(true)
        const { data, error } = await client.query({
          query: PaymentUserHistoryDocument,
          variables: { paymentId: id.toString() },
        })

        if (error) {
          throw error
        }
        if (data) {
          setPaymentInfo(data.paymentUserHistory)
        }
      },
      { onFinally: () => setLoading(false) },
    )

    handleGetPaymentDetail()
  }, [id])

  useEffect(() => {
    const interval = setInterval(
      () => {
        if (currentStep < step.length) {
          setCurrentStep((prev) => prev + 1)
        } else {
          clearInterval(interval)
        }
      },
      MOCKED_TIME_STEPS[currentStep] * 1000 * 60,
    )

    return () => clearInterval(interval)
  }, [currentStep])

  return (
    <main className='bg-paper relative size-full overflow-x-hidden'>
      <SkeletonLoader
        loading={loading}
        className='bg-dark-600/10 mx-auto size-full min-h-[calc(100dvh-57px)] w-[1200px]'
      >
        {paymentInfo && (
          <>
            {paymentInfo.paymentMethod === EPaymentMethod.Cod ? (
              <div className='border-dark-600/30 shadow-container relative mx-auto flex size-full max-w-[1200px] items-start justify-center gap-10 border-x bg-white px-2 py-20 md:px-6 md:py-30 lg:px-10'>
                {/* progress */}
                <div className='flex h-full w-1/5 flex-col items-start'>
                  {step.map((item, index) => (
                    <div className='flex items-start gap-3' key={item.name}>
                      {/* step */}
                      <div className='text-14 flex flex-col items-center'>
                        <div
                          className={cn(
                            'rounded-full px-3.5 py-2 transition-colors',
                            currentStep >= index
                              ? 'bg-green-500 text-white'
                              : 'bg-dark-600/10',
                          )}
                        >
                          {index + 1}
                        </div>
                        <div
                          className={cn(
                            'relative h-25 w-1 overflow-hidden',
                            currentStep > index
                              ? 'bg-green-500'
                              : 'bg-dark-600/10',
                            index === step.length - 1 && 'hidden',
                          )}
                        >
                          <div
                            className={cn(
                              currentStep === index &&
                                'animate-loading-vertical h-3/5 w-full bg-green-500',
                            )}
                          />
                        </div>
                      </div>
                      <p className='font-shantell mt-1 font-semibold'>
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>

                {/* detail */}
                <div className='center relative flex h-full w-3/5 flex-col gap-10'>
                  <Link
                    href='/menu'
                    className='text-16 text-dark-600 font-shantell center absolute -top-20 right-0 ml-3 gap-3 font-semibold duration-300 hover:translate-x-3'
                  >
                    <p>Continue shopping</p>
                    <CaretRightIcon size={20} />
                  </Link>

                  <div className='center flex size-full flex-col gap-3'>
                    <div className='aspect-[798/313] h-60 w-auto'>
                      <Image
                        src={checkoutLoading}
                        alt='checkout-loading'
                        width={798}
                        height={313}
                        className='object-cover object-center'
                      />
                    </div>
                    <p className='text-23 md:text-28 font-shantell text-shadow-stroke-2 font-bold text-white'>
                      Your order is on the way!
                    </p>
                  </div>

                  <div className='from-dark-600/2 to-dark-600/2 via-dark-600/20 h-px w-full bg-gradient-to-r' />

                  <div className='flex w-full flex-col items-start gap-4'>
                    <div className='flex w-full items-center justify-between font-medium'>
                      <p className='text-dark-600 text-16'>
                        Transaction details
                      </p>
                      <p className='text-primary-500 text-18 font-bold lining-nums underline'>
                        #{id}
                      </p>
                    </div>

                    <div className='shadow-box border-dark-600/10 rounded-4 relative flex w-full flex-col items-start border bg-white p-6'>
                      <div className='flex w-full flex-col items-start gap-2'>
                        <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
                          <p>Payment method</p>
                          <p className='font-bold'>123123</p>
                        </div>
                        <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
                          <p>Invoice date</p>
                          <p className='font-bold'>123123312</p>
                        </div>
                      </div>

                      <div className='bg-dark-600/10 mt-4 h-px w-full' />

                      <div className='scrollbar-none relative size-full max-h-60 overflow-y-scroll'>
                        <div className='flex flex-col items-start gap-4 pt-4'>
                          {/* {paymentInfo.items.map((item) => (
                        <PaymentItem key={item.name} item={item} />
                      ))} */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <PaymentDetail data={paymentInfo} />
            )}
          </>
        )}
      </SkeletonLoader>
    </main>
  )
}

export default PaymentDetailPage
