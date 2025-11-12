'use client'
import { cn } from '@/utils'
import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react'
import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

const TOAST_ANIMATION_DURATION = 200

const TOAST_POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const

export type TToastType = 'info' | 'success' | 'warning' | 'error'

type TToastPosition = (typeof TOAST_POSITIONS)[number]

/**
 * Global configuration options for the Toast system
 */
type TToastGlobalOptions = {
  /** Additional class for the toast container */
  className?: string

  /** Additional class for the toast content area (message) */
  contentClassName?: string

  /** Position of the toasts on the screen */
  position?: TToastPosition

  /** Duration before auto-dismiss (ms). Use `null` to disable auto-dismiss */
  duration?: number | null

  /** Maximum number of visible toasts at once */
  limit?: number

  /** Whether to pause auto-dismiss when hovering over the toast */
  pauseOnHover?: boolean

  /** Gap between the toast and the screen edge (similar to padding) */
  offset?: number

  /** Show close button or not */
  closable?: boolean

  /** Additional class for the close button */
  closeBtnClassName?: string

  /** Custom classNames for types */
  listTypeClass?: Partial<Record<TToastType, string>>

  /** Custom icons for types */
  listTypeIcon?: Partial<Record<TToastType, ReactNode>>

  /** Whether to show the progress bar */
  progressBar?: boolean
}

/**
 * Toast-specific options (per toast), based on global options
 */
type TToastOptions = Omit<TToastGlobalOptions, 'limit'> & {
  /** Optional unique ID. If passed and reused, it will update the existing toast */
  id?: string
}

/**
 * Toast item stored in state
 */
type TToastItem = {
  /** Whether the toast is currently shown */
  visible: boolean

  /** Unique toast identifier */
  id?: string

  /** Type of toast (info, success, warning, error) */
  type: TToastType | null

  /** The main message to display */
  message: string | ReactNode

  /** Toast-specific display options */
  options: Omit<
    TToastGlobalOptions,
    'limit' | 'listTypeClass' | 'listTypeIcon' | 'closeBtnClassName'
  >

  /** Start timestamp when toast appears (used for pause/resume) */
  startTime?: number

  /** Time remaining for dismissal (ms) */
  remainingTime?: number

  /** Whether this toast is currently paused */
  isPaused?: boolean
}

type TShowToastFn = (
  id: string | undefined,
  type: TToastType | null,
  message: string | ReactNode,
  options?: Omit<TToastGlobalOptions, 'limit'>,
) => void

let showToast: TShowToastFn | undefined

let closeToast: ((id?: string) => void) | undefined

const registerToast = (
  showFn: TShowToastFn,
  closeFn: (id?: string) => void,
) => {
  showToast = showFn
  closeToast = closeFn
}

const unregisterToast = () => {
  showToast = undefined
  closeToast = undefined
}

class Toast
  implements
    Record<
      TToastType,
      (msg: string | ReactNode, options?: TToastOptions) => void
    >
{
  private callInternal(
    type: TToastType | null,
    msg: string | ReactNode,
    opts?: TToastOptions,
  ) {
    showToast?.(opts?.id, type, msg, opts)
  }

  /** Default toast call */
  call = (msg: string | ReactNode, opts?: TToastOptions) =>
    this.callInternal(null, msg, opts)

  info = (msg: string | ReactNode, opts?: TToastOptions) =>
    this.callInternal('info', msg, opts)
  success = (msg: string | ReactNode, opts?: TToastOptions) =>
    this.callInternal('success', msg, opts)
  warning = (msg: string | ReactNode, opts?: TToastOptions) =>
    this.callInternal('warning', msg, opts)
  error = (msg: string | ReactNode, opts?: TToastOptions) =>
    this.callInternal('error', msg, opts)
  close = (id?: string) => closeToast?.(id)
}

const toastInstance = new Toast()
export const toast = Object.assign(
  toastInstance.call.bind(toastInstance),
  toastInstance,
)

export const Toaster = ({
  className,
  contentClassName,
  position = 'top-center',
  duration = 3000,
  limit,
  pauseOnHover = true,
  offset,
  closable = true,
  closeBtnClassName,
  listTypeClass,
  listTypeIcon,
  progressBar,
}: TToastGlobalOptions) => {
  const [toasts, setToasts] = useState<TToastItem[]>([])
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const globalOptions = useMemo<TToastGlobalOptions>(
    () => ({
      className,
      contentClassName,
      position,
      duration,
      limit,
      pauseOnHover,
      offset,
      closable,
      closeBtnClassName,
      listTypeClass,
      listTypeIcon,
      progressBar,
    }),
    [
      className,
      contentClassName,
      position,
      duration,
      limit,
      pauseOnHover,
      offset,
      closable,
      closeBtnClassName,
      listTypeClass,
      listTypeIcon,
      progressBar,
    ],
  )

  const listTypeIconOption: Record<TToastType, ReactNode> = {
    info: <InfoIcon size={20} className='shrink-0' />,
    success: <CheckCircleIcon size={20} className='shrink-0' />,
    warning: <WarningIcon size={20} className='shrink-0' />,
    error: <WarningCircleIcon size={20} className='shrink-0' />,
    ...globalOptions.listTypeIcon,
  }

  const listTypeClassOption: Record<TToastType, string> = {
    info: 'bg-zk-blue-100 border-zk-blue-400 text-zk-blue-700',
    success: 'bg-zk-green-100 border-zk-green-400 text-zk-green-700',
    warning: 'bg-zk-yellow-100 border-zk-yellow-400 text-zk-yellow-700',
    error: 'bg-zk-pink-100 border-zk-pink-400 text-zk-pink-700',
    ...globalOptions.listTypeClass,
  }

  const listPositionClass: Record<TToastPosition, string> = {
    'top-left': 'self-start',
    'top-center': 'self-center',
    'top-right': 'self-end',
    'bottom-left': 'self-start',
    'bottom-center': 'self-center',
    'bottom-right': 'self-end',
  }

  const clearTimer = (id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }

  const setTimer = (id: string, delay: number) => {
    clearTimer(id)
    const timer = setTimeout(() => {
      closeToastCallback(id)
      timersRef.current.delete(id)
    }, delay)
    timersRef.current.set(id, timer)
  }

  const pauseToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => {
        if (t.id === id && !t.isPaused) {
          clearTimer(id)
          const elapsed = Date.now() - (t.startTime || 0)
          const remaining = Math.max(0, (t.options.duration || 0) - elapsed)
          return { ...t, isPaused: true, remainingTime: remaining }
        }
        return t
      }),
    )
  }

  const resumeToast = (id: string) => {
    setToasts((prev) =>
      prev.map((t) => {
        if (t.id === id && t.isPaused) {
          const remainingTime = t.remainingTime || 0
          if (remainingTime > 0) {
            setTimer(id, remainingTime)
          }
          return { ...t, isPaused: false, startTime: Date.now() }
        }
        return t
      }),
    )
  }

  const showToastCallback: TShowToastFn = useCallback(
    (id, type = 'info', message, options) => {
      id = id || crypto.randomUUID()
      const currentTime = Date.now()
      const toast: TToastItem = {
        visible: true,
        id,
        type,
        message,
        options: {
          ...globalOptions,
          ...options,
        },
        startTime: currentTime,
        remainingTime: options?.duration || globalOptions.duration || 0,
        isPaused: false,
      }

      // if id found in existing array, update its message, otherwise add new
      setToasts((prev) => {
        const existingIndex = prev.findIndex((t) => t.id === toast.id)
        if (existingIndex === -1) {
          return [...prev, toast]
        }
        const next = [...prev]
        next[existingIndex] = toast
        return next
      })

      if (toast.options.duration && toast.options.duration > 0) {
        setTimer(id, toast.options.duration)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [globalOptions],
  )

  const closeToastCallback = (id?: string) => {
    if (id) {
      clearTimer(id)
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, visible: false } : t)),
      )
    } else {
      // Clear all timers
      timersRef.current.forEach((timer) => {
        clearTimeout(timer)
      })
      timersRef.current.clear()
      setToasts((prev) => prev.map((t) => ({ ...t, visible: false })))
    }
  }

  useEffect(() => {
    registerToast(showToastCallback, closeToastCallback)
    return () => {
      unregisterToast()
      // Clear all timers on cleanup
      timersRef.current.forEach((timer) => clearTimeout(timer))
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timersRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToastCallback])

  // Delay removal of toasts with visible === false to allow exit animation to complete
  useEffect(() => {
    const timers = toasts
      .filter((t) => !t.visible)
      .map((toast) =>
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id))
        }, TOAST_ANIMATION_DURATION),
      )

    return () => timers.forEach(clearTimeout)
  }, [toasts])

  return (
    <>
      {TOAST_POSITIONS.map((pos) => {
        let group = toasts.filter((t) => t.options.position === pos)

        if (limit && group.length > limit) {
          group = group.slice(-limit)
        }
        if (!group.length) {
          return null
        }

        const isBottom = pos.startsWith('bottom')

        return (
          <div
            key={pos}
            className={cn(
              'pointer-events-none fixed inset-0 z-100 flex gap-2 p-4',
              isBottom ? 'flex-col-reverse' : 'flex-col',
            )}
          >
            {group.map((t, i) => (
              <div
                key={t.id}
                className={cn(
                  'text-16 group pointer-events-auto relative flex w-fit items-center justify-between gap-1 overflow-hidden rounded-lg border border-black/20 bg-white p-6 shadow-sm',
                  t.type && listTypeClassOption[t.type],
                  listPositionClass[pos],
                  t.visible
                    ? isBottom
                      ? 'animate-toast-in-bottom'
                      : 'animate-toast-in-top'
                    : isBottom
                      ? 'animate-toast-out-bottom'
                      : 'animate-toast-out-top',
                  t.options.className,
                )}
                style={
                  i === 0 // Apply offset to the first child based on the toast position
                    ? {
                        [isBottom ? 'marginBottom' : 'marginTop']:
                          t.options.offset,
                      }
                    : {}
                }
                onMouseEnter={() =>
                  t.options.pauseOnHover && t.id && pauseToast(t.id)
                }
                onMouseLeave={() =>
                  t.options.pauseOnHover && t.id && resumeToast(t.id)
                }
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    t.options.contentClassName,
                  )}
                >
                  {t.type && listTypeIconOption[t.type]}
                  {t.message}
                </div>
                {t.options.closable && (
                  <XIcon
                    size={16}
                    className={cn(
                      'absolute top-2 right-2 shrink-0 cursor-pointer text-black/50',
                      globalOptions.closeBtnClassName,
                    )}
                    onClick={() => closeToastCallback(t.id)}
                  />
                )}
                {t.options.progressBar && (
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 h-2 w-full',
                      t.type && listTypeClassOption[t.type],
                      'bg-[currentColor]!', // use text color for background
                      'animate-shrink-progress-bar group-hover:animate-pause',
                    )}
                    style={{
                      ...(t.remainingTime
                        ? { animationDuration: `${t.remainingTime}ms` }
                        : {}),
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}
