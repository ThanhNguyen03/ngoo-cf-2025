import { cn } from '@/utils'
import {
  CSSProperties,
  type PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

type TPosition = 'top' | 'bottom' | 'left' | 'right'

type TTooltipProps = PropsWithChildren & {
  /** The content of tooltip */
  content: ReactNode
  /** Position of the tooltip relative to the trigger element */
  position?: TPosition
  /** Callback function triggered when tooltip becomes visible */
  onShow?: () => void
  /** Callback function triggered when tooltip becomes hidden */
  onHide?: () => void
  /** Distance in pixels between tooltip and trigger element @default 4 */
  offset?: number
  /** Delay in milliseconds before showing the tooltip @default 300 */
  delay?: number
  /** Controlled state to manually show/hide tooltip, should not depends on duration */
  isOpen?: boolean
  /** Duration in milliseconds before tooltip auto closes */
  duration?: number
  className?: string
  wrapperClassName?: string
  /**
   * Show arrow; `true` for default size, or object to set `width` and `height`.
   */
  arrow?:
    | boolean
    | {
        width?: number
        height?: number
      }
}

type TCoordinate = {
  top: number
  left: number
}

const DEFAULT_ARROW = {
  width: 8,
  height: 4,
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  onShow,
  onHide,
  className,
  offset = 4,
  delay = 300,
  isOpen,
  duration,
  wrapperClassName,
  arrow = true,
}: TTooltipProps) => {
  const [visible, setVisible] = useState<boolean>(Boolean(isOpen))
  const [coords, setCoords] = useState<TCoordinate>({ top: 0, left: 0 })
  const [actualPosition, setActualPosition] = useState<TPosition>(position)
  const ref = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const arrowConfig =
    arrow === true ? DEFAULT_ARROW : { ...DEFAULT_ARROW, ...arrow }
  const responsiveOffset = arrow ? offset + arrowConfig.height : offset

  const tooltipPositionClassName = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  }[actualPosition]

  const arrowPositionStyle: CSSProperties = {
    top: {
      width: arrowConfig.width,
      height: '100%',
      top: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      clipPath: `polygon(50% ${arrowConfig.height}px, 0% 0%, 100% 0%)`,
    },
    bottom: {
      width: arrowConfig.width,
      height: '100%',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      clipPath: `polygon(50% calc(100% - ${arrowConfig.height}px), 0% 100%, 100% 100%)`,
    },
    left: {
      width: '100%',
      height: arrowConfig.width,
      left: '100%',
      alignSelf: 'center',
      clipPath: `polygon(${arrowConfig.height}px 50%, 0% 0%, 0% 100%)`,
    },
    right: {
      width: '100%',
      height: arrowConfig.width,
      right: '100%',
      alignSelf: 'center',
      clipPath: `polygon(calc(100% - ${arrowConfig.height}px) 50%, 100% 0%, 100% 100%)`,
    },
  }[actualPosition]

  useEffect(() => {
    setVisible(Boolean(isOpen))
  }, [isOpen])

  useEffect(() => {
    if (!visible || typeof duration !== 'number' || duration <= 0) {
      return
    }

    const timeoutId = setTimeout(() => {
      setVisible(false)
    }, duration)
    return () => clearTimeout(timeoutId)
  }, [visible, duration])

  useEffect(() => {
    if (!visible || !ref.current) {
      return
    }

    const calculateBestPosition = (
      triggerRect: DOMRect,
      tooltipRect: DOMRect,
      preferredPosition: TPosition,
    ): TPosition => {
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      }

      const scroll = {
        x: window.scrollX,
        y: window.scrollY,
      }

      // Calculate available space in each direction
      const spaces = {
        top: triggerRect.top + scroll.y,
        bottom: viewport.height - triggerRect.bottom - scroll.y,
        left: triggerRect.left + scroll.x,
        right: viewport.width - triggerRect.right - scroll.x,
      }

      // Check if tooltip fits in preferred position
      const fitsInPreferred = (() => {
        switch (preferredPosition) {
          case 'top':
            return spaces.top >= tooltipRect.height + responsiveOffset
          case 'bottom':
            return spaces.bottom >= tooltipRect.height + responsiveOffset
          case 'left':
            return spaces.left >= tooltipRect.width + responsiveOffset
          case 'right':
            return spaces.right >= tooltipRect.width + responsiveOffset
        }
      })()

      if (fitsInPreferred) {
        return preferredPosition
      }

      // Find best alternative position
      const alternatives: TPosition[] = [
        'top',
        'bottom',
        'left',
        'right',
      ].filter((pos) => pos !== preferredPosition) as TPosition[]

      for (const pos of alternatives) {
        const fits = (() => {
          switch (pos) {
            case 'top':
              return spaces.top >= tooltipRect.height + responsiveOffset
            case 'bottom':
              return spaces.bottom >= tooltipRect.height + responsiveOffset
            case 'left':
              return spaces.left >= tooltipRect.width + responsiveOffset
            case 'right':
              return spaces.right >= tooltipRect.width + responsiveOffset
          }
        })()

        if (fits) {
          return pos
        }
      }

      // If nothing fits perfectly, use position with most space
      const maxSpace = Math.max(...Object.values(spaces))
      const bestPosition = Object.entries(spaces).find(
        ([, space]) => space === maxSpace,
      )?.[0] as TPosition

      return bestPosition || preferredPosition
    }

    const calculatePosition = (pos: TPosition): TCoordinate => {
      if (!ref.current) {
        return { top: 0, left: 0 }
      }

      const rect = ref.current.getBoundingClientRect()
      const childrenStyle = window.getComputedStyle(
        ref.current?.firstElementChild as HTMLElement,
      )
      const childrenMl = parseFloat(childrenStyle.marginLeft)
      const childrenMr = parseFloat(childrenStyle.marginRight)

      let top = 0
      let left = 0

      switch (pos) {
        case 'top':
          top = rect.top + window.scrollY - responsiveOffset
          left =
            rect.left +
            rect.width / 2 +
            window.scrollX +
            (childrenMl - childrenMr) / 2
          break
        case 'bottom':
          top = rect.bottom + window.scrollY + responsiveOffset
          left =
            rect.left +
            rect.width / 2 +
            window.scrollX +
            (childrenMl - childrenMr) / 2
          break
        case 'left':
          top = rect.top + window.scrollY + rect.height / 2
          left = rect.left + window.scrollX - responsiveOffset + childrenMl
          break
        case 'right':
          top = rect.top + window.scrollY + rect.height / 2
          left = rect.right + window.scrollX + responsiveOffset - childrenMr
          break
      }

      return { top, left }
    }

    // Create temporary tooltip to measure dimensions
    const tempTooltip = document.createElement('div')
    tempTooltip.style.position = 'absolute'
    tempTooltip.style.visibility = 'hidden'
    tempTooltip.style.pointerEvents = 'none'
    tempTooltip.className = cn(
      'rounded bg-black/70 px-2 py-1 text-sm whitespace-nowrap text-white',
      className,
    )
    tempTooltip.textContent = typeof content === 'string' ? content : ''
    document.body.appendChild(tempTooltip)

    const tooltipRect = tempTooltip.getBoundingClientRect()
    const triggerRect = ref.current.getBoundingClientRect()

    // Determine best position
    const bestPosition = calculateBestPosition(
      triggerRect,
      tooltipRect,
      position,
    )
    setActualPosition(bestPosition)

    // Calculate coordinates
    const newCoords = calculatePosition(bestPosition)
    setCoords(newCoords)

    // Clean up temp element
    document.body.removeChild(tempTooltip)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [visible, position, content, className, responsiveOffset])

  const handleMouseEnter = () => {
    if (typeof isOpen === 'boolean') {
      return
    }
    timerRef.current = setTimeout(() => {
      setVisible(true)
      onShow?.()
    }, delay)
  }

  const handleMouseLeave = () => {
    if (typeof isOpen === 'boolean') {
      return
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    setVisible(false)
    onHide?.()
  }

  return (
    <>
      <div
        ref={ref}
        className={cn('w-fit', wrapperClassName)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>{children}</div>
      </div>

      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={cn(
              'pointer-events-none absolute z-50 rounded bg-black/70 px-2 py-1 text-sm whitespace-nowrap text-white',
              tooltipPositionClassName,
              className,
            )}
            style={{
              top: coords.top,
              left: coords.left,
            }}
          >
            {arrow && (
              <div
                className='absolute bg-inherit'
                style={{
                  ...arrowPositionStyle,
                }}
              />
            )}
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
