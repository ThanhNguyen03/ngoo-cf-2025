import { useEffect, useMemo, useRef } from 'react'

type TParallaxConfig = { translateRatio: number }

/**
 * If you return useRef, you will have to access `.current` manually and cannot assign refs to each element dynamically when rendering multiple components at once.
 * Callback ref allows you to assign refs directly to each element in JSX
 */
export function useParallaxLayer<T extends HTMLElement>(
  containerRef: React.RefObject<HTMLElement | null>,
  config: TParallaxConfig,
): (el: T | null) => void // return a single callback ref when config is an object

export function useParallaxLayer<T extends HTMLElement>(
  containerRef: React.RefObject<HTMLElement | null>,
  config: TParallaxConfig[],
): Array<(el: T | null) => void> // return array of callback ref when config is array

// Implementation
export function useParallaxLayer<T extends HTMLElement>(
  containerRef: React.RefObject<HTMLElement | null>,
  config: TParallaxConfig | TParallaxConfig[],
) {
  const isArray = Array.isArray(config)
  const configs = useMemo(
    () => (isArray ? config : [config]),
    [config, isArray],
  )
  const refs = useRef<(T | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) {
        return
      }
      const containerRect = containerRef.current.getBoundingClientRect()
      configs.forEach((cfg, i) => {
        const ref = refs.current[i]
        if (ref) {
          const rect = ref.getBoundingClientRect()
          // Calculate center of element
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          // Calculate distance from pointer to center of element
          const dx = e.clientX - centerX
          const dy = e.clientY - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          // Calculate max distance of container
          const maxDistance =
            Math.sqrt(
              Math.pow(containerRect.width, 2) +
                Math.pow(containerRect.height, 2),
            ) / 2

          const ratio = 1 - Math.min(distance / maxDistance, 1)
          // Calculate distance to translate elements
          const offsetX = dx * ratio * (cfg.translateRatio / 100)
          const offsetY = dy * ratio * (cfg.translateRatio / 100)
          ref.style.transform = `translate(${offsetX}px, ${offsetY}px)`
        }
      })
    }
    const container = containerRef.current
    container?.addEventListener('mousemove', handleMouseMove)
    return () => container?.removeEventListener('mousemove', handleMouseMove)
  }, [containerRef, configs])

  const setRef = (idx: number) => (el: T | null) => {
    refs.current[idx] = el
  }

  return isArray ? configs.map((_, idx) => setRef(idx)) : setRef(0)
}
