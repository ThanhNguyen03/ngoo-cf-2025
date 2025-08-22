import { useEffect, useMemo, useRef } from 'react'

type TParallaxConfig = {
  /** Percentage ratio for element translation on mouse move (e.g. 10 → 10% effect strength). */
  translateRatio?: number
  /** Ratio for element translation based on scroll position (positive = down, negative = up). */
  scrollRatio?: number
}

/**
 * React hook to apply **parallax translation effects** (mouse-based and scroll-based)
 * on one or multiple child layers inside a container.
 *
 * - Supports both **mousemove parallax** (using `translateRatio`) and
 *   **scroll parallax** (using `scrollRatio`).
 * - Automatically applies CSS variables (`--parallax-mouse-x`, `--parallax-mouse-y`, `--parallax-scroll-y`)
 *   which are used in `transform: translate(...)`.
 * - Works with both a **single element** or **multiple elements** (array of configs).
 *
 * @overload
 * @param containerRef - React ref to the parallax container element.
 * @param config - Single config object (`translateRatio` / `scrollRatio`).
 * @returns A **single callback ref** to assign to one element.
 *
 * @overload
 * @param containerRef - React ref to the parallax container element.
 * @param config - Array of config objects.
 * @returns An **array of callback refs**, each assigned to a different element.
 *
 * @example
 * // Single element
 * const containerRef = useRef<HTMLDivElement>(null)
 * const layerRef = useParallaxLayer(containerRef, { translateRatio: 20, scrollRatio: 5 })
 *
 * return (
 *   <div ref={containerRef} className="relative h-[400px] overflow-hidden">
 *     <img ref={layerRef} src="/cloud.png" alt="Cloud" className="absolute" />
 *   </div>
 * )
 *
 * @example
 * // Multiple layers
 * const containerRef = useRef<HTMLDivElement>(null)
 * const [bgRef, midRef, fgRef] = useParallaxLayer(containerRef, [
 *   { translateRatio: 5, scrollRatio: 2 },   // background (moves slow)
 *   { translateRatio: 15, scrollRatio: 5 },  // mid layer
 *   { translateRatio: 30 },                  // foreground (moves fast, mouse only)
 * ])
 *
 * return (
 *   <div ref={containerRef} className="relative h-[400px] overflow-hidden">
 *     <img ref={bgRef} src="/bg.png" className="absolute" />
 *     <img ref={midRef} src="/mid.png" className="absolute" />
 *     <img ref={fgRef} src="/fg.png" className="absolute" />
 *   </div>
 * )
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
