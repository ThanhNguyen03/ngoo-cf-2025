import { cn } from '@/utils'
import { FC } from 'react'

type TSkeletonLoaderProps = {
  className?: string
  children?: React.ReactNode
  loading: boolean
}

export const SkeletonLoader: FC<TSkeletonLoaderProps> = ({
  className,
  children,
  loading,
}) => (
  <>
    <div
      className={cn(
        loading
          ? 'hidden'
          : children
            ? ['flex max-h-fit w-full opacity-100 duration-500', className]
            : 'hidden',
      )}
    >
      {children}
    </div>
    <div
      className={cn(
        'duration-500',
        !loading
          ? 'absolute max-h-0 opacity-0'
          : [
              'rounded-2 w-full animate-pulse bg-neutral-900/5 backdrop-blur-lg',
              className,
            ],
      )}
    />
  </>
)
