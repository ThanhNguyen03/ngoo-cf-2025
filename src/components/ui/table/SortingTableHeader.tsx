import { ESorting } from '@/types'
import { cn } from '@/utils'
import {
  SortAscendingIcon,
  SortDescendingIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useCallback, useState } from 'react'

type TSortingTableIconProps<T extends Record<string, unknown>> = {
  label: string
  data: T[]
  handleSortData: (data: T[]) => void
  columnKey: keyof T
  isSorting?: boolean
}

export const SortingTableHeader = <T extends Record<string, unknown>>({
  label,
  data,
  handleSortData,
  columnKey,
  isSorting,
}: TSortingTableIconProps<T>) => {
  const [sortBy, setSortBy] = useState<ESorting>()

  const sortData = useCallback(
    (order: ESorting) => {
      const sortedData = [...data].sort((a, b) => {
        const aValue = a[columnKey]
        const bValue = b[columnKey]

        let comparison = 0

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue
        } else if (aValue instanceof Date && bValue instanceof Date) {
          comparison = aValue.getTime() - bValue.getTime()
        } else {
          comparison = String(aValue).localeCompare(String(bValue))
        }

        return order === ESorting.ASC ? comparison : -comparison
      })

      handleSortData(sortedData)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columnKey, data],
  )

  const handleSort = () => {
    const newOrder = sortBy === ESorting.ASC ? ESorting.DESC : ESorting.ASC
    setSortBy(newOrder)
    sortData(newOrder)
  }

  return (
    <div
      onClick={handleSort}
      className={cn(
        'flex cursor-pointer flex-row items-center gap-2',
        isSorting && sortBy && 'text-secondary-500',
      )}
    >
      {sortBy && sortBy === ESorting.ASC ? (
        <SortAscendingIcon size={16} />
      ) : (
        <SortDescendingIcon size={16} />
      )}
      <p className='select-none'>{label}</p>
    </div>
  )
}
