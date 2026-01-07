import { useEffect, useRef } from 'react'

export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
) => {
  const ref = useRef<T | null>(null)

  const handleClick = (e: MouseEvent | TouchEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    document.addEventListener('touchstart', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('touchstart', handleClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback])

  return { ref }
}
