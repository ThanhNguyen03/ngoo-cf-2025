import { SelectDropdown } from '@/components/ui/SelectDropdown'
import { TCategory } from '@/lib/graphql/generated/graphql'
import { cn } from '@/utils'
import {
  CheckIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

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

  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef<boolean>(false)

  const handleSelectCategory = (value: TCategory) => {
    selectCategory(value)
    setOpenDropdown(false)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionRef, listCategory])

  // handle click outside to close
  useEffect(() => {
    if (!containerRef.current) {
      return
    }
    const listener = () => {
      if (openDropdown) {
        setOpenDropdown(false)
      }
    }

    document.addEventListener('click', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('click', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [openDropdown])

  return (
    <div
      className={cn(
        'sticky top-12 flex w-full flex-col items-start gap-2 bg-white px-2 py-4 md:top-20 md:w-[25%] md:gap-4 md:p-0',
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

        {/* search bar */}
        <label
          onClick={() => {
            if (!openSearchBar) {
              setOpenSearchBar(true)
            }
          }}
          className={cn(
            'text-14! border-dark-600/10 relative ml-auto flex w-full max-w-fit cursor-pointer items-center justify-end gap-1 rounded-full border bg-white p-2 leading-[160%] duration-700',
            'hover:border-primary-500 focus-within:border-primary-500',
            (openSearchBar || searchTerm) &&
              'border-primary-500 max-w-full px-3 duration-700',
            disabled &&
              'border-dark-600/10 bg-dark-600/10 text-dark-600/70 placeholder:text-dark-600/50 cursor-not-allowed opacity-100 focus:border-neutral-900/20 focus:ring-0',
          )}
          htmlFor='menu-search'
        >
          <input
            value={searchTerm}
            onBlur={() => setOpenSearchBar(false)}
            onChange={(e) => setSearchTerm(e.target.value)}
            type='text'
            id='menu-search'
            className={cn(
              'absolute right-0 w-full max-w-0 caret-transparent duration-700 placeholder:text-transparent focus-within:outline-none focus:ring-0 focus:ring-offset-0',
              (openSearchBar || searchTerm) &&
                'caret-secondary-500 placeholder:text-primary-500/50 relative max-w-full',
            )}
            placeholder='Search for...'
          />
          {openSearchBar || searchTerm ? (
            <XIcon size={20} className='text-secondary-500' />
          ) : (
            <MagnifyingGlassIcon
              size={20}
              className='text-primary-500 focus-within:text-primary-500'
            />
          )}
        </label>
      </div>
    </div>
  )
}
