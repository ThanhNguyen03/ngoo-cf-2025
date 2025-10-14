import { TCursorPosition, TIconProps } from '@/types'
import { FC } from 'react'

/**
 * Convert HSL / HSLA string into rgba(r,g,b,a).
 *
 * @param color - Input color string (hsl(), hsla()).
 */
const parseColorToRgba = (color: string): string => {
  color = color.trim().toLowerCase()

  if (color.startsWith('hsl')) {
    const parts = color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0]
    const [h, s, l, a = 1] = parts
    const sat = s / 100
    const light = l / 100

    const k = (n: number) => (n + h / 30) % 12
    const f = (n: number) =>
      light -
      sat *
        Math.min(light, 1 - light) *
        Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))

    const r = Math.round(255 * f(0))
    const g = Math.round(255 * f(8))
    const b = Math.round(255 * f(4))

    return `rgba(${r},${g},${b},${a})`
  }

  return color
}

type TDefaultPatternProps = {
  /**  @param id - Unique ID for the pattern and gradient definitions. */
  id: string

  /** @param highlightColor - Optional base color for gradient highlighting. */
  highlightColor?: string

  /** @param secondHighlightColor - Optional base color for second gradient highlighting. */
  secondHighlightColor?: string
}

/**
 * Render a reusable SVG `<pattern>` definition.
 *
 * - Generates a grid-like pattern composed of dashed strokes and filled shapes.
 * - If `highlightColor` is provided, applies a linear gradient (`lineGradient{id}`)
 *   to strokes and fills to give a highlighted look.
 * - Otherwise falls back to the default muted colors (#E7D3BD, #9DAEA8, #748D84).
 *
 * @param id - Unique ID for the pattern and gradient definitions.
 * @param highlightColor - Optional base color for gradient highlighting.
 */
const DefaultPattern: FC<TDefaultPatternProps> = ({
  id,
  highlightColor,
  secondHighlightColor,
}) => {
  return (
    <>
      {highlightColor && (
        <linearGradient
          id={`lineGradient${id}`}
          x1='0%'
          y1='0%'
          x2='100%'
          y2='0%'
        >
          <stop
            offset='0%'
            stopColor={parseColorToRgba(secondHighlightColor || highlightColor)}
            stopOpacity={1}
          />
          <stop
            offset='50%'
            stopColor={parseColorToRgba(highlightColor)}
            stopOpacity={0.8}
          />
          <stop
            offset='100%'
            stopColor={parseColorToRgba(secondHighlightColor || highlightColor)}
            stopOpacity={1}
          />
        </linearGradient>
      )}

      <pattern
        id={id}
        patternUnits='userSpaceOnUse'
        patternTransform='matrix(384.001 0 0 192 623.8 -0.2)'
        preserveAspectRatio='none'
        viewBox='-0.5 -0.5 960.002 480'
        width='1'
        height='1'
      >
        <use xlinkHref={`#${id}_inner`} transform='translate(-480.001 -720)' />
        <use xlinkHref={`#${id}`} transform='translate(0 -960)' />
        <use xlinkHref={`#${id}_inner`} transform='translate(480.001 -720)' />
        <use xlinkHref={`#${id}_inner`} transform='translate(-480.001 -240)' />
        <use xlinkHref={`#${id}_inner`} transform='translate(0 -480)' />
        <use xlinkHref={`#${id}_inner`} transform='translate(480.001 -240)' />
        <use xlinkHref={`#${id}_inner`} transform='translate(-480.001 240)' />
        <g id={`${id}_inner`}>
          <path
            d='M0 0L120 0L120 120L0 120L0 0Z'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <path
            d='M120 360L120 360.5L120.5 360.5L120.5 360L120 360ZM120 360L120.5 360L120.5 354L120 354L119.5 354L119.5 360L120 360ZM120 342L120.5 342L120.5 330L120 330L119.5 330L119.5 342L120 342ZM120 318L120.5 318L120.5 306L120 306L119.5 306L119.5 318L120 318ZM120 294L120.5 294L120.5 282L120 282L119.5 282L119.5 294L120 294ZM120 270L120.5 270L120.5 258L120 258L119.5 258L119.5 270L120 270ZM120 246L120.5 246L120.5 240L120 240L119.5 240L119.5 246L120 246ZM0 360L-4.37114e-08 360.5L6 360.5L6 360L6 359.5L4.37114e-08 359.5L0 360ZM18 360L18 360.5L30 360.5L30 360L30 359.5L18 359.5L18 360ZM42 360L42 360.5L54 360.5L54 360L54 359.5L42 359.5L42 360ZM66 360L66 360.5L78 360.5L78 360L78 359.5L66 359.5L66 360ZM90 360L90 360.5L102 360.5L102 360L102 359.5L90 359.5L90 360ZM114 360L114 360.5L120 360.5L120 360L120 359.5L114 359.5L114 360Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <path
            d='M0 360H120V480H0V360Z'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <path
            d='M360 120L360 120.5L360.5 120.5L360.5 120L360 120ZM360 120L360.5 120L360.5 114L360 114L359.5 114L359.5 120L360 120ZM360 102L360.5 102L360.5 90L360 90L359.5 90L359.5 102L360 102ZM360 78L360.5 78L360.5 66L360 66L359.5 66L359.5 78L360 78ZM360 54L360.5 54L360.5 42L360 42L359.5 42L359.5 54L360 54ZM360 30L360.5 30L360.5 18L360 18L359.5 18L359.5 30L360 30ZM360 6L360.5 6L360.5 -4.37114e-08L360 0L359.5 4.37114e-08L359.5 6L360 6ZM240 120L240 120.5L246 120.5L246 120L246 119.5L240 119.5L240 120ZM258 120L258 120.5L270 120.5L270 120L270 119.5L258 119.5L258 120ZM282 120L282 120.5L294 120.5L294 120L294 119.5L282 119.5L282 120ZM306 120L306 120.5L318 120.5L318 120L318 119.5L306 119.5L306 120ZM330 120L330 120.5L342 120.5L342 120L342 119.5L330 119.5L330 120ZM354 120L354 120.5L360 120.5L360 120L360 119.5L354 119.5L354 120Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <rect
            x='420.001'
            y='55.7573'
            width='6'
            height='6'
            transform='rotate(45 420.001 55.7573)'
            fill={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
          />
          <line
            x1='360.647'
            y1='360.354'
            x2='239.647'
            y2='239.354'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <path
            d='M360.001 360L360.501 360L360.501 359.5L360.001 359.5L360.001 360ZM360.001 360L360.001 359.5L354.001 359.5L354.001 360L354.001 360.5L360.001 360.5L360.001 360ZM342.001 360L342.001 359.5L330.001 359.5L330.001 360L330.001 360.5L342.001 360.5L342.001 360ZM318.001 360L318.001 359.5L306.001 359.5L306.001 360L306.001 360.5L318.001 360.5L318.001 360ZM294.001 360L294.001 359.5L282.001 359.5L282.001 360L282.001 360.5L294.001 360.5L294.001 360ZM270.001 360L270.001 359.5L258.001 359.5L258.001 360L258.001 360.5L270.001 360.5L270.001 360ZM246.001 360L246.001 359.5L240.001 359.5L240.001 360L240.001 360.5L246.001 360.5L246.001 360ZM360.001 480L360.501 480L360.501 474L360.001 474L359.501 474L359.501 480L360.001 480ZM360.001 462L360.501 462L360.501 450L360.001 450L359.501 450L359.501 462L360.001 462ZM360.001 438L360.501 438L360.501 426L360.001 426L359.501 426L359.501 438L360.001 438ZM360.001 414L360.501 414L360.501 402L360.001 402L359.501 402L359.501 414L360.001 414ZM360.001 390L360.501 390L360.501 378L360.001 378L359.501 378L359.501 390L360.001 390ZM360.001 366L360.501 366L360.501 360L360.001 360L359.501 360L359.501 366L360.001 366Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <path
            d='M360.001 240L360.001 239.5L359.501 239.5L359.501 240L360.001 240ZM360.001 240L359.501 240L359.501 246L360.001 246L360.501 246L360.501 240L360.001 240ZM360.001 258L359.501 258L359.501 270L360.001 270L360.501 270L360.501 258L360.001 258ZM360.001 282L359.501 282L359.501 294L360.001 294L360.501 294L360.501 282L360.001 282ZM360.001 306L359.501 306L359.501 318L360.001 318L360.501 318L360.501 306L360.001 306ZM360.001 330L359.501 330L359.501 342L360.001 342L360.501 342L360.501 330L360.001 330ZM360.001 354L359.501 354L359.501 360L360.001 360L360.501 360L360.501 354L360.001 354ZM480.001 240L480.001 239.5L474.001 239.5L474.001 240L474.001 240.5L480.001 240.5L480.001 240ZM462.001 240L462.001 239.5L450.001 239.5L450.001 240L450.001 240.5L462.001 240.5L462.001 240ZM438.001 240L438.001 239.5L426.001 239.5L426.001 240L426.001 240.5L438.001 240.5L438.001 240ZM414.001 240L414.001 239.5L402.001 239.5L402.001 240L402.001 240.5L414.001 240.5L414.001 240ZM390.001 240L390.001 239.5L378.001 239.5L378.001 240L378.001 240.5L390.001 240.5L390.001 240ZM366.001 240L366.001 239.5L360.001 239.5L360.001 240L360.001 240.5L366.001 240.5L366.001 240Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <path
            d='M360.001 360H480.001V480H360.001V360Z'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <line
            x1='119.354'
            y1='119.646'
            x2='240.354'
            y2='240.646'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <path
            d='M120 120L119.5 120L119.5 120.5L120 120.5L120 120ZM120 120L120 120.5L126 120.5L126 120L126 119.5L120 119.5L120 120ZM138 120L138 120.5L150 120.5L150 120L150 119.5L138 119.5L138 120ZM162 120L162 120.5L174 120.5L174 120L174 119.5L162 119.5L162 120ZM186 120L186 120.5L198 120.5L198 120L198 119.5L186 119.5L186 120ZM210 120L210 120.5L222 120.5L222 120L222 119.5L210 119.5L210 120ZM234 120L234 120.5L240 120.5L240 120L240 119.5L234 119.5L234 120ZM120 0.00012207L119.5 0.000122064L119.5 6.00012L120 6.00012L120.5 6.00012L120.5 0.000122076L120 0.00012207ZM120 18.0001L119.5 18.0001L119.5 30.0001L120 30.0001L120.5 30.0001L120.5 18.0001L120 18.0001ZM120 42.0001L119.5 42.0001L119.5 54.0001L120 54.0001L120.5 54.0001L120.5 42.0001L120 42.0001ZM120 66.0001L119.5 66.0001L119.5 78.0001L120 78.0001L120.5 78.0001L120.5 66.0001L120 66.0001ZM120 90.0001L119.5 90.0001L119.5 102L120 102L120.5 102L120.5 90.0001L120 90.0001ZM120 114L119.5 114L119.5 120L120 120L120.5 120L120.5 114L120 114Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <line
            x1='120'
            y1='299.5'
            x2='240'
            y2='299.5'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#748D84'}
            strokeDasharray='12 12'
          />
          <line
            x1='179.5'
            y1='480'
            x2='179.5'
            y2='360'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#748D84'}
            strokeDasharray='12 12'
          />
          <line
            x1='239.355'
            y1='119.647'
            x2='360.355'
            y2='240.647'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#E7D3BD'}
            strokeDasharray='12 12'
          />
          <path
            d='M360.001 120V119.5H359.501V120H360.001ZM360.001 120H359.501V126H360.001H360.501V120H360.001ZM360.001 138H359.501V150H360.001H360.501V138H360.001ZM360.001 162H359.501V174H360.001H360.501V162H360.001ZM360.001 186H359.501V198H360.001H360.501V186H360.001ZM360.001 210H359.501V222H360.001H360.501V210H360.001ZM360.001 234H359.501V240H360.001H360.501V234H360.001ZM480.001 120V119.5L474.001 119.5V120V120.5L480.001 120.5V120ZM462.001 120V119.5H450.001V120V120.5H462.001V120ZM438.001 120V119.5H426.001V120V120.5H438.001V120ZM414.001 120V119.5H402.001V120V120.5H414.001V120ZM390.001 120V119.5H378.001V120V120.5H390.001V120ZM366.001 120V119.5H360.001V120V120.5H366.001V120Z'
            fill={highlightColor ? `url(#lineGradient${id})` : '#9DAEA8'}
          />
          <line
            y1='179.5'
            x2='120'
            y2='179.5'
            stroke={highlightColor ? `url(#lineGradient${id})` : '#748D84'}
            strokeDasharray='12 12'
          />
        </g>
        <use xlinkHref={`#${id}_inner`} transform='translate(480.001 240)' />
      </pattern>
    </>
  )
}

type TLinePatternProps = TIconProps & {
  /** @param id - Unique ID for the pattern and mask references.*/
  id: string

  /**  @param opacity - Opacity of the base pattern (default `0.7`). */
  opacity?: number

  /** @param highlightColor - Optional color for gradient highlight strokes/fills.*/
  highlightColor?: string

  /** @param secondHighlightColor - Optional color for gradient highlight strokes/fills.*/
  secondHighlightColor?: string

  /** @param cursorRadius - Radius of the circular cursor mask (default `50`). */
  cursorRadius?: number

  /** @param spotlightColor - Solid color used in the spotlight overlay (`#fff` by default). */
  spotlightColor?: string

  /** @param spotlightOpacity - Opacity of the spotlight overlay (default `0.6`). */
  spotlightOpacity?: number

  /** @param position - `{x,y}` cursor coordinates relative to the SVG canvas. */
  position: TCursorPosition
}

/**
 * SVG component that renders a line grid pattern with a spotlight cursor effect.
 * @param id - Unique ID for the pattern and mask references.
 * @param opacity - Opacity of the base pattern (default `0.7`).
 * @param cursorRadius - Radius of the circular cursor mask (default `50`).
 * @param highlightColor - Optional color for gradient highlight strokes/fills.
 * @param secondHighlightColor - Optional color for gradient highlight strokes/fills.
 * @param spotlightColor - Solid color used in the spotlight overlay (`#fff` by default).
 * @param spotlightOpacity - Opacity of the spotlight overlay (default `0.6`).
 * @param position - `{x,y}` cursor coordinates relative to the SVG canvas.
 *
 * @example
 * <LinePattern
 *   id="hero"
 *   position={cursorPos}
 *   cursorRadius={150}
 *   highlightColor="hsla(15,100%,52%)"
 *   spotlightColor="hsla(15,100%,52%)"
 *   spotlightOpacity={0.7}
 *   className="absolute inset-0 w-full mix-blend-color-dodge"
 * />
 */
export const LinePattern: FC<TLinePatternProps> = ({
  id,
  opacity = 0.7,
  cursorRadius = 50,
  highlightColor,
  secondHighlightColor,
  spotlightColor = '#fff',
  spotlightOpacity = 0.6,
  position,
  ref,
  ...props
}) => {
  return (
    <svg
      ref={ref}
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      viewBox='0 0 1440 880'
      fill='none'
      {...props}
    >
      <rect
        width='100%'
        height='100%'
        fill={`url(#pattern${id})`}
        opacity={opacity}
      />

      <g mask={`url(#cursorMask${id})`} style={{ isolation: 'isolate' }}>
        <rect
          width='100%'
          height='100%'
          fill={`url(#patternHighlight${id})`}
          opacity={1}
        />

        <rect
          width='100%'
          height='100%'
          fill={parseColorToRgba(spotlightColor)}
          style={{ mixBlendMode: 'color-dodge', pointerEvents: 'none' }}
          opacity={spotlightOpacity}
        />
      </g>
      <defs>
        <filter
          id={`maskBlur${id}`}
          x='-200%'
          y='-200%'
          width='400%'
          height='400%'
          filterUnits='userSpaceOnUse'
        >
          <feGaussianBlur stdDeviation={cursorRadius * 0.4} />
        </filter>

        <mask id={`cursorMask${id}`} maskUnits='userSpaceOnUse'>
          <rect width='100%' height='100%' fill='black' />
          <circle
            cx={position.x}
            cy={position.y}
            r={cursorRadius}
            fill='white'
            filter={`url(#maskBlur${id})`}
          />
        </mask>

        <DefaultPattern id={`pattern${id}`} />

        {/* highlight pattern */}
        <DefaultPattern
          id={`patternHighlight${id}`}
          highlightColor={highlightColor}
          secondHighlightColor={secondHighlightColor}
        />
      </defs>
    </svg>
  )
}
