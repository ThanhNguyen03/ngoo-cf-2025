import { cn } from '@/utils'
import React, { FC, PropsWithChildren } from 'react'

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
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
  ...props
}) => {
  return (
    <button
      {...props}
      className={cn(
        'rounded-2 text-16! flex cursor-pointer items-center justify-center gap-2 px-3 py-1.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30',
        className,
        iconRight && 'flex-row-reverse',
        !disableAnimation && 'button-animation',
      )}
    >
      {children}
      <div>{icon}</div>
    </button>
  )
}

export default Button
