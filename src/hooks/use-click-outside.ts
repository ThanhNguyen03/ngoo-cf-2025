import { useEffect, useRef } from 'react'

export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
) => {
  const ref = useRef<T | null>(null)

  // Store callback in a ref so the effect never goes stale when callback changes.
  // This avoids re-registering event listeners on every parent render while still
  // always calling the latest version of the callback.
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callbackRef.current()
      }
    }

    document.addEventListener('click', handleClick)
    // passive: true allows the browser to optimise scroll performance
    document.addEventListener('touchstart', handleClick, { passive: true })

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
  }, []) // empty deps — handleClick always reads from callbackRef

  return { ref }
}
