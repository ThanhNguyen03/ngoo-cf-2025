import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * React hook to manage a persistent cooldown timer using `localStorage`.
 *
 * The cooldown value is stored as an absolute end timestamp (in milliseconds)
 * in `localStorage`, allowing the cooldown to persist across:
 * - Page reloads
 * - Tab refreshes
 * - Browser restarts
 *
 * @param key - Unique key used to store the cooldown end time in `localStorage`
 * @param defaultSeconds - Cooldown duration (in seconds) when `startCooldown` is called
 *
 * @returns A readonly tuple:
 * - `cooldown`: Remaining cooldown time in seconds (0 if inactive)
 * - `startCooldown`: Function to start/reset the cooldown using `defaultSeconds`
 * - `clearCooldown`: Function to clear the cooldown
 *
 * @example
 * ```ts
 * const [cooldown, startCooldown] = useCooldown('resend-otp', 60); // 60 seconds
 *
 * <button
 *   disabled={cooldown > 0}
 *   onClick={startCooldown}
 * >
 *   {cooldown > 0 ? `Retry in ${cooldown}s` : 'Resend OTP'}
 * </button>
 * ```
 *
 * @remarks
 * - This hook assumes a browser environment (uses `localStorage`)
 * - Not safe to call during SSR without a guard
 * - Multiple tabs will share the same cooldown state
 */
export const useCooldown = (key: string, defaultSeconds: number) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const endTimeRef = useRef<number>(0)

  const [cooldown, setCooldown] = useState<number>(0)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedEndTime = localStorage.getItem(key)
    if (savedEndTime) {
      const endTime = +savedEndTime
      const remaining = Math.max(Math.floor((endTime - Date.now()) / 1000), 0)
      if (remaining > 0) {
        setCooldown(remaining)
        endTimeRef.current = endTime
      } else {
        localStorage.removeItem(key)
      }
    }
  }, [key])

  useEffect(() => {
    if (intervalRef.current) {
      return
    }

    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) {
        setCooldown(0)
        return
      }
      const remaining = Math.max(
        Math.floor((endTimeRef.current - Date.now()) / 1000),
        0,
      )
      setCooldown(remaining)
      if (remaining <= 0) {
        localStorage.removeItem(key)
        endTimeRef.current = 0
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [key])

  const startCooldown = useCallback(() => {
    const endTime = Date.now() + defaultSeconds * 1000
    localStorage.setItem(key, endTime.toString())
    endTimeRef.current = endTime
    setCooldown(defaultSeconds)
  }, [defaultSeconds, key])

  const clearCooldown = useCallback(() => {
    localStorage.removeItem(key)
    endTimeRef.current = 0
    setCooldown(0)
  }, [key])

  return [cooldown, startCooldown, clearCooldown] as const
}
