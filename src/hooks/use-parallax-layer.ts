import { useEffect, useMemo, useRef } from 'react'

type TParallaxConfig = { translateRatio?: number; scrollRatio?: number }

/**
 * If you return useRef, you will have to access `.current` manually and cannot assign refs to each element dynamically when rendering multiple components at once.
 * Callback ref allows you to assign refs directly to each element in JSX
 */
export function useParallaxLayer<T extends HTMLElement | SVGElement>(
  containerRef: React.RefObject<HTMLElement | null>,
  config: TParallaxConfig,
): (el: T | null) => void // return a single callback ref when config is an object

export function useParallaxLayer<T extends HTMLElement | SVGElement>(
  containerRef: React.RefObject<HTMLElement | null>,
  config: TParallaxConfig[],
): Array<(el: T | null) => void> // return array of callback ref when config is array

// Implementation
export function useParallaxLayer<T extends HTMLElement | SVGElement>(
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
    const container = containerRef.current
    if (!container) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      const containerRect = container.getBoundingClientRect()

      configs.forEach((cfg, i) => {
        const ref = refs.current[i]
        if (!ref || !cfg.translateRatio) {
          return
        }

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
          Math.sqrt(containerRect.width ** 2 + containerRect.height ** 2) / 2
        const ratio = 1 - Math.min(distance / maxDistance, 1)
        // Calculate distance to translate elements
        const offsetX = dx * ratio * (cfg.translateRatio / 100)
        const offsetY = dy * ratio * (cfg.translateRatio / 100)

        ref.style.setProperty('--parallax-mouse-x', `${offsetX}px`)
        ref.style.setProperty('--parallax-mouse-y', `${offsetY}px`)

        updateTransform(ref)
      })
    }

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      configs.forEach((cfg, i) => {
        const ref = refs.current[i]
        if (!ref || !cfg.scrollRatio) {
          return
        }

        // Check container visible or not
        if (containerRect.bottom < 0 || containerRect.top > viewportHeight) {
          return
        }

        const scrollPercent = (containerRect.top * 30) / viewportHeight
        const offsetY = scrollPercent * cfg.scrollRatio

        ref.style.setProperty('--parallax-scroll-y', `${offsetY}px`)
        updateTransform(ref)
      })
    }

    container.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, configs])

  const updateTransform = (el: HTMLElement | SVGElement) => {
    el.style.transform = `translate(
      var(--parallax-mouse-x, 0px),
      calc(var(--parallax-mouse-y, 0px) + var(--parallax-scroll-y, 0px))
    )`
  }

  const setRef = (idx: number) => (el: T | null) => {
    refs.current[idx] = el
  }

  return isArray ? configs.map((_, idx) => setRef(idx)) : setRef(0)
}
