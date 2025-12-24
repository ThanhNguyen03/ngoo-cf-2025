import { TPaymentSocketResponse } from '@/lib/graphql/generated/graphql'
import useAuthStore from '@/store/auth-store'
import { useEffect, useRef } from 'react'
import { io, Socket } from 'socket.io-client'

export const usePaymentSocket = (
  orderId: string,
  callback: (data: TPaymentSocketResponse) => void,
) => {
  const userId = useAuthStore((state) => state.userInfo?.uuid)
  const socketRef = useRef<Socket | undefined>(undefined)

  useEffect(() => {
    if (!userId) {
      return
    }

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId },
    })

    socketRef.current.on('paymentStatus', (data: TPaymentSocketResponse) => {
      if (data.orderId === orderId) {
        callback(data)
      }
    })

    return () => {
      socketRef.current?.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, userId])
}
