import { TIconProps } from '@/types'
import { cn } from '@/utils'
import { FC } from 'react'

const SaleTagIcon: FC<TIconProps & { amountDiscount: number }> = ({
  fill = '#E63946',
  height = 20,
  className,
  amountDiscount,
}) => {
  return (
    <div
      style={{
        height: `${height}px`,
        backgroundColor: `${fill}`,
      }}
      className={cn(
        'text-12 font-semibold text-nowrap flex w-fit items-center relative',
        className,
      )}
    >
      <div
        className='bg-white rotate-45 -translate-x-1/2'
        style={{
          width: `${height / Math.sqrt(2.05)}px`,
          height: `${height / Math.sqrt(2.05)}px`,
        }}
      />
      <p className='text-beige-50'>-{amountDiscount}%</p>
      <div
        className='bg-white rotate-45 translate-x-1/2'
        style={{
          width: `${height / Math.sqrt(2.05)}px`,
          height: `${height / Math.sqrt(2.05)}px`,
          backgroundColor: `${fill}`,
        }}
      />
    </div>
  )
}

export default SaleTagIcon
