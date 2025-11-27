import { Button } from '@/components/ui'
import { DEFAULT_PAGINATION } from '@/constants'
import { client } from '@/lib/apollo-client'
import {
  ItemByCategoryDocument,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import { apolloWrapper, cn } from '@/utils'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import React, { FC, useEffect, useState } from 'react'
import { INIT_CATEGORY } from '../Menu'

type TItemByCategoryProps = {
  categoryName: string
  listItem: TItemResponse[]
}
const ItemByCategory: FC<TItemByCategoryProps> = ({
  categoryName,
  listItem,
}) => {
  return (
    <div className='text-dark-600 flex w-full flex-col gap-4 lining-nums md:gap-4'>
      <h4 className='text-28 font-small-caps text-secondary-500 font-bold'>
        {categoryName}
      </h4>
      <div className='flex w-full max-w-[560px] flex-col items-start gap-4 xl:max-w-none xl:flex-row xl:flex-wrap'>
        {listItem.map((item, index) => (
          <React.Fragment key={item.name}>
            <div
              className={cn(
                'flex w-full items-start gap-4 pt-4 xl:w-[calc(50%-16px)]',
                index > 1 && 'border-dark-600/7 border-t',
                index % 2 === 0 && 'xl:mr-2',
              )}
            >
              <Image
                alt={item.name}
                src={item.image}
                width={200}
                height={200}
                className='rounded-6 aspect-square size-50 object-cover object-center'
              />
              <div className='flex h-50 w-full flex-col items-end justify-between'>
                <div className='flex flex-col items-start gap-1 text-left'>
                  <h5 className='text-18 mb-2 font-semibold'>{item.name}</h5>
                  <p className='text-14 text-dark-600/70'>{item.description}</p>
                  <div className='flex items-end justify-center gap-2'>
                    {item.discountPercent && (
                      <p className='text-16! font-semibold'>
                        {item.price - (item.price * item.discountPercent) / 100}
                        $
                      </p>
                    )}
                    <p
                      className={cn(
                        'text-16 font-semibold',
                        item.discountPercent &&
                          'text-dark-600/50 text-[13px] font-normal line-through',
                      )}
                    >
                      {item.price}$
                    </p>
                  </div>
                </div>

                <Button
                  className='text-16! gap-0 rounded-full bg-green-500 p-1.75'
                  icon={<PlusIcon size={16} className='text-beige-50' />}
                  disableAnimation
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

type TMenuDetailProps = {
  sectionRef: React.RefObject<Map<string, HTMLDivElement | null>>
  selectedCategory: string
}

export const MenuDetail: FC<TMenuDetailProps> = ({
  sectionRef,
  selectedCategory,
}) => {
  const id = selectedCategory.toLowerCase().replace(/\s+/g, '-')
  const [listItem, setListItem] = useState<TItemResponse[]>()

  useEffect(() => {
    const getListItem = apolloWrapper(
      async () => {
        if (selectedCategory === INIT_CATEGORY.name) {
          return
        }

        const { data, error } = await client.query({
          query: ItemByCategoryDocument,
          variables: {
            categoryName: selectedCategory,
            limit: DEFAULT_PAGINATION.limit,
            offset: DEFAULT_PAGINATION.offset,
          },
        })
        if (error) {
          throw error
        }

        if (data) {
          setListItem(data.itemByCategory.records)
          console.log('asdasdads', data)
        }
      },
      {
        errorMessage: 'Failed to fetch list category',
      },
    )

    getListItem()
  }, [selectedCategory])

  return (
    <div className='flex w-full flex-col gap-6 md:gap-10'>
      <div
        key={id}
        id={id}
        ref={(el) => {
          sectionRef.current.set(id, el)
          // if (el) {
          //   observeCategory(el, id)
          // }
        }}
        className='w-full'
      >
        {listItem && listItem.length > 0 && (
          <ItemByCategory categoryName={selectedCategory} listItem={listItem} />
        )}
      </div>
    </div>
  )
}
