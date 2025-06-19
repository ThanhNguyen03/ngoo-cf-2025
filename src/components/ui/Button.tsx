import { cn } from '@/utils'
import React, { FC, PropsWithChildren } from 'react'

type TButtonProps = PropsWithChildren & {
  icon?: React.ReactNode
  className?: string
  iconRight?: boolean
  disableAnimation?: boolean
}

const Button: FC<TButtonProps> = ({
  icon,
  children,
  className,
  iconRight,
  disableAnimation,
}) => {
  return (
    <button
      className={cn(
        'flex gap-2 items-center justify-center px-3 py-1.5 rounded-2 disabled:opacity-50 disabled:bg-shade-500 font-semibold text-16! text-white cursor-pointer',
        className,
        iconRight && 'flex-row-reverse',
        !disableAnimation && 'button-animation'
      )}
    >
      {children}
      <div>{icon}</div>
    </button>
  )
}

export default Button
