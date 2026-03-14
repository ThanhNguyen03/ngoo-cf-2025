import { cn } from '@/utils'
import { CircleNotch } from '@phosphor-icons/react/dist/ssr'
import React, { FC, PropsWithChildren } from 'react'

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & {
    icon?: React.ReactNode
    className?: string
    iconRight?: boolean
    disableAnimation?: boolean
    loading?: boolean
  }

export const Button: FC<TButtonProps> = ({
  icon,
  children,
  className,
  iconRight,
  disableAnimation,
  loading,
  disabled,
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(
        'rounded-2 text-16! flex cursor-pointer items-center justify-center gap-2 px-3 py-1.5 font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30',
        className,
        iconRight && 'flex-row-reverse',
        !disableAnimation && 'button-animation',
        loading && 'cursor-wait opacity-70',
      )}
    >
      {loading ? <CircleNotch size={16} className='animate-spin' /> : children}
      {icon && !loading && <div>{icon}</div>}
    </button>
  )
}
