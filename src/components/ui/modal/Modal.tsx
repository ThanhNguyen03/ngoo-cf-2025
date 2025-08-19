import { useEffect, type FC, type PropsWithChildren } from 'react'

import type { TModalProps } from '@/types'

import { cn } from '@/utils'
import { XIcon } from '@phosphor-icons/react/dist/ssr'
import { createPortal } from 'react-dom'

export const Modal: FC<PropsWithChildren & TModalProps> = ({
  children,
  isOpen,
  onClose,
  closable = true,
  closeOnOutsideClick,
  className,
  overlayClassName,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  return (
    isOpen &&
    createPortal(
      <div
        className={cn(
          'fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 p-2 backdrop-blur-sm',
          overlayClassName,
        )}
        onClick={closeOnOutsideClick ? onClose : undefined}
      >
        <div
          className={cn(
            'rounded-2 border-dark-600/10 text-dark-600 flex max-h-full w-full max-w-[80%] min-w-80 flex-col border bg-white/70 shadow backdrop-blur-2xl',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {closable && (
            <XIcon
              className='absolute top-4 right-4 z-10 cursor-pointer'
              onClick={onClose}
            />
          )}
          <div className='size-full overflow-auto'>{children}</div>
        </div>
      </div>,
      document.body,
    )
  )
}
