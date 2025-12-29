import { CheckCircleIcon } from '@phosphor-icons/react/dist/ssr'

const PaymentPage = () => {
  return (
    <main className='bg-paper relative min-h-screen overflow-x-hidden px-2 md:px-6 lg:px-10'>
      <div className='mx-auto flex w-full max-w-[640px] flex-col gap-10 py-10'>
        {/* status */}
        <div className='center flex w-full flex-col gap-6'>
          <div className='center relative size-40 w-full'>
            <div className='absolute left-1/2 size-40 -translate-x-1/2 animate-[ping_1.25s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-200/20' />
            <div className='absolute left-1/2 size-20 -translate-x-1/2 animate-[ping_0.75s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-green-500/30' />
            <CheckCircleIcon
              weight='fill'
              size={60}
              className='absolute left-1/2 -translate-x-1/2 text-green-500'
            />
          </div>
          <div className='center flex flex-col gap-3'>
            <h2 className='text-23 md:text-28 font-shantell text-shadow-stroke-2 font-bold -tracking-[0.32px] text-white'>
              Payment successful
            </h2>
            <p className='text-16 text-dark-600 font-medium'>
              Thank you for your purchase!
            </p>
          </div>
        </div>

        <div className='shadow-container border-dark-600/10 rounded-4 h-full w-full border bg-white p-4'>
          123
        </div>
      </div>
    </main>
  )
}

export default PaymentPage
