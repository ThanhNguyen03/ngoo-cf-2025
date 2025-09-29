import { useEffect, useState } from 'react'

export const useIsHydrated = () => {
  const [hydrated, setHydrated] = useState<boolean>(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
