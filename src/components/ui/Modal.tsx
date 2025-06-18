import { type FC, type PropsWithChildren } from 'react'

import type { TModalProps } from '@/types'

import { XIcon } from '@phosphor-icons/react/dist/ssr'
import { cn } from '@/utils'

export const Modal: FC<PropsWithChildren & TModalProps> = ({
  title,
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
          overlayClassName
        )}
        onClick={closeOnOutsideClick ? onClose : undefined}
      >
        <div
          className={cn(
            'rounded-2 flex max-h-full w-80 flex-col border border-white/10 bg-black/50 text-white shadow backdrop-blur-2xl',
            className
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className='p-2'>
            <div className='flex w-full justify-between gap-4 border-b border-white/10 p-2'>
              <h2 className='text-18 font-semibold text-white'>{title}</h2>
              {closable && (
                <XIcon className='cursor-pointer' onClick={onClose} />
              )}
            </div>
          </div>
          <div className='size-full overflow-auto'>{children}</div>
        </div>
      </div>
    )
  )
}
