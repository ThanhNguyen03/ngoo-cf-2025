'use client'

import { cn } from '@/utils'
import Link, { LinkProps } from 'next/link'
import React, { FC, ReactNode, useState } from 'react'

type TButtonVariant =
  | 'black'
  | 'blue'
  | 'green'
  | 'white'
  | 'teal'
  | 'gray'
  | 'pink'

type TCommonProps = {
  variant?: TButtonVariant
  className?: string
  children: ReactNode
}

type TAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  LinkProps &
  TCommonProps

type TButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  TCommonProps & {
    href?: undefined
  }

type TUnionButtonProps = TAnchorProps | TButtonProps

const SwitchButton: FC<TUnionButtonProps> = ({
  variant = 'green',
  children,
  className,
  ...props
}: TUnionButtonProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false)

  const listVariantClass: Record<TButtonVariant, string> = {
    green:
      'bg-green-500 shadow-btn-green-500/30 hover:bg-green-400 hover:shadow-btn-green-500/70',
    blue: 'bg-blue-500 shadow-btn-blue-500/30 hover:bg-blue-400 hover:shadow-btn-blue-500/70',
    gray: 'bg-gray-200 shadow-btn-white/30 hover:bg-white',
    white: 'bg-white shadow-btn-white/30 hover:bg-white',
    black:
      'bg-neutral-900 dark-shadow-btn-neutral-900/30 hover:bg-gray-800 hover:dark-shadow-btn-neutral-900/50',
    teal: 'bg-teal-400 shadow-btn-teal-400/30 hover:bg-teal-300 hover:shadow-btn-teal-400/50',
    pink: 'bg-pink-500 shadow-btn-pink-500/30 hover:bg-pink-400 hover:shadow-btn-pink-500/70',
  }

  const listClickedClass: Record<TButtonVariant, string> = {
    green: 'shadow-clicked-btn-green-500/30 bg-green-400 hover:bg-green-400',
    blue: 'shadow-clicked-btn-blue-500/30 bg-blue-500 hover:bg-blue-500',
    gray: 'shadow-clicked-btn-white/30 bg-gray-200 hover:bg-gray-200',
    white: 'shadow-clicked-btn-white/30 bg-white hover:bg-white',
    black:
      'dark-shadow-clicked-btn-neutral-900/30 bg-neutral-900 hover:bg-neutral-900',
    teal: 'shadow-clicked-btn-teal-400/30 bg-teal-400 hover:bg-teal-400',
    pink: 'shadow-clicked-btn-pink-500/30 bg-pink-400 hover:bg-pink-400',
  }

  const buttonClass = cn(
    'rounded-4 mb-0.5 flex size-full min-h-12 cursor-pointer items-center justify-center px-3 py-2 transition-colors duration-100 hover:border-white/50',
    isClicked ? listClickedClass[variant] : listVariantClass[variant],
    variant === 'white' || variant === 'gray'
      ? 'border border-neutral-900/10 text-neutral-900 hover:border-neutral-900/10'
      : 'border border-white/70 text-white',
    'disabled:shadow-btn-white disabled:cursor-not-allowed disabled:bg-neutral-900 disabled:opacity-30',
    className,
  )

  if ('href' in props) {
    const { href, ...anchorProps } = props as TAnchorProps
    return (
      <Link
        href={href}
        className={buttonClass}
        {...anchorProps}
        onPointerDown={() => setIsClicked(true)}
        onPointerUp={() => setIsClicked(false)}
        onPointerLeave={() => setIsClicked(false)}
      >
        {children}
      </Link>
    )
  }

  return (
    <button
      className={buttonClass}
      {...props}
      onPointerDown={() => setIsClicked(true)}
      onPointerUp={() => setIsClicked(false)}
      onPointerLeave={() => setIsClicked(false)}
    >
      {children}
    </button>
  )
}

export default SwitchButton
