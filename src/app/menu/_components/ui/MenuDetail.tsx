import { MOCKED_ITEMS_DATA } from '@/components/section'
import { Button } from '@/components/ui'
import { TItem } from '@/types'
import { cn } from '@/utils'
import { PlusIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC } from 'react'

type TItemByCategoryProps = {
  categoryName: string
  listTtem: TItem[]
}

const MOCKUP_DATA: TItemByCategoryProps = {
  categoryName: 'For you',
  listTtem: MOCKED_ITEMS_DATA,
}

const ItemByCategory: FC<TItemByCategoryProps> = ({
  categoryName,
  listTtem,
}) => {
  return (
    <div className='text-dark-600 flex w-full flex-col gap-4 lining-nums md:gap-6'>
      <h4 className='text-23 font-small-caps font-bold'>{categoryName}</h4>
      <div className='flex w-full flex-col items-start gap-2'>
        {listTtem.map((item) => (
          <div key={item.title} className='flex items-start gap-4 md:gap-6'>
            <Image
              alt={item.title}
              src={item.image}
              width={200}
              height={200}
              className='rounded-6 aspect-square size-50 object-center'
            />
            <div className='flex h-50 w-full flex-col items-end justify-between'>
              <div className='flex flex-col items-start gap-1 text-left'>
                <h5 className='text-18 mb-2 font-semibold'>{item.title}</h5>
                <p className='text-14 text-dark-600/70'>{item.description}</p>
                <div className='flex items-end justify-center gap-2'>
                  {item.discountPercent && (
                    <p className='text-16! font-semibold'>
                      {item.price - (item.price * item.discountPercent) / 100}$
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
                className='text-16! gap-0 rounded-full bg-green-500 p-1.25'
                icon={<PlusIcon size={12} className='text-beige-50' />}
                disableAnimation
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const MenuDetail = () => {
  return (
    <div className='flex w-3/5 flex-col gap-6 md:gap-10'>
      <ItemByCategory {...MOCKUP_DATA} />
    </div>
  )
}
