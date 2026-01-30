import { useCallback, useEffect, useRef } from 'react'

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
  const displayElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedEndTime = localStorage.getItem(key)
    if (savedEndTime) {
      const endTime = +savedEndTime
      const remaining = Math.max(Math.floor((endTime - Date.now()) / 1000), 0)

      if (remaining > 0) {
        endTimeRef.current = endTime
        startInterval()
      } else {
        localStorage.removeItem(key)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // Format time
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Update DOM element
  const updateDisplay = useCallback(
    (seconds: number) => {
      if (displayElementRef.current) {
        displayElementRef.current.textContent = formatTime(seconds)
      }
    },
    [formatTime],
  )

  // Start interval
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      const remaining = endTimeRef.current
        ? Math.max(Math.floor((endTimeRef.current - Date.now()) / 1000), 0)
        : 0

      updateDisplay(remaining)

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        localStorage.removeItem(key)
        endTimeRef.current = 0
      }
    }, 1000)
  }, [key, updateDisplay])

  // Start cooldown
  const startCooldown = useCallback(() => {
    const endTime = Date.now() + defaultSeconds * 1000
    localStorage.setItem(key, endTime.toString())
    endTimeRef.current = endTime

    updateDisplay(defaultSeconds)
    startInterval()
  }, [defaultSeconds, key, updateDisplay, startInterval])

  // Clear cooldown
  const clearCooldown = useCallback(() => {
    localStorage.removeItem(key)
    endTimeRef.current = 0

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    updateDisplay(0)
  }, [key, updateDisplay])

  // Register display element
  const registerDisplay = useCallback(
    (element: HTMLElement | null) => {
      displayElementRef.current = element
      if (element && endTimeRef.current) {
        const remaining = Math.max(
          Math.floor((endTimeRef.current - Date.now()) / 1000),
          0,
        )
        updateDisplay(remaining)
      }
    },
    [updateDisplay],
  )

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return {
    startCooldown,
    clearCooldown,
    registerDisplay,
    getCurrent: () =>
      endTimeRef.current
        ? Math.max(Math.floor((endTimeRef.current - Date.now()) / 1000), 0)
        : 0,
  }
}
