import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type TPlacement = 'right' | 'left' | 'top' | 'bottom'

type UseAnchoredFloatingOptions = {
  /** A boolean indicating whether the floating element is open or not. */
  open: boolean

  /** An optional string indicating the placement of the floating element relative to the anchor element.
   * It can be one of 'right', 'left', 'top', or 'bottom'. */
  placement?: TPlacement

  /** An optional number indicating the distance between the floating element and the anchor element. */
  offset?: number

  /** An optional number indicating the padding around the floating element to prevent it from going out of bounds. */
  padding?: number

  /** An optional boolean indicating whether to observe scroll events on the parent elements of the anchor element. */
  observeScrollParents?: boolean
}

const getScrollParents = (el: HTMLElement | null) => {
  const parents: (HTMLElement | Document)[] = []
  if (!el) return parents

  const overflowRe = /(auto|scroll|overlay)/
  let p: HTMLElement | null = el.parentElement

  while (p) {
    const s = getComputedStyle(p)
    const ov = `${s.overflow} ${s.overflowX} ${s.overflowY}`
    if (overflowRe.test(ov)) parents.push(p)
    p = p.parentElement
  }
  parents.push(document) // fallback (capture window-like scroll)
  return parents
}

const clamp = (n: number, min: number, max: number) => {
  return Math.min(Math.max(n, min), max)
}

const computePos = (args: {
  placement: TPlacement
  offset: number
  padding: number
  anchorRect: DOMRect
  floatingEl: HTMLElement
}) => {
  const { placement, offset, padding, anchorRect: r, floatingEl } = args
  const w = floatingEl.offsetWidth
  const h = floatingEl.offsetHeight

  let x = 0
  let y = 0

  if (placement === 'right') {
    x = r.right + offset
    y = r.top + (r.height - h) / 2
  } else if (placement === 'left') {
    x = r.left - w - offset
    y = r.top + (r.height - h) / 2
  } else if (placement === 'top') {
    x = r.left + (r.width - w) / 2
    y = r.top - h - offset
  } else {
    // bottom
    x = r.left + (r.width - w) / 2
    y = r.bottom + offset
  }

  // Clamp the floating element within the viewport
  const vw = window.innerWidth
  const vh = window.innerHeight
  x = clamp(x, padding, vw - w - padding)
  y = clamp(y, padding, vh - h - padding)

  return { x, y }
}

export const useAnchoredFloating = <TAnchor extends HTMLElement = HTMLElement>({
  open,
  placement = 'right',
  offset = 8,
  padding = 8,
  observeScrollParents = true,
}: UseAnchoredFloatingOptions) => {
  const anchorRef = useRef<TAnchor | null>(null)
  const floatingRef = useRef<HTMLDivElement | null>(null)

  const [pos, setPos] = useState({ x: 0, y: 0 })

  // avoid position jumping before measurement is complete
  const [ready, setReady] = useState(false)

  const update = () => {
    const a = anchorRef.current
    const f = floatingRef.current
    if (!a || !f) return

    const r = a.getBoundingClientRect() // viewport coords
    setPos(
      computePos({ placement, offset, padding, anchorRect: r, floatingEl: f }),
    )
    setReady(true)
  }

  // calculate immediately after open + popover render
  useLayoutEffect(() => {
    if (!open) {
      setReady(false)
      return
    }
    // 2 hearts: Ensure that offsetWidth/Height has been calculated
    update()
    queueMicrotask(update)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, placement, offset, padding])

  useEffect(() => {
    if (!open) return

    const a = anchorRef.current
    const scrollTargets = observeScrollParents
      ? getScrollParents(a)
      : [document]

    const onMove = () => update()

    scrollTargets.forEach((t) => {
      t.addEventListener('scroll', onMove, { passive: true, capture: true })
    })
    window.addEventListener('resize', onMove)

    const ro = new ResizeObserver(onMove)
    if (a) ro.observe(a)
    if (floatingRef.current) ro.observe(floatingRef.current)

    return () => {
      scrollTargets.forEach((t) => {
        t.removeEventListener('scroll', onMove, { capture: true })
      })
      window.removeEventListener('resize', onMove)
      ro.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, observeScrollParents, placement, offset, padding])

  const floatingStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'fixed',
      left: pos.x,
      top: pos.y,
      visibility: open && ready ? 'visible' : 'hidden',
    }),
    [pos.x, pos.y, open, ready],
  )

  return {
    anchorRef,
    floatingRef,
    floatingStyle,
    update,
  }
}
