import { cn } from '@/utils'
import { FC } from 'react'

type TTextInputProps = React.ComponentProps<'input'> & {
  errorMessage?: string
  disabled?: boolean
  isRequired?: boolean
  label: string
  className?: string
  labelClassName?: string
  inputClassName?: string
}
export const TextInput: FC<TTextInputProps> = ({
  className,
  labelClassName,
  inputClassName,
  errorMessage,
  disabled,
  isRequired,
  label,
  ...props
}) => {
  return (
    <div className={cn('relative flex w-full flex-col items-start', className)}>
      <div className='center absolute -top-4 left-3 z-10 w-full justify-between'>
        <p
          className={cn(
            'font-small-caps text-16 text-dark-600 relative bg-white px-2 font-bold',
            labelClassName,
          )}
        >
          {label}
          {isRequired && (
            <span className='text-28 absolute -top-1 right-0 text-red-500'>
              *
            </span>
          )}
        </p>
      </div>

      <label
        className={cn(
          'text-14! group border-dark-600/30 relative flex min-h-10 w-full items-center gap-1 rounded-xl border bg-white p-2',
          'hover:border-primary-500 focus-within:border-primary-500',
          !!errorMessage && 'border-red-500!',
          disabled && 'cursor-not-allowed opacity-30',
          inputClassName,
        )}
        htmlFor={label}
      >
        <input
          {...props}
          type='text'
          id={label}
          disabled={disabled}
          className='placeholder:text-dark-600/30 relative w-full font-medium caret-blue-500 duration-700 focus-within:outline-none focus:ring-0 focus:ring-offset-0 disabled:cursor-not-allowed'
        />
      </label>
      {errorMessage && (
        <span className='text-secondary-500 text-12 absolute -bottom-4 left-1'>
          {errorMessage}
        </span>
      )}
    </div>
  )
}
