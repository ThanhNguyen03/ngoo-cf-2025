import { emptyBoxIcon } from '@/assets/icons'
import { Button, SkeletonLoader } from '@/components/ui'
import { EItemModalDetailStatus, ItemDetailModal } from '@/components/ui/modal'
import { DEFAULT_PAGINATION } from '@/constants'
import { client } from '@/lib/apollo-client'
import {
  EItemStatus,
  ListItemByCategoryDocument,
  ListItemByStatusDocument,
  TCategory,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import useCartStore from '@/store/cart-store'
import { apolloWrapper, cn } from '@/utils'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import React, { FC, useEffect, useRef, useState } from 'react'
import { INIT_CATEGORY } from '../Menu'

type TItemByCategoryData = {
  list: TItemResponse[]
  total: number
  offset: number
  fetched?: boolean
}
type TItemByCategoryProps = {
  selectedCategory: TCategory
  inViewport?: boolean
  itemData: TItemByCategoryData
  handleUpdateData: (
    categoryId: string,
    updater: Partial<TItemByCategoryCache[string]>,
  ) => void
}
const ItemByCategory: FC<TItemByCategoryProps> = ({
  selectedCategory,
  inViewport,
  itemData,
  handleUpdateData,
}) => {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [modalStatus, setModalStatus] = useState<EItemModalDetailStatus>(
    EItemModalDetailStatus.CREATE,
  )
  const [selectedItem, setSelectedItem] = useState<TItemResponse>()
  const { listCartItem } = useCartStore()

  const getListItem = apolloWrapper(
    async () => {
      setLoading(true)
      const { list, offset } = itemData
      if (selectedCategory.name === INIT_CATEGORY.name) {
        const { data, error } = await client.query({
          query: ListItemByStatusDocument,
          variables: {
            status: [EItemStatus.Seller],
          },
        })

        if (error) {
          throw error
        }

        if (data) {
          handleUpdateData(selectedCategory.categoryId, {
            list:
              offset === 0
                ? data.listItemByStatus.records
                : [...list, ...data.listItemByStatus.records],
            total: data.listItemByStatus.total,
            fetched: true,
          })
        }
        return
      }

      const { data, error } = await client.query({
        query: ListItemByCategoryDocument,
        variables: {
          categoryName: selectedCategory.name,
          limit: DEFAULT_PAGINATION.limit,
          offset,
        },
        fetchPolicy: 'no-cache',
      })

      if (error) {
        throw error
      }

      if (data) {
        handleUpdateData(selectedCategory.categoryId, {
          list:
            offset === 0
              ? data.listItemByCategory.records
              : [...list, ...data.listItemByCategory.records],
          total: data.listItemByCategory.total,
          fetched: true,
        })
      }
    },
    {
      errorMessage: `Failed to get list item by category ${selectedCategory.name}`,
      onFinally: () => setLoading(false),
    },
  )

  useEffect(() => {
    if (!inViewport) {
      return
    }
    if (itemData.fetched) {
      return
    }
    if (itemData.list.length > 0 && itemData.offset === 0) {
      return
    }

    if (itemData.list.length === 0) {
      getListItem()
    }
    if (itemData.offset > 0) {
      getListItem()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewport, itemData.offset])

  // Infinite scroll
  useEffect(() => {
    if (!inViewport) {
      return
    }
    const element = bottomRef.current
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return
        }
        const { offset, total } = itemData
        const limit = DEFAULT_PAGINATION.limit
        const canLoadMore = total > limit + offset
        if (!canLoadMore) {
          return
        }
        // increase offset
        handleUpdateData(selectedCategory.categoryId, {
          offset: offset + limit,
        })
      },
      { threshold: 1 },
    )
    observer.observe(element)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inViewport, itemData])

  const openCreate = (item: TItemResponse) => {
    setSelectedItem(item)
    setModalStatus(EItemModalDetailStatus.CREATE)
  }

  const openUpdate = (item: TItemResponse) => {
    setSelectedItem(item)
    setModalStatus(EItemModalDetailStatus.UPDATE)
  }

  return (
    <div className='text-dark-600 flex w-full flex-col gap-4 lining-nums md:gap-4'>
      <h4 className='text-28 font-small-caps text-secondary-500 font-bold'>
        {selectedCategory.name}
      </h4>
      <div className='flex w-full max-w-[560px] flex-col items-start gap-4 xl:max-w-none xl:flex-row xl:flex-wrap'>
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <SkeletonLoader
              key={index}
              loading={loading}
              className='flex h-40 w-full items-start gap-4 xl:w-[calc(50%-16px)]'
            />
          ))
        ) : (
          <>
            {itemData.list.length > 0 ? (
              itemData.list.map((item, index) => {
                const cartItem = listCartItem.find(
                  (c) => c.itemId === item.itemId,
                )

                return (
                  <div
                    key={item.name}
                    className={cn(
                      'hover:shadow-container rounded-4 md:rounded-6 flex w-full cursor-pointer items-start duration-300 xl:w-[calc(50%-16px)]',
                      index % 2 === 0 && 'xl:mr-2',
                    )}
                    onClick={() => openCreate(item)}
                  >
                    <Image
                      alt={item.name}
                      src={item.image}
                      width={200}
                      height={200}
                      className='rounded-4 md:rounded-6 aspect-square size-50 object-cover object-center'
                    />
                    <div className='flex h-50 w-full flex-col items-end justify-between p-4'>
                      <div className='flex flex-col items-start gap-1 text-left'>
                        <h5 className='text-18 mb-2 font-semibold'>
                          {item.name}
                        </h5>
                        <p className='text-14 text-dark-600/70'>
                          {item.description}
                        </p>
                        <div className='flex items-end justify-center gap-2'>
                          {item.discountPercent && (
                            <p className='text-16! font-semibold'>
                              {item.price -
                                (item.price * item.discountPercent) / 100}
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
                      {cartItem ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openUpdate(item)
                          }}
                          className={cn(
                            'text-14! cursor-pointer rounded-full border border-green-500 bg-white px-2.5 py-1',
                            cartItem.amount > 9 && 'px-1.5 py-1',
                          )}
                        >
                          {cartItem.amount > 9 ? '9+' : cartItem.amount}
                        </button>
                      ) : (
                        <Button
                          className='text-16! gap-0 rounded-full bg-green-500 p-1.75'
                          icon={
                            <PlusIcon size={16} className='text-beige-50' />
                          }
                          disableAnimation
                          onClick={(e) => {
                            e.stopPropagation()
                            openCreate(item)
                          }}
                        />
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className='center h-40 w-full flex-col p-4 text-center'>
                <Image
                  alt='empty box'
                  src={emptyBoxIcon}
                  width={200}
                  height={200}
                  className='size-50'
                />
              </div>
            )}
            {selectedItem && (
              <ItemDetailModal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(undefined)}
                data={selectedItem}
                cartItem={listCartItem.find(
                  (c) => c.itemId === selectedItem.itemId,
                )}
                status={modalStatus}
              />
            )}
          </>
        )}
      </div>

      {/* Sentinel to trigger load more */}
      <div ref={bottomRef} className='h-4 w-full' />
    </div>
  )
}

type TItemByCategoryCache = Record<string, TItemByCategoryData>
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
  const [cache, setCache] = useState<TItemByCategoryCache>({}) // cache fetched category data

  const handleUpdateCache = (
    categoryId: string,
    updater: Partial<TItemByCategoryCache[string]>,
  ) => {
    setCache((prev) => ({
      ...prev,
      [categoryId]: {
        fetched: false,
        ...prev[categoryId],
        ...updater,
      },
    }))
  }

  useEffect(() => {
    const categoryId = selectedCategory.categoryId
    const exist = cache[categoryId] // If dont have cache data → fetch data
    if (!exist) {
      handleUpdateCache(categoryId, {
        list: [],
        total: 0,
        offset: 0,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  return (
    <div className='flex w-full flex-col gap-4 md:gap-6'>
      {listCategory.map((category) => {
        const isActive = selectedCategory.categoryId === category.categoryId

        const cacheData = cache[category.categoryId] ?? {
          list: [],
          total: 0,
          offset: 0,
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
              selectedCategory={
                category.categoryId === INIT_CATEGORY.categoryId
                  ? INIT_CATEGORY
                  : category
              }
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
