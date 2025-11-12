import useAuthStore from '@/store/auth-store'
import { handleError } from '@/utils'
import { useSession } from 'next-auth/react'
import { useEffect, useRef } from 'react'

export const useAutoRefresh = () => {
  const { data: session, update } = useSession()
  const logout = useAuthStore((state) => state.logout)

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ongoingRef = useRef<boolean>(false)

  useEffect(() => {
    if (!session || !session.accessToken || !session.accessTokenExpires) {
      return
    }
    const refreshToken = async () => {
      if (!session.accessTokenExpires) {
        return
      }
      // requesting → skip
      if (ongoingRef.current) {
        return
      }
      ongoingRef.current = true
      try {
        const now = Date.now()

        // If token expired time > 60 seconds → return
        if (session.accessTokenExpires - now > 60 * 1000) {
          return
        }

        // Trigger jwt callback
        await update()
      } catch (err) {
        handleError(err, 'Failed to refresh session')
        await logout()
      } finally {
        ongoingRef.current = false
      }
    }

    const tick = async () => {
      // If browser tab inactive → return
      if (!document.hidden) {
        await refreshToken()
      }
    }

    // interval 30s
    intervalRef.current = setInterval(async () => await tick(), 30 * 1000)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, update])
}
