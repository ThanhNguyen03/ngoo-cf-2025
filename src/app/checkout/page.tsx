'use client'

import { useState } from 'react'
import { CheckoutDetails } from './_components/checkout-details'
import { CheckoutInfo } from './_components/checkout-info'

const CheckoutPage = () => {
  const [totalCartPrice, setTotalCartPrice] = useState<number>(0)

  return (
    <main className='overflow-hidden bg-white'>
      <div className='size-full px-2 py-10 md:gap-4 md:px-6 md:py-20 lg:px-10 lg:py-30'>
        <div className='mx-auto flex size-full min-h-screen max-w-[1200px] gap-4'>
          <CheckoutDetails setTotalCartPrice={setTotalCartPrice} />
          <CheckoutInfo totalCartPrice={totalCartPrice} />
        </div>
      </div>
    </main>
  )
}

export default CheckoutPage
