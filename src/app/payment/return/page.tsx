'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

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
      window.close()
      return
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
