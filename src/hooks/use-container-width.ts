import { useCallback, useLayoutEffect, useState } from 'react'

export function useContainerWidth<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>
): number {
  const [width, setWidth] = useState<number>(0)

  const updateWidth = useCallback(() => {
    if (!ref) {
      return
    }

    if (ref.current) {
      setWidth(ref.current.offsetWidth)
    }
  }, [ref])

  useLayoutEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)

    return () => window.removeEventListener('resize', updateWidth)
  }, [updateWidth])

  return width
}
