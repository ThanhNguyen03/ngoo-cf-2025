import { createLogger } from '@/lib/logger'
import { getSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'
import { TPaymentSocketResponse } from './graphql/generated/graphql'

const logger = createLogger('SocketClient')

let socket: Socket | null = null
let listeningOrderId: string | null = null

export const getSocketClient = async (): Promise<Socket> => {
  if (socket) {
    return socket
  }

  const session = await getSession()
  if (!session?.accessToken) {
    throw new Error('No accessToken')
  }

  socket = io(process.env.NGOO_BACKEND_API!, {
    transports: ['websocket'],
    auth: {
      token: session.accessToken,
    },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }
}

export const connectPaymentSocket = async (
  orderId: string,
  callback: (data: TPaymentSocketResponse) => Promise<void> | void,
): Promise<boolean> => {
  let socketClient
  try {
    socketClient = await getSocketClient()
  } catch (err) {
    // Failed to get socket client — likely missing auth token
    logger.error({ err }, 'Failed to connect payment socket')
    return false
  }

  if (listeningOrderId === orderId) {
    return true
  }

  // cleanup old listener
  socketClient.removeAllListeners('paymentStatus')
  listeningOrderId = orderId

  const handler = async (data: TPaymentSocketResponse) => {
    if (data.orderId === orderId) {
      await callback(data)
      socketClient.off('paymentStatus', handler)
      listeningOrderId = null
    }
  }

  socketClient.on('paymentStatus', handler)
  logger.info({ orderId }, 'Payment socket connected')
  return true
}
