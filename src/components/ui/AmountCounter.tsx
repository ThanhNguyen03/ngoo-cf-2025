import { cn } from '@/utils'
import { MinusIcon, PlusIcon } from '@phosphor-icons/react/dist/ssr'
import { FC } from 'react'
import Button from './Button'

type TAmountCounter = {
  isInputAmount?: boolean
  className?: string
  buttonClassName?: string
  amountClassName?: string
  amount?: number
  onChange: (amount: number) => void
}

const AmountCounter: FC<TAmountCounter> = ({
  isInputAmount,
  className,
  amount = 1,
  onChange,
  buttonClassName,
  amountClassName,
}) => {
  const onChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*$/.test(value)) {
      onChange(Number(value) || 0)
    }
  }

  const handleUpdateAmount = (amount: number) => {
    const safeValue = Math.max(0, amount)
    onChange(safeValue)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center gap-2 md:gap-4',
        className,
      )}
    >
      <Button
        onClick={() => handleUpdateAmount(amount - 1)}
        disabled={amount < 1}
        className={cn('rounded-full bg-green-500 p-1.5', buttonClassName)}
        disableAnimation
        icon={<MinusIcon className='text-white' size={14} weight='bold' />}
      />
      {isInputAmount ? (
        <input
          className={cn(
            'rounded-2 flex size-8 items-center justify-center border border-neutral-900/10 text-center text-sm text-neutral-800 lining-nums focus-within:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none disabled:opacity-50',
            amountClassName,
          )}
          type='number'
          aria-label='Enter page'
          value={String(amount)}
          min={0}
          onChange={onChangeAmount}
        />
      ) : (
        <p
          className={cn(
            'rounded-2 text-16 flex size-8 items-center justify-center text-center text-white lining-nums',
            amountClassName,
          )}
        >
          {amount}
        </p>
      )}
      <Button
        onClick={() => handleUpdateAmount(amount + 1)}
        className={cn('rounded-full bg-green-500 p-1.5', buttonClassName)}
        disableAnimation
        icon={<PlusIcon className='text-white' size={14} weight='bold' />}
      />
    </div>
  )
}

export default AmountCounter
