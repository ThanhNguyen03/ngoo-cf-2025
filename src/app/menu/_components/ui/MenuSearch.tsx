import { TCategory } from '@/lib/graphql/generated/graphql'
import { cn } from '@/utils'
import {
  CaretUpIcon,
  MagnifyingGlassIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

type TMenuSearchProps = {
  disabled?: boolean
  sectionRef: React.RefObject<Map<string, HTMLDivElement | null>>
  listCategory: TCategory[]
}
export const MenuSearch: FC<TMenuSearchProps> = ({
  disabled,
  sectionRef,
  listCategory,
}) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [openSearchBar, setOpenSearchBar] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    listCategory[0].name,
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef<boolean>(false)

  const handleSelectCategory = (value: string) => {
    setSelectedCategory(value)
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
              (c) => c.name.toLowerCase().replace(/\s+/g, '-') === categoryId,
            )
            if (matched) {
              setSelectedCategory(matched.name)
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
    <div className='sticky top-20 flex w-full flex-col items-start gap-2 md:gap-4'>
      <div className='flex w-full items-center gap-2'>
        {/* select dropdown */}
        <div
          className={cn(
            'relative flex w-full flex-col items-start duration-700',
            openSearchBar || searchTerm
              ? 'absolute max-w-0 opacity-0'
              : 'max-w-full opacity-100',
          )}
          ref={containerRef}
        >
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className={cn(
              'group border-dark-600/10 rounded-3 hover:border-primary-500 z-20 flex w-full cursor-pointer items-center gap-2 border p-2',
              openDropdown && 'border-primary-500 rounded-b-none border-b-0',
            )}
          >
            <p className='text-14! text-secondary-500 w-full text-left leading-[160%] font-semibold text-nowrap duration-700'>
              {selectedCategory}
            </p>
            <CaretUpIcon
              size={20}
              className={cn(
                'group-hover:text-primary-500 text-dark-600/50 w-fit',
                openDropdown && 'rotate-180 duration-300',
              )}
            />
          </button>

          {/* dropdown */}
          <div
            className={cn(
              'border-primary-500 rounded-3 absolute z-10 flex min-h-20 w-full flex-col items-start gap-2 rounded-t-none border border-t-0 bg-white pt-2 shadow-md',
              openDropdown
                ? 'top-10 translate-y-0 opacity-100'
                : 'pointer-events-none -translate-y-[100%] opacity-0',
            )}
          >
            {listCategory.map((category) => (
              <Link
                href={`#${category.name.toLowerCase().trim().replace(/\s+/g, '-')}`}
                onClick={(e) => {
                  e.preventDefault()
                  isScrollingRef.current = true
                  const element = sectionRef.current.get(
                    category.name.toLowerCase().trim().replace(/\s+/g, '-'),
                  )
                  if (!element) {
                    return
                  }

                  const yOffset = -80 // header height
                  const y =
                    element.getBoundingClientRect().top +
                    window.scrollY +
                    yOffset

                  window.scrollTo({ top: y, behavior: 'smooth' })
                  handleSelectCategory(category.name)

                  const scroll = setTimeout(() => {
                    isScrollingRef.current = false
                  }, 400)

                  return () => clearTimeout(scroll)
                }}
                className={cn(
                  'text-14! text-dark-600/70 hover:bg-dark-600/10 w-full cursor-pointer p-2 text-left leading-[160%] text-nowrap',
                  category.name === selectedCategory && 'hidden',
                )}
                key={category.name}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

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
