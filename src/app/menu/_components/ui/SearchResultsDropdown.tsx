'use client'

import { EItemModalDetailStatus, ItemDetailModal } from '@/components/ui/modal'
import {
  EBehaviorEvent,
  HotSearchTermsQuery,
  SearchItemsQuery,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import { useTrackBehavior } from '@/hooks'
import { cn } from '@/utils'
import {
  ClockIcon,
  FireIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC, useState } from 'react'

type TSearchResultsDropdownProps = {
  isOpen: boolean
  isLoading: boolean
  searchTerm: string
  results: SearchItemsQuery['searchItems'] | undefined
  hotTerms: HotSearchTermsQuery['hotSearchTerms'] | undefined
  recentSearches: string[]
  onSelectTerm: (term: string) => void
  onClearRecent: () => void
}

export const SearchResultsDropdown: FC<TSearchResultsDropdownProps> = ({
  isOpen,
  isLoading,
  searchTerm,
  results,
  hotTerms,
  recentSearches,
  onSelectTerm,
  onClearRecent,
}) => {
  const [selectedItem, setSelectedItem] = useState<TItemResponse>()
  const [modalOpen, setModalOpen] = useState(false)
  const { track } = useTrackBehavior()

  if (!isOpen) return null

  const hasHotTerms = hotTerms && hotTerms.length > 0
  const hasRecent = recentSearches.length > 0
  const hasResults = results && results.records.length > 0
  const showEmpty =
    searchTerm.trim().length > 0 && !isLoading && results && results.total === 0

  return (
    <>
      <div
        className={cn(
          'absolute top-full left-0 z-50 mt-1 w-full min-w-[260px] overflow-hidden rounded-2xl border border-dark-600/10 bg-white shadow-lg',
        )}
      >
        {/* Empty search state: hot + recent */}
        {!searchTerm.trim() && (
          <div className='flex flex-col gap-0'>
            {hasHotTerms && (
              <div className='px-4 pt-3 pb-1'>
                <div className='text-12! text-dark-600/50 mb-2 flex items-center gap-1 font-medium uppercase tracking-wider'>
                  <FireIcon size={12} weight='fill' className='text-secondary-500' />
                  Hot Searches
                </div>
                <div className='flex flex-wrap gap-1.5'>
                  {hotTerms!.map(({ term }) => (
                    <button
                      key={term}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onSelectTerm(term)
                      }}
                      className='text-12! text-primary-500 hover:bg-primary-500 hover:text-white border-primary-500/30 cursor-pointer rounded-full border px-3 py-1 transition-colors'
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {hasRecent && (
              <div className='border-dark-600/10 px-4 pt-3 pb-2'>
                <div className='text-12! text-dark-600/50 mb-2 flex items-center justify-between font-medium uppercase tracking-wider'>
                  <span className='flex items-center gap-1'>
                    <ClockIcon size={12} />
                    Recent
                  </span>
                  <button
                    onMouseDown={(e) => {
                      e.preventDefault()
                      onClearRecent()
                    }}
                    className='text-11! text-dark-600/40 hover:text-secondary-500 cursor-pointer transition-colors'
                  >
                    Clear all
                  </button>
                </div>
                <div className='flex flex-col'>
                  {recentSearches.slice(0, 5).map((term) => (
                    <button
                      key={term}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        onSelectTerm(term)
                      }}
                      className='text-14! text-dark-600/70 hover:bg-dark-600/5 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors'
                    >
                      <MagnifyingGlassIcon size={14} className='text-dark-600/30 shrink-0' />
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasHotTerms && !hasRecent && (
              <div className='text-14! text-dark-600/40 px-4 py-6 text-center'>
                Start typing to search...
              </div>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {searchTerm.trim() && isLoading && (
          <div className='flex flex-col gap-2 p-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='flex items-center gap-3'>
                <div className='bg-dark-600/10 h-10 w-10 shrink-0 animate-pulse rounded-lg' />
                <div className='flex flex-1 flex-col gap-1.5'>
                  <div className='bg-dark-600/10 h-3 w-3/4 animate-pulse rounded' />
                  <div className='bg-dark-600/10 h-3 w-1/3 animate-pulse rounded' />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty results */}
        {showEmpty && (
          <div className='px-4 py-6 text-center'>
            <MagnifyingGlassIcon size={24} className='text-dark-600/20 mx-auto mb-2' />
            <p className='text-14! text-dark-600/50'>
              No results for &ldquo;{searchTerm}&rdquo;
            </p>
          </div>
        )}

        {/* Search results */}
        {searchTerm.trim() && !isLoading && hasResults && (
          <div className='max-h-[360px] overflow-y-auto py-2'>
            <div className='text-12! text-dark-600/40 px-4 pb-1'>
              {results!.total} result{results!.total !== 1 ? 's' : ''}
            </div>
            {results!.records.map((item) => {
              const effectivePrice = item.discountPercent
                ? item.price * (1 - item.discountPercent / 100)
                : item.price
              return (
                <button
                  key={item.itemId}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setSelectedItem(item as TItemResponse)
                    setModalOpen(true)
                    track((item as TItemResponse).itemId, EBehaviorEvent.View)
                  }}
                  className='hover:bg-dark-600/5 flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors'
                >
                  <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-lg'>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className='object-cover'
                      sizes='40px'
                    />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='text-14! text-dark-600 truncate font-medium'>{item.name}</p>
                    <p className='text-12! text-dark-600/50 truncate'>{item.categoryName}</p>
                  </div>
                  <div className='shrink-0 text-right'>
                    <p className='text-13! text-secondary-500 font-semibold'>
                      {effectivePrice.toLocaleString('vi-VN')}đ
                    </p>
                    {item.discountPercent && (
                      <p className='text-11! text-dark-600/30 line-through'>
                        {item.price.toLocaleString('vi-VN')}đ
                      </p>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Item detail modal — opened when a result is clicked */}
      {selectedItem && (
        <ItemDetailModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedItem(undefined)
          }}
          data={selectedItem}
          status={EItemModalDetailStatus.CREATE}
        />
      )}
    </>
  )
}
