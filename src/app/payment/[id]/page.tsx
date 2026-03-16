'use client'

import { checkoutLoading } from '@/assets/images'
import { SkeletonLoader } from '@/components/ui'
import { client } from '@/lib/apollo-client'
import {
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
  GetUserOrderDocument,
  PaymentUserHistoryDocument,
  TUserPaymentResponse,
} from '@/lib/graphql/generated/graphql'
import { createLogger } from '@/lib/logger'
import { connectPaymentSocket } from '@/lib/socket-client'
import { apolloWrapper, cn } from '@/utils'

const logger = createLogger('PaymentDetail')
import {
  ArrowSquareOutIcon,
  CaretRightIcon,
} from '@phosphor-icons/react/dist/ssr'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { PaymentDetail } from '../_components/payment-detail'
import { PaymentItem } from '../_components/payment-item'

const step = [
  { name: 'Order accepted' },
  { name: 'Order preparing' },
  { name: 'Delivering' },
  { name: 'Success' },
]

// Map BE order status enum values to visual step indices
const ORDER_STATUS_TO_STEP: Record<EOrderStatus, number> = {
  [EOrderStatus.Created]: 0,
  [EOrderStatus.Pending]: 1,
  [EOrderStatus.Paid]: 2,
  [EOrderStatus.Completed]: 3,
  [EOrderStatus.Cancelled]: -1,
  [EOrderStatus.Failed]: -1,
}


const PaymentDetailPage = () => {
  const { id } = useParams()

  const [loading, setLoading] = useState<boolean>(true)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [paymentInfo, setPaymentInfo] = useState<TUserPaymentResponse>()
  const [isError, setIsError] = useState<boolean>(false)

  const paymentId = id?.toString() ?? ''

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchPaymentInfo = useCallback(
    apolloWrapper(
      async () => {
        setLoading(true)
        const { data, error } = await client.query({
          query: PaymentUserHistoryDocument,
          variables: { paymentId },
          fetchPolicy: 'network-only',
        })
        if (error) throw error
        if (data) {
          setPaymentInfo(data.paymentUserHistory)
        }
      },
      { onFinally: () => setLoading(false) },
    ),
    [paymentId],
  )

  useEffect(() => {
    if (!paymentId) return

    // Validate payment ID to prevent unexpected characters reaching the API.
    // IDs are alphanumeric UUIDs — reject anything else.
    if (!/^[a-zA-Z0-9-]+$/.test(paymentId)) {
      setIsError(true)
      setLoading(false)
      return
    }

    fetchPaymentInfo()
  }, [paymentId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch the associated order to get real-time status for the COD progress bar.
  // Uses the payment's orderId (not paymentId) for the GetUserOrder query.
  useEffect(() => {
    if (!paymentInfo?.orderId) return
    if (paymentInfo.paymentMethod !== EPaymentMethod.Cod) return

    const fetchOrderStatus = apolloWrapper(async () => {
      const { data, error } = await client.query({
        query: GetUserOrderDocument,
        variables: { orderId: paymentInfo.orderId },
        fetchPolicy: 'network-only',
      })
      if (error) throw error
      if (data) {
        const stepIndex = ORDER_STATUS_TO_STEP[data.getUserOrder.orderStatus]
        if (stepIndex >= 0) {
          setCurrentStep(stepIndex)
        } else {
          // Cancelled or failed — jump to end to stop animation
          setCurrentStep(step.length)
        }
      }
    })

    fetchOrderStatus()
  }, [paymentInfo?.orderId, paymentInfo?.paymentMethod])

  // Subscribe to real-time payment status updates via Socket.IO.
  // On status change, refetch payment info to get the latest data.
  useEffect(() => {
    if (!paymentInfo?.orderId) return
    if (paymentInfo.status !== EPaymentStatus.Processing) return

      const setupSocket = async () => {
      const connected = await connectPaymentSocket(
        paymentInfo.orderId,
        async (socketData) => {
          if (socketData.orderId !== paymentInfo.orderId) return
          if (socketData.status !== EPaymentStatus.Processing) {
            // Refetch to get updated payment info and display final state
            await fetchPaymentInfo()
          }
        },
      )

      if (!connected) {
        logger.error('Failed to connect to payment socket')
      }
    }

    setupSocket()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentInfo?.orderId, paymentInfo?.status])

  return (
    <main className='bg-paper relative size-full overflow-x-hidden'>
      <SkeletonLoader
        loading={loading}
        className='bg-dark-600/10 mx-auto size-full min-h-[calc(100dvh-57px)] w-full max-w-[1200px]'
      >
        {isError && (
          <div className='center min-h-[calc(100dvh-57px)] flex-col gap-4'>
            <p className='text-18 text-dark-600 font-medium'>
              Invalid payment ID
            </p>
            <Link href='/menu' className='text-primary-500 underline'>
              Back to menu
            </Link>
          </div>
        )}

        {paymentInfo && (
          <>
            {paymentInfo.paymentMethod === EPaymentMethod.Cod ? (
              <div className='border-dark-600/30 shadow-container relative mx-auto flex size-full max-w-[1200px] flex-col items-start justify-center gap-10 border-x bg-white px-2 py-20 md:flex-row md:px-6 md:py-30 lg:px-10'>
                {/* Mobile horizontal progress indicator */}
                <div className='flex w-full items-center justify-between md:hidden'>
                  {step.map((item, index) => (
                    <div key={item.name} className='flex items-center'>
                      <div
                        className={cn(
                          'text-14 flex size-8 items-center justify-center rounded-full',
                          currentStep >= index
                            ? 'bg-green-500 text-white'
                            : 'bg-dark-600/10',
                        )}
                      >
                        {index + 1}
                      </div>
                      {index < step.length - 1 && (
                        <div
                          className={cn(
                            'mx-1 h-1 w-8 sm:w-12',
                            currentStep > index
                              ? 'bg-green-500'
                              : 'bg-dark-600/10',
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Desktop vertical progress steps */}
                <div className='hidden h-full w-1/5 flex-col items-start md:flex'>
                  {step.map((item, index) => (
                    <div className='flex items-start gap-3' key={item.name}>
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
                <div className='center relative h-full w-full flex-col gap-10 md:w-3/5'>
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
                          <p className='font-bold'>
                            {paymentInfo.paymentMethod}
                          </p>
                        </div>
                        <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
                          <p>Invoice date</p>
                          <p className='font-bold'>
                            {dayjs(paymentInfo.createdAt).format(
                              'HH:mm - DD/MM/YYYY',
                            )}
                          </p>
                        </div>
                      </div>

                      <div className='bg-dark-600/10 mt-4 h-px w-full' />

                      <div className='scrollbar-none relative size-full max-h-60 overflow-y-scroll'>
                        <div className='flex flex-col items-start gap-4 pt-4'>
                          {paymentInfo.items.map((item) => (
                            <PaymentItem key={item?.name} item={item!} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : paymentInfo.paymentMethod === EPaymentMethod.Crypto ? (
              // Crypto payment detail — shows blockchain info
              // txHash is available on TPaymentResponse (admin) but not TUserPaymentResponse.
              // When the BE user payment query is extended to include txHash, add the link here.
              <div className='border-dark-600/30 relative mx-auto flex size-full max-w-[640px] flex-col items-center gap-10 border-x bg-white px-2 py-20 md:px-6 md:py-30 lg:px-10'>
                <PaymentDetail data={paymentInfo} />

                <div className='shadow-box border-dark-600/10 rounded-4 flex w-full items-center justify-between border bg-white p-6'>
                  <div className='flex flex-col gap-1'>
                    <p className='text-14 text-dark-600/60 font-medium'>
                      Blockchain
                    </p>
                    <p className='text-16 font-bold text-orange-500'>
                      Sepolia Testnet
                    </p>
                  </div>
                  {/* View on Etherscan — enabled once BE exposes txHash on user payment response */}
                  <ArrowSquareOutIcon size={14} className='text-dark-600/30' />
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
