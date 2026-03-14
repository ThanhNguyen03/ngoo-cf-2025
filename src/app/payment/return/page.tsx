'use client'

import { createLogger } from '@/lib/logger'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

const logger = createLogger('PayPalReturn')

const PaypalReturn = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const hasProcessed = useRef<boolean>(false) // Prevent multiple executions

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current || !token) {
      return
    }

    hasProcessed.current = true

    const handlePayment = async () => {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(
            {
              type: 'PAYPAL_RETURN',
              timestamp: Date.now(),
            },
            window.location.origin,
          )
        }

        // Đóng popup sau 100ms để message kịp gửi
        setTimeout(() => {
          window.close()
        }, 100)
      } catch (error) {
        logger.error({ err: error }, 'PayPal return handler failed')
        window.close()
      }
    }

    handlePayment()
  }, [token])

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='max-w-md rounded-lg p-8 text-center'>
        <p className='text-gray-600'>
          Please wait while we process your PayPal payment...
        </p>
      </div>
    </div>
  )
}

export default PaypalReturn
