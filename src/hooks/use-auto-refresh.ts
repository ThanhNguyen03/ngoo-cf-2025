import { REFRESH_GAP } from '@/constants'
import useAuthStore from '@/store/auth-store'
import { handleError } from '@/utils'
import { useApolloClient } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef } from 'react'

export const useAutoRefresh = () => {
  const apolloClient = useApolloClient()
  const { data: session, update, status } = useSession()
  const logout = useAuthStore((state) => state.logout)
  const getUserInfo = useAuthStore((state) => state.getUserInfo)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const runningRef = useRef(false)

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  // Store handleRefresh in a ref so schedule() can always call the latest version
  // without becoming a dependency of schedule itself — this breaks the circular
  // reference: handleRefresh → schedule → handleRefresh.
  const handleRefreshRef = useRef<(() => Promise<void>) | undefined>(undefined)

  const schedule = useCallback(
    (ms: number) => {
      clear()
      timeoutRef.current = setTimeout(() => {
        handleRefreshRef.current?.()
      }, ms)
    },
    [clear],
  )

  const handleRefresh = useCallback(async () => {
    if (!session || !session.accessToken || !session.accessTokenExpires) {
      return
    }

    if (session.error === 'RefreshAccessTokenError') {
      await logout() // Force sign in to resolve the error
      return
    }

    // Prevent double-refresh if a refresh is already running
    if (runningRef.current) {
      return
    }
    runningRef.current = true

    try {
      const now = Date.now()
      const expireAt = session.accessTokenExpires
      const timeLeft = expireAt - now

      // Still valid → reschedule for later
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
  }, [session, update, logout, schedule])

  // Keep the ref in sync with the latest handleRefresh
  handleRefreshRef.current = handleRefresh

  useEffect(() => {
    clear()

    if (!session || !session.accessToken || !session.accessTokenExpires) {
      return
    }

    const now = Date.now()
    const timeLeft = session.accessTokenExpires - now

    // Schedule first refresh attempt 60 s before expiry
    schedule(Math.max(1000, timeLeft - REFRESH_GAP))

    return clear
  }, [session, update, clear, schedule])

  // Clear timer on logout; fetch user info on login
  useEffect(() => {
    if (status === 'unauthenticated') {
      clear()
    }

    if (status === 'authenticated') {
      getUserInfo(false, apolloClient)
    }
    // getUserInfo is a stable Zustand action — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, clear])
}
