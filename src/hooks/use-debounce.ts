import { useEffect, useState } from 'react'

/**
 * A custom hook that debounces a value.
 *
 * @param value The value to be debounced
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
