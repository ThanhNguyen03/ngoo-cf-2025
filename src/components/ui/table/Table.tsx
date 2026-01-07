import { cn } from '@/utils'

export type TTableColumn<T> = {
  title: string
  key: keyof T & string
  width?: string | number
  headerRender?: (item: TTableColumn<T>, index: number) => React.ReactNode
  cellRender?: (item: T, index: number) => React.ReactNode
  headerCellClassName?: string
  cellClassName?: string
}

type TTableProps<T extends Record<string, unknown>> = {
  data: T[]
  columns: TTableColumn<T>[]
  onRowClick?: (data?: T, index?: number) => void
  wrapperClassName?: string
  className?: string
  headerRowClassName?: string
  headerCellClassName?: string
  rowClassName?: string
  cellClassName?: string
}

export const Table = <T extends Record<string, unknown>>({
  data,
  columns,
  onRowClick,
  wrapperClassName,
  className,
  headerRowClassName,
  headerCellClassName,
  rowClassName,
  cellClassName,
}: TTableProps<T>) => {
  return (
    <div
      className={cn(
        'rounded-2 flex w-full flex-col gap-3 border border-neutral-900/10 bg-white text-left duration-300',
        wrapperClassName,
      )}
    >
      <div
        className={cn(
          'border-dark-600/10 rounded-2 w-full overflow-auto border bg-white',
          className,
        )}
      >
        <table className={cn('w-full', data.length === 0 && 'h-full')}>
          <colgroup>
            {columns.map((col, i) => (
              <col key={i} style={{ width: col.width ?? 'auto' }} />
            ))}
          </colgroup>
          <thead className='sticky top-0 z-10'>
            <tr
              className={cn(
                'text-dark-600/70 border-dark-600/10 h-11 border-b bg-white',
                headerRowClassName,
              )}
            >
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-14! group border-dark-600/10 text-dark-600/70 border-b px-2 text-start leading-[160%] font-semibold',
                    headerCellClassName,
                    column.headerCellClassName,
                  )}
                >
                  <div className='flex items-center justify-between gap-3'>
                    {column.headerRender
                      ? column.headerRender(column, index)
                      : column.title}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  onClick={() => onRowClick?.(item, index)}
                  key={index}
                  className={cn(
                    'border-dark-600/10 from-paper cursor-pointer border-b to-white last:border-0 hover:bg-gradient-to-r',
                    rowClassName,
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'text-14 -z-50 h-fit px-2 py-3 leading-[160%] select-none',
                        cellClassName,
                        column.cellClassName,
                      )}
                    >
                      {column.cellRender
                        ? column.cellRender(item, index)
                        : (item[column.key] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <p className='flex min-h-60 w-full items-center justify-center'>
                    No data found
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
