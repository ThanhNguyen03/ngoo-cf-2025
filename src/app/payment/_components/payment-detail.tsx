import { SwitchButton } from '@/components/ui'
import {
  EPaymentStatus,
  TUserPaymentResponse,
} from '@/lib/graphql/generated/graphql'
import { cn } from '@/utils'
import { CheckCircleIcon, XCircleIcon } from '@phosphor-icons/react/dist/ssr'
import { FC } from 'react'
import { PaymentItem } from './payment-item'

type TPaymentDetailProps = {
  data: TUserPaymentResponse
}
export const PaymentDetail: FC<TPaymentDetailProps> = ({ data }) => {
  return (
    <div className='border-dark-600/30 relative mx-auto flex size-full min-h-[calc(100dvh-57px)] max-w-[640px] flex-col gap-10 overflow-x-hidden border-x bg-white px-2 py-5 md:px-6 lg:px-10'>
      {/* status */}
      <div className='center flex w-full flex-col gap-6'>
        <div className='center relative size-40 w-full'>
          <div
            className={cn(
              'absolute left-1/2 size-40 -translate-x-1/2 animate-[ping_1.25s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full',
              data.status === EPaymentStatus.Success
                ? 'bg-green-200/20'
                : 'bg-red-200/20',
            )}
          />
          <div
            className={cn(
              'absolute left-1/2 size-20 -translate-x-1/2 animate-[ping_0.75s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full',
              data.status === EPaymentStatus.Success
                ? 'bg-green-200/20'
                : 'bg-red-500/30',
            )}
          />
          {data.status === EPaymentStatus.Success ? (
            <CheckCircleIcon
              weight='fill'
              size={60}
              className='absolute left-1/2 -translate-x-1/2 text-green-500'
            />
          ) : (
            <XCircleIcon
              weight='fill'
              size={60}
              className='text-cherry-300 absolute left-1/2 -translate-x-1/2'
            />
          )}
        </div>
        <div className='center flex flex-col gap-3'>
          <h2
            className={cn(
              'text-23 md:text-28 font-shantell text-shadow-stroke-2 font-bold -tracking-[0.32px]',
              data.status === EPaymentStatus.Success
                ? 'text-kiwi-400'
                : 'text-cherry-100',
            )}
          >
            Payment{' '}
            {data.status === EPaymentStatus.Success ? 'successful' : 'failed'}
          </h2>
          <p className='text-16 text-dark-600 font-medium'>
            {data.status === EPaymentStatus.Success
              ? 'Thank you for your purchase!'
              : 'Try again or purchase new order!'}
          </p>
        </div>

        <div className='flex w-full items-center justify-center gap-4'>
          <SwitchButton
            className='rounded-3! w-fit font-semibold text-nowrap'
            variant='white'
            href='/profile/?tab=activity'
          >
            Back to History
          </SwitchButton>
          {data.status === EPaymentStatus.Success ? (
            <SwitchButton
              className='rounded-3! w-fit font-semibold text-nowrap'
              variant='green'
              href='/menu'
            >
              Continue Shopping
            </SwitchButton>
          ) : (
            <SwitchButton
              className='rounded-3! w-fit px-12 font-semibold text-nowrap'
              variant='pink'
              href='/menu'
            >
              Retry
            </SwitchButton>
          )}
        </div>
      </div>

      <div className='from-dark-600/2 to-dark-600/2 via-dark-600/20 h-px w-full bg-gradient-to-r' />

      <div className='flex w-full flex-col items-start gap-4'>
        <div className='flex w-full items-center justify-between font-medium'>
          <p className='text-dark-600 text-16'>Transaction details</p>
          <p className='text-primary-500 text-18 font-bold lining-nums underline'>
            #{data.paymentId}
          </p>
        </div>

        <div className='shadow-box border-dark-600/10 rounded-4 relative flex w-full flex-col items-start border bg-white p-6'>
          <div className='flex w-full flex-col items-start gap-2'>
            <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
              <p>Payment method</p>
              <p className='font-bold'>{data.paymentMethod}</p>
            </div>
            <div className='text-16 text-dark-600 flex w-full items-center justify-between'>
              <p>Invoice date</p>
              <p className='font-bold'>{data.updatedAt}</p>
            </div>
          </div>

          <div className='bg-dark-600/10 mt-4 h-px w-full' />

          <div className='scrollbar-none relative size-full max-h-60 overflow-y-scroll'>
            <div className='flex flex-col items-start gap-4 pt-4'>
              {data.items.map((item) => (
                <PaymentItem key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>

        <div className='shadow-box border-dark-600/10 rounded-4 text-16 text-dark-600 relative flex w-full items-center justify-between border bg-white p-6'>
          <p>Discount</p>
          <p className='font-shantell font-bold'>$0</p>
        </div>

        <div className='shadow-box border-dark-600/10 rounded-4 text-16 relative flex w-full items-center justify-between border bg-white p-6 font-bold'>
          <p className='text-dark-600'>Total cost</p>
          <p className='font-shantell text-green-500'>${data.totalPrice}</p>
        </div>
      </div>
    </div>
  )
}
