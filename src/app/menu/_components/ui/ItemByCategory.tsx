'use client'

import { emptyBoxIcon } from '@/assets/icons'
import { Button, SkeletonLoader } from '@/components/ui'
import { EItemModalDetailStatus, ItemDetailModal } from '@/components/ui/modal'
import { DEFAULT_PAGINATION } from '@/constants'
import { client } from '@/lib/apollo-client'
import {
  EBehaviorEvent,
  EItemStatus,
  ListItemCursorDocument,
  RecommendationsDocument,
  TCategory,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import { useTrackBehavior } from '@/hooks'
import useCartStore from '@/store/cart-store'
import { apolloWrapper, cn } from '@/utils'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react'
import { INIT_CATEGORY } from '../Menu'

// Cursor-based cache shape: replaces offset+total with cursor+hasMore.
// On each page load, the server returns nextCursor (null when no more pages)
// and hasMore flag — the client appends records and updates these two fields.
export type TItemByCategoryData = {
  list: TItemResponse[]
  cursor: string | null
  hasMore: boolean
  fetched?: boolean
}

export type TItemByCategoryCache = Record<string, TItemByCategoryData>

type TItemByCategoryProps = {
  selectedCategory: TCategory
  inViewport?: boolean
  itemData: TItemByCategoryData
  handleUpdateData: (
    categoryId: string,
    updater: Partial<TItemByCategoryCache[string]>,
  ) => void
}

// Extracted from MenuDetail and wrapped in memo to prevent re-renders
// when sibling categories update their cache data — each category section
// only re-renders when its own itemData or the active category changes.
const ItemByCategory: FC<TItemByCategoryProps> = memo(
  ({ selectedCategory, inViewport, itemData, handleUpdateData }) => {
    const bottomRef = useRef<HTMLDivElement | null>(null)
    const { track } = useTrackBehavior()

    const [loading, setLoading] = useState<boolean>(false)
    const [modalStatus, setModalStatus] = useState<EItemModalDetailStatus>(
      EItemModalDetailStatus.CREATE,
    )
    const [selectedItem, setSelectedItem] = useState<TItemResponse>()
    const { listCartItem } = useCartStore()

    // Counter incremented by IntersectionObserver to trigger next page fetch.
    // Using a counter (not a boolean) lets re-triggers work even if the value
    // doesn't logically change (e.g. fast consecutive scrolls).
    const [loadMoreTrigger, setLoadMoreTrigger] = useState(0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getListItem = useCallback(
      apolloWrapper(
        async () => {
          setLoading(true)
          const { list } = itemData

          // "For you" category uses the recommendation engine (personalized for auth users,
          // hot-search/best-seller fallback for anonymous users). No cursor pagination.
          if (selectedCategory.name === INIT_CATEGORY.name) {
            const { data, error } = await client.query({
              query: RecommendationsDocument,
              variables: { limit: 8 },
              fetchPolicy: 'no-cache', // Always fetch fresh — cache is managed server-side
            })

            if (error) throw error

            if (data) {
              handleUpdateData(selectedCategory.categoryId, {
                list: data.recommendations.records,
                cursor: null,
                hasMore: false,
                fetched: true,
              })
            }
            return
          }

          // All other categories use cursor-based pagination
          const { data, error } = await client.query({
            query: ListItemCursorDocument,
            variables: {
              categoryName: selectedCategory.name,
              limit: DEFAULT_PAGINATION.limit,
              // Pass null cursor on first load; subsequent loads use nextCursor
              cursor: itemData.cursor,
            },
            fetchPolicy: 'no-cache',
          })

          if (error) throw error

          if (data) {
            const { records, pageInfo } = data.listItemCursor
            handleUpdateData(selectedCategory.categoryId, {
              // First page: replace list. Subsequent pages: append records.
              list: itemData.cursor === null ? records : [...list, ...records],
              cursor: pageInfo.nextCursor ?? null,
              hasMore: pageInfo.hasMore,
              fetched: true,
            })
          }
        },
        {
          errorMessage: `Failed to get list item by category ${selectedCategory.name}`,
          onFinally: () => setLoading(false),
        },
      ),
      [selectedCategory, itemData, handleUpdateData],
    )

    // Initial fetch: runs when the section first enters the viewport
    useEffect(() => {
      if (!inViewport) return
      if (itemData.fetched) return

      getListItem()
    }, [inViewport]) // eslint-disable-line react-hooks/exhaustive-deps

    // Load-more: runs when IntersectionObserver increments the trigger counter
    useEffect(() => {
      if (loadMoreTrigger === 0) return
      if (!itemData.hasMore) return

      getListItem()
    }, [loadMoreTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

    // Infinite scroll sentinel — observe the bottom div and increment the
    // trigger counter when it enters viewport (only if more pages exist).
    useEffect(() => {
      if (!inViewport) return
      const element = bottomRef.current
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return
          if (!itemData.hasMore) return
          if (loading) return

          setLoadMoreTrigger((prev) => prev + 1)
        },
        { threshold: 1 },
      )
      observer.observe(element)
      return () => observer.disconnect()
    }, [inViewport, itemData.hasMore, loading])

    const openCreate = (item: TItemResponse) => {
      setSelectedItem(item)
      setModalStatus(EItemModalDetailStatus.CREATE)
      // Track VIEW event for the recommendation engine (deduped client+server-side)
      track(item.itemId, EBehaviorEvent.View)
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
        <div className='flex w-full max-w-[560px] flex-col items-start gap-4 lg:max-w-none lg:flex-row lg:flex-wrap'>
          {/* Initial load skeleton — shows full-height placeholders */}
          {loading && !itemData.fetched ? (
            Array.from({ length: 4 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                loading={loading}
                className='flex h-40 w-full items-start gap-4 lg:w-[calc(50%-16px)]'
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
                        'hover:shadow-container rounded-4 md:rounded-6 flex w-full cursor-pointer items-start duration-300 lg:w-[calc(50%-16px)]',
                        index % 2 === 0 && 'lg:mr-2',
                      )}
                      onClick={() => openCreate(item)}
                    >
                      <Image
                        alt={item.name}
                        src={item.image}
                        width={200}
                        height={200}
                        className={cn(
                          'rounded-4 md:rounded-6 aspect-square size-50 object-cover object-center',
                          item.status?.includes(EItemStatus.New) &&
                            'bg-beige-400',
                        )}
                      />
                      <div className='flex h-50 w-full flex-col items-end justify-between p-4'>
                        <div className='flex flex-col items-start gap-1 text-left'>
                          <h5 className='text-18 mb-2 font-semibold'>
                            {item.name}
                          </h5>
                          <p className='text-14 text-dark-600/70 line-clamp-2'>
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

              {/* Pagination loading indicator — shows only when fetching more pages */}
              {loading && itemData.fetched && (
                <div className='flex w-full justify-center py-2'>
                  <SkeletonLoader
                    loading
                    className='h-10 w-full lg:w-[calc(50%-16px)]'
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
  },
)

ItemByCategory.displayName = 'ItemByCategory'

export default ItemByCategory
