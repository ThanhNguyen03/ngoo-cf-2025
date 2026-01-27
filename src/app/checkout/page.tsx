'use client'

import { Footer } from '@/components/layout/footer'
import { useCooldown } from '@/hooks'
import { useEffect, useState } from 'react'
import { CheckoutDetails } from './_components/checkout-details'
import { CheckoutInfo } from './_components/checkout-info'
import { CheckoutProcess } from './_components/checkout-processing'

const PROCESSING_COOLDOWN_SECOND = 10 * 60 // 10 minutes
const CheckoutPage = () => {
  const [loading, setLoading] = useState<boolean>(false)

  const [processingCooldown, startProcessingCooldown] = useCooldown(
    'processing-cooldown',
    PROCESSING_COOLDOWN_SECOND,
  )

  useEffect(() => {
    document.body.classList.add('overflow-hidden!')

    return () => document.body.classList.remove('overflow-hidden!')
  }, [])

  return (
    <>
      <main className='overflow-hidden bg-white'>
        <CheckoutProcess
          isProcessing={loading}
          processingTimeout={processingCooldown}
          setIsProcessing={setLoading}
        />
        <div className='size-full px-2 py-10 md:gap-4 md:px-6 md:py-20 lg:px-10 lg:py-30'>
          <div className='mx-auto flex size-full min-h-screen max-w-[1200px] gap-4'>
            <CheckoutDetails />
            <CheckoutInfo
              setLoading={setLoading}
              startProcessTimeout={startProcessingCooldown}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
