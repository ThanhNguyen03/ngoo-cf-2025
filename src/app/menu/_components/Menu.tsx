'use client'

import { SkeletonLoader } from '@/components/ui'
import { client } from '@/lib/apollo-client'
import {
  ListCategoryDocument,
  TCategory,
} from '@/lib/graphql/generated/graphql'
import { apolloWrapper } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import { MenuDetail } from './ui/MenuDetail'
import { MenuSearch } from './ui/MenuSearch'

export const INIT_CATEGORY: TCategory = {
  categoryId: 'randomUUID()',
  name: 'For you',
}

export const Menu = () => {
  const sectionRef = useRef(new Map<string, HTMLDivElement | null>())
  const [listCategory, setListCategory] = useState<TCategory[]>()
  const [selectedCategory, setSelectedCategory] =
    useState<TCategory>(INIT_CATEGORY)

  useEffect(() => {
    const getListCategory = apolloWrapper(
      async () => {
        const { data, error } = await client.query({
          query: ListCategoryDocument,
        })
        if (error) {
          throw error
        }

        if (data) {
          setListCategory([INIT_CATEGORY, ...data.listCategory])
        }
      },
      {
        errorMessage: 'Failed to fetch list category',
      },
    )

    getListCategory()
  }, [])

  return (
    <section className='from-paper/10 to-paper/2 relative bg-linear-to-b py-10 md:py-20 lg:py-30'>
      <div className='px-2 md:px-6 lg:px-10'>
        <div className='mx-auto flex size-full max-w-[1200px] flex-col items-start gap-4 md:gap-6'>
          <h2 className='text-32! text-secondary-500 font-lobster font-medium duration-700'>
            Menu Search
          </h2>
          <div className='flex size-full flex-col items-start gap-3 md:flex-row md:gap-6'>
            <SkeletonLoader
              loading={!listCategory || listCategory.length === 0}
              className='hidden h-full max-h-none min-h-40 w-full md:flex! md:w-[25%]'
            />
            {listCategory && listCategory.length > 0 && (
              <MenuSearch
                className='hidden md:flex'
                sectionRef={sectionRef}
                listCategory={listCategory}
                selectedCategory={selectedCategory}
                selectCategory={setSelectedCategory}
              />
            )}
            <div className='from-primary-500 to-dark-600/10 sticky top-20 hidden h-80 w-0.25 bg-gradient-to-b md:inline' />
            <SkeletonLoader
              loading={!listCategory || listCategory.length === 0}
              className='min-h-40 w-full md:w-[75%]'
            >
              {listCategory && listCategory.length > 0 && (
                <MenuDetail
                  listCategory={listCategory}
                  selectedCategory={selectedCategory}
                  sectionRef={sectionRef}
                />
              )}
            </SkeletonLoader>
          </div>
        </div>
      </div>
      <SkeletonLoader
        loading={!listCategory || listCategory.length === 0}
        className='h-full max-h-none min-h-40 w-full md:hidden md:w-[25%]'
      />
      {listCategory && listCategory.length > 0 && (
        <MenuSearch
          className='md:hidden'
          sectionRef={sectionRef}
          listCategory={listCategory}
          selectedCategory={selectedCategory}
          selectCategory={setSelectedCategory}
        />
      )}
    </section>
  )
}
