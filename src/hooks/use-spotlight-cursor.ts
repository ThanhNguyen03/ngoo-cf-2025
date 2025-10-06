import { TCursorPosition } from '@/types'
import { useState, useCallback } from 'react'

type TSpotlightCursorProps = {
  radius?: number
}
type TSpotlightCursorReturn = {
  /** Cursor position relative to the element. */
  position: { x: number; y: number }

  /**
   * Handle mouse movement inside a target element and compute cursor coordinates
   * relative to that element, with optional scaling to a minimum width/height.
   *
   * - By default, the cursor position is calculated as the distance from the element's top-left corner.
   * - If `minWidth` and/or `minHeight` are provided and the element is larger than those values,
   *   the cursor position is normalized (scaled) to fit within the minimum dimensions.
   */
  onMouseMove: (
    e: React.MouseEvent<HTMLElement>,
    minWidth?: number,
    minHeight?: number,
  ) => void

  /** Prebuilt CSS mask style to apply spotlight effect.*/
  maskStyle: React.CSSProperties
}
/**
 * Custom hook to create a spotlight (radial mask) effect that follows the cursor.
 *
 * - Calculates cursor position relative to the given element.
 * - Returns both the raw position and a ready-to-use CSS `maskImage` style.
 * - Can be attached to multiple elements independently.
 *
 *Optional configuration object.
 * @param radius - Spotlight radius in pixels (default: 150).
 *
 * @returns spotlight utilities:
 * - `position`: `{ x, y }` coordinates relative to the element.
 * - `onMouseMove`: callback to attach to element's `onMouseMove` handler.
 * - `maskStyle`: CSS style object containing the radial `maskImage`.
 *
 * @example
 * // Default spotlight
 * const { onMouseMove, maskStyle } = useSpotlightCursor();
 *
 * <div onMouseMove={onMouseMove} style={maskStyle}>
 *   <Image src="/banner.png" alt="banner" />
 * </div>
 *
 * @example
 * // Custom spotlight with larger radius and softer edge
 * const { onMouseMove, maskStyle } = useSpotlightCursor({
 *   radius: 200,
 * });
 */
export const useSpotlightCursor = ({
  radius = 150,
}: TSpotlightCursorProps = {}): TSpotlightCursorReturn => {
  const [position, setPosition] = useState<TCursorPosition>({ x: 0, y: 0 })

  const onMouseMove = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      minWidth?: number,
      minHeight?: number,
    ) => {
      if (!e) {
        setPosition({ x: 0, y: 0 })
        return
      }
      const rect = e.currentTarget.getBoundingClientRect()
      const x: number =
        minWidth && rect.width > minWidth
          ? ((e.clientX - rect.left) / rect.width) * minWidth
          : e.clientX - rect.left
      const y: number =
        minHeight && rect.height > minHeight
          ? ((e.clientY - rect.top) / rect.height) * minHeight
          : e.clientY - rect.top

      setPosition({ x, y })
    },
    [],
  )

  const maskStyle: React.CSSProperties = {
    position: 'absolute',
    filter: 'brightness(190%)',
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    top: `${position.y - radius}px`,
    left: `${position.x - radius}px`,
    borderRadius: '100%',
    backdropFilter: 'brightness(70%)',
    mixBlendMode: 'screen',
    WebkitMaskImage: `radial-gradient(circle ${radius}px at center, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskSize: 'cover',
  }

  return { position, onMouseMove, maskStyle }
}
