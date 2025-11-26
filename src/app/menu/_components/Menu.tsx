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

export const Menu = () => {
  const sectionRef = useRef(new Map<string, HTMLDivElement | null>())
  const [listCategory, setListCategory] = useState<TCategory[]>()

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
          setListCategory(data.listCategory)
          console.log('asdasdasd', data)
        }
      },
      {
        errorMessage: 'Failed to fetch list category',
      },
    )

    getListCategory()
  }, [])

  return (
    <section className='from-paper/10 to-paper/2 relative bg-linear-to-b px-2 py-10 md:px-6 md:py-20 lg:px-10 lg:py-30'>
      <div className='mx-auto flex size-full max-w-[1200px] flex-col items-start gap-4 md:gap-6'>
        <h2 className='text-32! text-secondary-500 font-lobster font-medium duration-700'>
          Menu Search
        </h2>
        <div className='relative flex size-full items-start gap-3 md:gap-6'>
          <SkeletonLoader
            loading={!listCategory || listCategory.length === 0}
            className='min-h-40 w-[25%]'
          >
            {listCategory && listCategory.length > 0 && (
              <MenuSearch sectionRef={sectionRef} listCategory={listCategory} />
            )}
          </SkeletonLoader>
          <div className='from-primary-500 to-dark-600/10 sticky top-20 h-80 w-0.25 bg-gradient-to-b' />
          <SkeletonLoader
            loading={!listCategory || listCategory.length === 0}
            className='min-h-40 w-[75%]'
          >
            <MenuDetail sectionRef={sectionRef} />
          </SkeletonLoader>
        </div>
      </div>
    </section>
  )
}
