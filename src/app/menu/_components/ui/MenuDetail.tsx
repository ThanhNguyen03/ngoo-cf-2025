import { MOCKED_ITEMS_DATA } from '@/components/section'
import { Button } from '@/components/ui'
import { TItem } from '@/types'
import { cn } from '@/utils'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import React, { FC } from 'react'

const MOCKUP_DATA: TItemByCategoryProps[] = [
  {
    categoryName: 'For you',
    listTtem: MOCKED_ITEMS_DATA,
  },
  {
    categoryName: 'Best Sellers',
    listTtem: MOCKED_ITEMS_DATA,
  },
  {
    categoryName: 'Coffee',
    listTtem: MOCKED_ITEMS_DATA,
  },
  {
    categoryName: 'Milk Tea',
    listTtem: MOCKED_ITEMS_DATA,
  },
]

type TItemByCategoryProps = {
  categoryName: string
  listTtem: TItem[]
}
const ItemByCategory: FC<TItemByCategoryProps> = ({
  categoryName,
  listTtem,
}) => {
  return (
    <div className='text-dark-600 flex w-full flex-col gap-4 lining-nums md:gap-4'>
      <h4 className='text-28 font-small-caps text-secondary-500 font-bold'>
        {categoryName}
      </h4>
      <div className='flex w-full max-w-[560px] flex-col items-start gap-4'>
        {listTtem.map((item, index) => (
          <React.Fragment key={item.title}>
            <div
              className={cn(
                'from-primary-500/30 to-primary-500/10 h-px w-full bg-linear-to-r',
                index === 0 && 'hidden',
              )}
            />
            <div className='flex items-start gap-4 md:gap-6'>
              <Image
                alt={item.title}
                src={item.image}
                width={200}
                height={200}
                className='rounded-6 aspect-square size-50 object-cover object-center'
              />
              <div className='flex h-50 w-full flex-col items-end justify-between'>
                <div className='flex flex-col items-start gap-1 text-left'>
                  <h5 className='text-18 mb-2 font-semibold'>{item.title}</h5>
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
}
export const MenuDetail: FC<TMenuDetailProps> = ({ sectionRef }) => {
  return (
    <div className='flex w-[70%] flex-col gap-6 md:gap-10'>
      {MOCKUP_DATA.map((data) => {
        const id = data.categoryName.toLowerCase().replace(/\s+/g, '-')

        return (
          <div
            key={id}
            id={id}
            ref={(el) => {
              sectionRef.current.set(id, el)
            }}
          >
            <ItemByCategory {...data} />
          </div>
        )
      })}
    </div>
  )
}
