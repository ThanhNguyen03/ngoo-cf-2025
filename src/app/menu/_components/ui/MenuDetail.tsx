'use client'

import { TCategory } from '@/lib/graphql/generated/graphql'
import { FC, useCallback, useEffect, useState } from 'react'
import ItemByCategory, {
  TItemByCategoryCache,
  TItemByCategoryData,
} from './ItemByCategory'

type TMenuDetailProps = {
  sectionRef: React.RefObject<Map<string, HTMLDivElement | null>>
  selectedCategory: TCategory
  listCategory: TCategory[]
}

export const MenuDetail: FC<TMenuDetailProps> = ({
  sectionRef,
  selectedCategory,
  listCategory,
}) => {
  // Keyed cache of fetched items per category — avoids re-fetching when the
  // user scrolls back to a previously visited category section.
  const [cache, setCache] = useState<TItemByCategoryCache>({})

  // Memoised so the stable reference is passed to ItemByCategory children,
  // preventing them from re-rendering every time the parent re-renders.
  const handleUpdateCache = useCallback(
    (categoryId: string, updater: Partial<TItemByCategoryData>) => {
      setCache((prev) => ({
        ...prev,
        [categoryId]: {
          fetched: false,
          ...prev[categoryId],
          ...updater,
        },
      }))
    },
    [],
  )

  // Initialise cache entry for the newly selected category so ItemByCategory
  // can start fetching immediately when it becomes visible.
  useEffect(() => {
    const categoryId = selectedCategory.categoryId
    // Only initialise if no cache entry exists yet
    if (!cache[categoryId]) {
      handleUpdateCache(categoryId, {
        list: [],
        cursor: null,
        hasMore: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, handleUpdateCache])

  return (
    <div className='flex w-full flex-col gap-4 md:gap-6'>
      {listCategory.map((category) => {
        const isActive = selectedCategory.categoryId === category.categoryId

        const cacheData = cache[category.categoryId] ?? {
          list: [],
          cursor: null,
          hasMore: true,
          fetched: false,
        }

        return (
          <div
            key={category.categoryId}
            id={category.categoryId}
            ref={(el) => {
              sectionRef.current.set(category.categoryId, el)
            }}
            className='w-full'
          >
            <ItemByCategory
              selectedCategory={category}
              inViewport={isActive}
              itemData={cacheData}
              handleUpdateData={handleUpdateCache}
            />
          </div>
        )
      })}
    </div>
  )
}
