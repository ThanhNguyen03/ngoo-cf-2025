import { cn } from '@/utils'
import { CaretUpIcon } from '@phosphor-icons/react/dist/ssr'
import { FC } from 'react'

type TDropdownProps = {
  openDropdown: boolean
  children: React.ReactNode
  onChange?: () => void
  defaultValue?: string | React.ReactNode
  ref?: React.Ref<HTMLDivElement>
  className?: string
  selectButtonClassName?: string
  valueClassName?: string
  dropdownClassName?: string
  iconClassName?: string
  disabled?: boolean
}

export const SelectDropdown: FC<TDropdownProps> = ({
  className,
  children,
  openDropdown,
  onChange,
  defaultValue,
  ref,
  selectButtonClassName,
  valueClassName,
  dropdownClassName,
  iconClassName,
  disabled,
}) => {
  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-start duration-700',
        className,
      )}
      ref={ref}
    >
      <button
        onClick={onChange}
        disabled={disabled}
        className={cn(
          'group rounded-3 z-20 flex w-full cursor-pointer items-center gap-2 bg-white p-2',
          openDropdown
            ? 'border-primary-500 rounded-b-none border border-b-0'
            : 'border-dark-600/30 hover:border-primary-500 border duration-700',
          selectButtonClassName,
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        )}
      >
        {defaultValue && typeof defaultValue === 'string' ? (
          <>
            <p
              className={cn(
                'text-14 text-primary-500 w-full text-left font-semibold text-nowrap duration-700',
                valueClassName,
              )}
            >
              {defaultValue || 'Select an option'}
            </p>
            <CaretUpIcon
              size={20}
              className={cn(
                'group-hover:text-primary-500 text-dark-600/50 w-fit',
                openDropdown && 'rotate-180 duration-300',
                iconClassName,
              )}
            />
          </>
        ) : (
          defaultValue
        )}
      </button>

      {/* dropdown */}
      <div
        className={cn(
          'border-primary-500 rounded-3 relative z-10 flex w-full flex-col items-start gap-2 overflow-hidden rounded-t-none border border-t-0 bg-white shadow-md duration-300',
          openDropdown ? 'max-h-[1000px]' : 'max-h-0 border-0',
          dropdownClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
