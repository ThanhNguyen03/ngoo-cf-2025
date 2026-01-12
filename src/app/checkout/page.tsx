'use client'

import { Footer } from '@/components/layout/footer'
import { useEffect, useState } from 'react'
import { CheckoutDetails } from './_components/checkout-details'
import { CheckoutInfo } from './_components/checkout-info'
import { CheckoutProcess } from './_components/checkout-processing'

const CheckoutPage = () => {
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    document.body.classList.add('overflow-hidden!')

    return () => document.body.classList.remove('overflow-hidden!')
  }, [])

  return (
    <>
      <main className='overflow-hidden bg-white'>
        <CheckoutProcess loading={loading} />
        <div className='size-full px-2 py-10 md:gap-4 md:px-6 md:py-20 lg:px-10 lg:py-30'>
          <div className='mx-auto flex size-full min-h-screen max-w-[1200px] gap-4'>
            <CheckoutDetails />
            <CheckoutInfo setLoading={setLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
