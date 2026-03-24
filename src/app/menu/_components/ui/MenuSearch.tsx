'use client'

import { SelectDropdown } from '@/components/ui/SelectDropdown'
import { useClickOutside } from '@/hooks/use-click-outside'
import { useDebounce } from '@/hooks/use-debounce'
import {
  HotSearchTermsDocument,
  SearchItemsDocument,
  TCategory,
} from '@/lib/graphql/generated/graphql'
import { createLogger } from '@/lib/logger'
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
} from '@/utils/recent-searches'
import { useLazyQuery } from '@apollo/client/react'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils'
import { SearchResultsDropdown } from './SearchResultsDropdown'

const logger = createLogger('MenuSearch')

type TMenuSearchProps = {
  disabled?: boolean
  sectionRef: React.RefObject<Map<string, HTMLDivElement | null>>
  listCategory: TCategory[]
  selectedCategory: TCategory
  selectCategory: (category: TCategory) => void
  className?: string
}

export const MenuSearch: FC<TMenuSearchProps> = ({
  disabled,
  sectionRef,
  listCategory,
  selectedCategory,
  selectCategory,
  className,
}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  const isScrollingRef = useRef<boolean>(false)
  const debouncedSearch = useDebounce(searchTerm, 300)

  const [searchItems, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SearchItemsDocument, { fetchPolicy: 'no-cache' })
  const [fetchHotTerms, { data: hotTermsData }] = useLazyQuery(
    HotSearchTermsDocument,
  )

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearch.trim().length >= 1) {
      searchItems({ variables: { search: debouncedSearch.trim(), limit: 10 } })
      addRecentSearch(debouncedSearch.trim())
      setRecentSearches(getRecentSearches())
      logger.debug({ term: debouncedSearch }, 'Search triggered')
    }
  }, [debouncedSearch, searchItems])

  const handleSearchFocus = useCallback(() => {
    if (!openSearchBar) {
      setOpenSearchBar(true)
    }
    setRecentSearches(getRecentSearches())
    setShowDropdown(true)
    // Prefetch hot search terms on focus
    fetchHotTerms({ variables: { limit: 10 } })
  }, [openSearchBar, fetchHotTerms])

  const handleSelectTerm = useCallback(
    (term: string) => {
      setSearchTerm(term)
      setShowDropdown(true)
    },
    [],
  )

  const handleClearRecent = useCallback(() => {
    clearRecentSearches()
    setRecentSearches([])
  }, [])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    setOpenSearchBar(false)
    setShowDropdown(false)
  }, [])

  // Memoise to avoid recreating this function on every parent render —
  // it is passed as a click handler to each category link inside the dropdown.
  const handleSelectCategory = useCallback(
    (value: TCategory) => {
      selectCategory(value)
      setOpenDropdown(false)
    },
    [selectCategory],
  )

  useEffect(() => {
    // Guard: the section map may be empty if categories haven't rendered yet
    if (sectionRef.current.size === 0) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Ignore intersection events while the user is programmatically scrolling
        if (isScrollingRef.current) {
          return
        }
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.id
            const matched = listCategory.find(
              (category) => category.categoryId === categoryId,
            )
            if (matched) {
              selectCategory(matched)
            }
          }
        })
      },
      {
        threshold: 0,
        rootMargin: '-40% 0px -40% 0px',
      },
    )

    sectionRef.current.forEach((el) => {
      if (el) {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
    // selectCategory is a stable setState setter — safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef, listCategory])

  // Close category dropdown on outside click
  const { ref: containerRef } = useClickOutside<HTMLDivElement>(() => {
    if (openDropdown) {
      setOpenDropdown(false)
    }
  })

  // Close search dropdown on outside click
  const { ref: searchContainerRef } = useClickOutside<HTMLDivElement>(() => {
    setShowDropdown(false)
    setOpenSearchBar(false)
  })

  return (
    <div
      className={cn(
        'sticky top-12 flex w-full flex-col items-start gap-2 bg-white px-2 py-4 md:top-20 md:w-[25%] md:gap-4 md:p-0',
        showDropdown && 'z-[55]',
        className,
      )}
    >
      <div className='flex w-full items-start gap-2'>
        {/* select dropdown */}
        <SelectDropdown
          ref={containerRef}
          openDropdown={openDropdown}
          onChange={() => setOpenDropdown(!openDropdown)}
          defaultValue={selectedCategory.name}
        >
          {listCategory.map((category) => (
            <Link
              href={`#${category.categoryId}`}
              onClick={(e) => {
                e.preventDefault()
                isScrollingRef.current = true
                const element = sectionRef.current.get(category.categoryId)
                if (!element) {
                  return
                }

                const yOffset = -120 // header height
                const y =
                  element.getBoundingClientRect().top + window.scrollY + yOffset

                window.scrollTo({ top: y, behavior: 'smooth' })
                handleSelectCategory(category)

                const scroll = setTimeout(() => {
                  isScrollingRef.current = false
                }, 400)

                return () => clearTimeout(scroll)
              }}
              className={cn(
                'text-14! text-dark-600/70 hover:bg-dark-600/10 flex w-full cursor-pointer items-center justify-between p-2 text-left leading-[160%] text-nowrap',
              )}
              key={category.name}
            >
              {category.name}
              <CheckIcon
                className={cn(
                  'text-dark-600',
                  category !== selectedCategory && 'hidden',
                )}
              />
            </Link>
          ))}
        </SelectDropdown>

        {/* search bar + dropdown container */}
        <div
          ref={searchContainerRef}
          className={cn(
            'relative ml-auto flex w-full flex-col',
            !(openSearchBar || searchTerm) && 'max-w-fit',
          )}
        >
          <label
            onClick={handleSearchFocus}
            className={cn(
              'text-14! border-dark-600/10 relative flex w-full max-w-fit cursor-pointer items-center justify-end gap-1 rounded-full border bg-white p-2 leading-[160%] duration-700',
              'hover:border-primary-500 focus-within:border-primary-500',
              (openSearchBar || searchTerm) &&
                'border-primary-500 max-w-full px-3 duration-700',
              showDropdown && (openSearchBar || searchTerm) &&
                'rounded-b-none border-b-0',
              disabled &&
                'border-dark-600/10 bg-dark-600/10 text-dark-600/70 placeholder:text-dark-600/50 cursor-not-allowed opacity-100 focus:border-neutral-900/20 focus:ring-0',
            )}
            htmlFor='menu-search'
          >
            <input
              value={searchTerm}
              onFocus={handleSearchFocus}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (e.target.value.trim() === '') {
                  setShowDropdown(true) // keep open to show hot/recent
                }
              }}
              type='text'
              id='menu-search'
              disabled={disabled}
              className={cn(
                'absolute right-0 w-full max-w-0 caret-transparent duration-700 placeholder:text-transparent focus-within:outline-none focus:ring-0 focus:ring-offset-0',
                (openSearchBar || searchTerm) &&
                  'caret-secondary-500 placeholder:text-primary-500/50 relative max-w-full',
              )}
              placeholder='Search for...'
            />
            {openSearchBar || searchTerm ? (
              <XIcon
                size={20}
                className='text-secondary-500 shrink-0'
                onMouseDown={(e) => {
                  e.preventDefault()
                  handleClearSearch()
                }}
              />
            ) : (
              <MagnifyingGlassIcon
                size={20}
                className='text-primary-500 focus-within:text-primary-500'
              />
            )}
          </label>

          {/* Search results dropdown */}
          <SearchResultsDropdown
            isOpen={showDropdown}
            isLoading={searchLoading}
            searchTerm={searchTerm}
            results={searchData?.searchItems}
            hotTerms={hotTermsData?.hotSearchTerms}
            recentSearches={recentSearches}
            onSelectTerm={handleSelectTerm}
            onClearRecent={handleClearRecent}
          />
        </div>
      </div>
    </div>
  )
}
