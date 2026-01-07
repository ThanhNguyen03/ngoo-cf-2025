import { useClickOutside } from '@/hooks/use-click-outside'
import { TListStatus } from '@/types'
import { cn } from '@/utils'
import { CaretUp, Check } from '@phosphor-icons/react'
import { useState } from 'react'

const getStatusClass = <T extends string>(
  status: T | 'Status' | undefined,
  listStatusClass: Record<T, string>,
): string => {
  return status && status !== 'Status'
    ? listStatusClass[status]
    : 'bg-white text-neutral-900/70'
}

type TSortingStatusProps<T extends string> = {
  selectedStatus: TListStatus<T>
  listStatus: TListStatus<T>[]
  setSelectedStatus: React.Dispatch<React.SetStateAction<TListStatus<T>>>
  listStatusClass: Record<T, string>
}

export const SortingStatusButton = <T extends string>({
  selectedStatus,
  listStatus,
  setSelectedStatus,
  listStatusClass,
}: TSortingStatusProps<T>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { ref } = useClickOutside<HTMLDivElement>(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  return (
    <div className='relative'>
      <div
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'text-14 flex w-fit cursor-pointer flex-row items-center gap-2 rounded-md px-2 py-1 focus:outline-none',
          getStatusClass(selectedStatus, listStatusClass),
        )}
      >
        <span className='capitalize'>{String(selectedStatus)}</span>
        <CaretUp
          size={16}
          className={cn(
            'text-neutral-900/30 duration-500',
            isOpen ? 'rotate-180' : 'rotate-0',
            getStatusClass(selectedStatus, listStatusClass),
          )}
        />
      </div>

      {isOpen && (
        <div className='rounded-2 absolute z-50 mt-1 w-fit border border-neutral-900/10 bg-white shadow-lg'>
          {listStatus.map((option) => (
            <button
              key={String(option)}
              onClick={() => {
                setIsOpen(false)
                setSelectedStatus(option || 'Status')
              }}
              className='flex w-full gap-3 px-3 py-2 text-neutral-700 hover:bg-neutral-300'
            >
              <div className='size-3'>
                {selectedStatus === option && (
                  <Check size={16} className='text-neutral-900/50' />
                )}
              </div>
              <p className='text-right capitalize'>{String(option)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
