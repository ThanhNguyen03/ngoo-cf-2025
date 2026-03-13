'use client'

import { Footer } from '@/components/layout/footer'
import { useCooldown } from '@/hooks'
import { TCryptoPaymentProof } from '@/lib/graphql/generated/graphql'
import { useEffect, useState } from 'react'
import { CheckoutDetails } from './_components/checkout-details'
import { CheckoutInfo } from './_components/checkout-info'
import { CheckoutCryptoProcessing } from './_components/checkout-crypto-processing'
import { CheckoutProcess } from './_components/checkout-processing'

// Discriminated union: PayPal uses url, Crypto uses cryptoProof, COD redirects immediately
type TCheckoutData = {
  url?: string
  orderId: string
  cryptoProof?: TCryptoPaymentProof
}

const PROCESSING_COOLDOWN_SECOND = 10 * 60 // 10 minutes
const CheckoutPage = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [checkoutData, setCheckoutData] = useState<TCheckoutData>()

  const cooldownHook = useCooldown(
    'checkout-processing-cooldown',
    PROCESSING_COOLDOWN_SECOND,
  )

  useEffect(() => {
    if (loading) {
      document.body.classList.add('overflow-hidden!')
    }
    return () => document.body.classList.remove('overflow-hidden!')
  }, [loading])

  return (
    <>
      <main className='overflow-hidden bg-white'>
        {/* PayPal processing overlay */}
        {checkoutData?.url && (
          <CheckoutProcess
            isProcessing={loading}
            cooldownHook={cooldownHook}
            setIsProcessing={setLoading}
            checkoutData={{ url: checkoutData.url, orderId: checkoutData.orderId }}
          />
        )}

        {/* Crypto on-chain payment processing */}
        {checkoutData?.cryptoProof && (
          <CheckoutCryptoProcessing
            orderId={checkoutData.orderId}
            cryptoProof={checkoutData.cryptoProof}
          />
        )}

        <div className='size-full px-2 py-10 md:gap-4 md:px-6 md:py-20 lg:px-10 lg:py-30'>
          <div className='mx-auto flex size-full max-w-[1200px] gap-4'>
            <CheckoutDetails />
            <CheckoutInfo
              setLoading={setLoading}
              startProcessTimeout={cooldownHook.startCooldown}
              getCheckoutData={setCheckoutData}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CheckoutPage
