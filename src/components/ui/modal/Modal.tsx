import { type FC, type PropsWithChildren } from 'react'

import type { TModalProps } from '@/types'

import { cn } from '@/utils'
import { XIcon } from '@phosphor-icons/react/dist/ssr'

export const Modal: FC<PropsWithChildren & TModalProps> = ({
  children,
  isOpen,
  onClose,
  closable = true,
  closeOnOutsideClick,
  className,
  overlayClassName,
}) => {
  return (
    isOpen && (
      <div
        className={cn(
          'fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/30 p-2 backdrop-blur-sm',
          overlayClassName,
        )}
        onClick={closeOnOutsideClick ? onClose : undefined}
      >
        <div
          className={cn(
            'rounded-2 flex max-h-full w-full max-w-80 flex-col border border-dark-600/10 bg-white/70 text-dark-600 shadow backdrop-blur-2xl',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {closable && (
            <XIcon
              className='cursor-pointer absolute right-4 top-4 z-10'
              onClick={onClose}
            />
          )}
          <div className='size-full overflow-auto'>{children}</div>
        </div>
      </div>
    )
  )
}
