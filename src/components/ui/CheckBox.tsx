import { cn } from '@/utils'
import React from 'react'

type TCustomCheckboxProps = {
  type?: 'checkbox' | 'radio'
  size?: number
  name?: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  className?: string
}

const CustomCheckbox: React.FC<TCustomCheckboxProps> = ({
  type = 'checkbox',
  name,
  value,
  checked,
  onChange,
  className,
  size = 16,
}) => (
  <label
    className={cn(
      'flex cursor-pointer items-center gap-2 rounded border px-2 py-1',
      checked ? 'border-primary-500 bg-primary-50' : 'border-gray-300',
      className,
    )}
  >
    <input
      type={type}
      name={name}
      value={value}
      checked={checked}
      onChange={() => onChange(value)}
      className='accent-primary-500'
      style={{ width: `${size}`, height: `${size}` }}
    />
  </label>
)

export default CustomCheckbox
