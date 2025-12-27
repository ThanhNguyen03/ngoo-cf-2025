import { TPaymentSocketResponse } from '@/lib/graphql/generated/graphql'
import { disconnectSocket, getSocketClient } from '@/lib/socket-client'
import { useEffect } from 'react'
import { Socket } from 'socket.io-client'

export const usePaymentSocket = (
  // orderId: string,
  callback: (data: TPaymentSocketResponse) => void,
) => {
  useEffect(() => {
    let socket: Socket

    const init = async () => {
      socket = await getSocketClient()

      socket.on('paymentStatus', (data: TPaymentSocketResponse) => {
        // if (data.orderId === orderId) {
        //   callback(data)
        // }
        console.log('socket receive', data)
      })
    }

    init()

    return () => {
      if (socket) {
        socket.off('paymentStatus')
      }
    }
  }, [callback])

  useEffect(() => {
    return () => {
      disconnectSocket()
    }
  }, [])
}
