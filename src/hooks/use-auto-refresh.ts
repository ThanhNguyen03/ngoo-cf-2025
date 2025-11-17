import { REFRESH_GAP } from '@/constants'
import useAuthStore from '@/store/auth-store'
import { handleError } from '@/utils'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef } from 'react'

export const useAutoRefresh = () => {
  const { data: session, update, status } = useSession()
  const logout = useAuthStore((state) => state.logout)
  const getUserInfo = useAuthStore((state) => state.getUserInfo)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const runningRef = useRef(false)

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const schedule = (ms: number) => {
    clear()
    timeoutRef.current = setTimeout(handleRefresh, ms)
  }

  const handleRefresh = useCallback(async () => {
    if (!session || !session.accessToken || !session.accessTokenExpires) {
      return
    }

    if (session.error === 'RefreshAccessTokenError') {
      logout() // Force sign in to hopefully resolve error
      return
    }

    // avoid double refresh
    if (runningRef.current) {
      return
    }
    runningRef.current = true

    try {
      const now = Date.now()
      const expireAt = session.accessTokenExpires
      const timeLeft = expireAt - now

      //  Still valid → reschedule
      if (timeLeft > REFRESH_GAP) {
        schedule(timeLeft - REFRESH_GAP)
        return
      }
      await update()
    } catch (err) {
      handleError(err, 'Failed to refresh token')
      await logout()
    } finally {
      runningRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, update, logout])

  useEffect(() => {
    clear()

    if (!session || !session.accessToken || !session.accessTokenExpires) {
      return
    }

    const now = Date.now()
    const timeLeft = session.accessTokenExpires - now

    // schedule first refresh attempt: 60s before expiry
    schedule(Math.max(1000, timeLeft - REFRESH_GAP))

    return clear
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, update])

  // clear when logout
  useEffect(() => {
    if (status === 'unauthenticated') {
      clear()
    }

    if (status === 'authenticated') {
      getUserInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])
}
