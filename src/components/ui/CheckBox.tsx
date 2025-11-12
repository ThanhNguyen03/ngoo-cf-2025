'use client'

import { cn } from '@/utils'
import { CheckIcon } from '@phosphor-icons/react'
import { forwardRef, InputHTMLAttributes } from 'react'

type TCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string
  labelClassName?: string
  type: 'checkbox' | 'radio'
}

export const Checkbox = forwardRef<HTMLInputElement, TCheckboxProps>(
  (
    {
      type = 'checkbox',
      id,
      checked,
      label,
      size,
      disabled,
      className,
      labelClassName,
      ...props
    },
    ref,
  ) => {
    const checkboxId = id || `checkbox-${label}`
    return (
      <>
        <div
          className='relative size-5'
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <input
            id={checkboxId}
            ref={ref}
            type={type}
            checked={checked}
            disabled={disabled}
            className={cn(
              'size-5 cursor-pointer appearance-none border-2 border-neutral-900/10 bg-white transition-all duration-300', // default
              type === 'checkbox' ? 'rounded' : 'rounded-full', // Type
              !disabled && 'hover:border-primary-500', // Hover
              type === 'checkbox'
                ? 'checked:border-primary-500 checked:bg-primary-500'
                : 'checked:border-primary-500 checked:border', // Checked
              'focus:ring-0 focus:outline-none', // Focus
              disabled && 'cursor-not-allowed opacity-30', // Disabled
              className,
            )}
            {...props}
          />

          {checked && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0 flex items-center justify-center',
                disabled ? 'text-gray-500' : 'text-white',
                type === 'radio' && 'p-[3px]',
              )}
            >
              {type === 'checkbox' ? (
                <CheckIcon size={16} weight='bold' />
              ) : (
                <div
                  className={cn(
                    'bg-primary-500 size-full rounded-full',
                    disabled && 'bg-neutral-900 opacity-30',
                  )}
                />
              )}
            </div>
          )}
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className={cn(
              'text-16 cursor-pointer text-neutral-900 capitalize hover:font-semibold',
              disabled && 'cursor-not-allowed opacity-30',
              labelClassName,
              checked && 'font-semibold',
            )}
          >
            {label}
          </label>
        )}
      </>
    )
  },
)

Checkbox.displayName = 'Checkbox'
