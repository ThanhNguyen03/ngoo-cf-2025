import { cn } from '@/utils'
import { type PropsWithChildren, useState } from 'react'

type TPosition = 'top' | 'bottom' | 'left' | 'right'

type TTooltipProps = PropsWithChildren & {
  content: string
  position?: TPosition
  onShow?: () => void
  onHide?: () => void
  className?: string
}

export const Tooltip = ({
  content,
  children,
  position = 'top',
  onShow,
  onHide,
  className,
}: TTooltipProps) => {
  const [visible, setVisible] = useState(false)

  const positionClass = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  }[position]

  const handleMouseEnter = () => {
    setVisible(true)
    onShow?.()
  }

  const handleMouseLeave = () => {
    setVisible(false)
    onHide?.()
  }

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {visible && (
        <div
          className={cn(
            'absolute z-10 rounded bg-black/70 px-2 py-1 text-sm whitespace-nowrap text-white',
            positionClass
          )}
        >
          {content}
        </div>
      )}
    </div>
  )
}
