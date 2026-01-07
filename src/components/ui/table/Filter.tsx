import { useDebounce } from '@/hooks'
import { useClickOutside } from '@/hooks/use-click-outside'
import { TPagination } from '@/types'
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretLineLeftIcon,
  CaretLineRightIcon,
  CaretRightIcon,
} from '@phosphor-icons/react/dist/ssr'
import {
  Dispatch,
  type FC,
  type ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from 'react'

type TLimitFilterProps = {
  options: number[]
  totalItems: number
  initialCount: number
  onChange: (count: number) => void
  disabled?: boolean
}
const LimitFilter: FC<TLimitFilterProps> = ({
  options,
  totalItems,
  initialCount,
  onChange,
  disabled,
}) => {
  const [selectedOption, setSelectedOption] = useState(initialCount)
  const [isOpen, setIsOpen] = useState(false)
  const { ref } = useClickOutside<HTMLButtonElement>(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  })

  const handleSelect = (count: number) => {
    setSelectedOption(count)
    onChange(count)
    setIsOpen(false)
  }

  return (
    <div className='flex items-center space-x-2'>
      <span className='text-14 text-neutral-600'>Show</span>

      <div className='relative'>
        <button
          ref={ref}
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className='text-14 border-dark-600/10 flex h-[28px] w-[56px] cursor-pointer flex-row items-center justify-between rounded-md border bg-white px-2 py-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
        >
          <span>{selectedOption}</span>
          <CaretDownIcon />
        </button>

        {isOpen && (
          <div className='border-dark-600/10 absolute z-50 mt-1 w-fit rounded-md border bg-white shadow-lg'>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className='flex w-full flex-row gap-1 px-4 py-2 text-left text-neutral-700 hover:bg-neutral-300'
              >
                <div>{option}</div>
                <div>results</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <span className='text-14 text-neutral-600'>
        of <span className='text-14 pl-1'>{totalItems}</span>
      </span>
    </div>
  )
}

const DEFAULT_SEARCH_TIME_OUT = 600
const DEFAULT_OPTION_ITEM = [10, 25, 50, 100]
type TFilterProps = {
  leftSide?: ReactNode
  pagination?: TPagination
  setPagination?: Dispatch<SetStateAction<TPagination>>
  totalPageList: number
  disableChangePage?: boolean
  setLoadingData?: Dispatch<SetStateAction<boolean>>
}
export const Filter: FC<TFilterProps> = ({
  setPagination,
  setLoadingData,
  pagination,
  totalPageList,
  leftSide,
  disableChangePage,
}) => {
  const totalPages = Math.ceil((totalPageList || 0) / (pagination?.limit || 1))
  const currentPage =
    Math.ceil((pagination?.offset || 0) / (pagination?.limit || 1)) + 1
  const [limitNum, setLimitNum] = useState<number>(10)
  const [pageInput, setPageInput] = useState<string>(String(currentPage))
  const debouncedPage = useDebounce<string>(pageInput, DEFAULT_SEARCH_TIME_OUT)

  useEffect(() => {
    setPageInput(String(currentPage))
  }, [currentPage])

  useEffect(() => {
    if (setLoadingData) {
      loadingEffect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadingEffect = () => {
    if (!setLoadingData) {
      return
    }
    setLoadingData(true)
    const loading = setTimeout(() => {
      setLoadingData(false)
    }, DEFAULT_SEARCH_TIME_OUT)

    return () => {
      clearTimeout(loading)
    }
  }

  // Handlers for pagination controls
  const goToFirstPage = () => {
    if (setPagination && pagination) {
      loadingEffect()
      setPagination((prev) => ({ ...prev, offset: 0 }))
    }
  }

  const goToPreviousPage = () => {
    if (setPagination && pagination?.offset && pagination.offset > 0) {
      loadingEffect()
      setPagination((prev) => ({
        ...prev,
        offset: (prev.offset || 0) - (prev.limit || 0),
      }))
    }
  }

  const goToNextPage = () => {
    if (
      setPagination &&
      pagination &&
      (pagination.offset || 0) + (pagination?.limit || 0) < (totalPageList || 0)
    ) {
      loadingEffect()
      setPagination((prev) => ({
        ...prev,
        offset: (prev.offset || 0) + (prev.limit || 0),
      }))
    }
  }

  const goToLastPage = () => {
    if (setPagination && pagination) {
      loadingEffect()
      const lastPageOffset = Math.max(
        (totalPageList || 0) - (pagination.limit || 0),
        0,
      )
      setPagination((prev) => ({ ...prev, offset: lastPageOffset }))
    }
  }

  // Handler for changing items per page
  const handleLimitChange = (value: number) => {
    setLimitNum(value)
    if (setPagination && pagination) {
      loadingEffect()
      setPagination((prev) => ({ ...prev, limit: value, offset: 0 })) // Reset to first page
    }
  }

  useEffect(() => {
    const pageNumber = Math.max(1, Math.min(Number(debouncedPage), totalPages))
    if (!setPagination || !pagination || isNaN(pageNumber)) {
      return
    }

    if (pageNumber !== Number(pageInput)) {
      setPageInput(String(pageNumber))
    }
    setPagination((prev) => ({
      ...prev,
      offset: (pageNumber - 1) * (prev.limit || 1),
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPage, totalPages])

  const handleChangePage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value)
  }

  return (
    <section className='flex w-full flex-row items-center justify-between'>
      <div>{leftSide}</div>

      <div className='flex flex-row items-center gap-6'>
        <LimitFilter
          options={DEFAULT_OPTION_ITEM}
          totalItems={totalPageList}
          initialCount={10}
          onChange={handleLimitChange}
          disabled={totalPageList === 0}
        />

        <div className='flex items-center gap-2'>
          <nav className='flex items-center gap-x-1' aria-label='Pagination'>
            <button
              type='button'
              className='text-dark-600 inline-flex size-6 items-center justify-center text-sm duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Previous'
              onClick={goToFirstPage}
              disabled={currentPage === 1 || disableChangePage}
            >
              <CaretLineLeftIcon />
            </button>
            <button
              type='button'
              className='text-dark-600 inline-flex size-6 items-center justify-center text-sm duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Previous'
              onClick={goToPreviousPage}
              disabled={currentPage === 1 || disableChangePage}
            >
              <CaretLeftIcon />
              <span className='sr-only'>Previous</span>
            </button>
            <div className='flex items-center'>
              <input
                className='rounded-2 text-dark-600 border-dark-600/30 flex size-7 items-center justify-center border text-center text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                value={pageInput}
                type='number'
                aria-label='Enter page'
                min={1}
                max={totalPages}
                onChange={handleChangePage}
                disabled={disableChangePage || limitNum >= totalPageList}
              />
              <span className='flex min-h-8 items-center justify-center px-1.5 py-1.5 text-sm text-neutral-500'>
                of
              </span>
              <span className='flex min-h-8 items-center justify-center px-1.5 py-1.5 text-sm text-neutral-500'>
                {totalPages}
              </span>
            </div>
            <button
              type='button'
              className='text-dark-600 inline-flex size-6 items-center justify-center text-sm duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Next'
              onClick={goToNextPage}
              disabled={
                currentPage === totalPages ||
                totalPages === 0 ||
                disableChangePage
              }
            >
              <span className='sr-only'>Next</span>
              <CaretRightIcon />
            </button>
            <button
              type='button'
              className='text-dark-600 inline-flex size-6 items-center justify-center text-sm duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
              aria-label='Previous'
              onClick={goToLastPage}
              disabled={
                currentPage === totalPages ||
                totalPages === 0 ||
                disableChangePage
              }
            >
              <CaretLineRightIcon />
            </button>
          </nav>
        </div>
      </div>
    </section>
  )
}
