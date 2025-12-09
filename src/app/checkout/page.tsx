'use client'

import { CheckoutDetails } from './_components/checkout-details'
import { CheckoutInfo } from './_components/checkout-info'

const CheckoutPage = () => {
  return (
    <main className='overflow-hidden bg-white'>
      <div className='size-full px-2 py-10 md:gap-4 md:px-6 md:py-20 lg:px-10 lg:py-30'>
        <div className='mx-auto flex size-full min-h-screen max-w-[1200px] gap-4'>
          <CheckoutDetails />
          <CheckoutInfo />
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
