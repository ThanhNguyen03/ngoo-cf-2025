import { getSession } from 'next-auth/react'
import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

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
  socket?.disconnect()
  socket = null
}
