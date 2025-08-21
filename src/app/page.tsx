'use client'

import BestSeller from '@/components/section/best-seller'
import Hero from '@/components/section/hero'
import NewCollection from '@/components/section/new-collection'
import { InfiniteCarousel } from '@/components/ui/InfiniteCarousel'
import { notifyBg } from '@/images'
import { SealPercentIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'

export default function Home() {
  return (
    <main className='relative flex size-full flex-col overflow-hidden'>
      <Hero />
      <div className='from-beige-100 relative bg-linear-to-b via-white via-70% to-white transition-colors duration-500'>
        <div className='bg-dark-600 h-10' />
        <InfiniteCarousel
          className='from-beige-300 to-beige-50 border-secondary-500/10 absolute -top-10 z-10 w-full -rotate-3 border-y bg-linear-to-b'
          length={7}
          animation='rightToLeft'
          background={
            <Image
              alt='notify-bg'
              src={notifyBg}
              width={2560}
              height={1440}
              className='absolute inset-0 z-0 size-full object-cover object-[85%_50%]'
            />
          }
        >
          <div className='mx-4 flex w-[340px] items-center justify-center gap-2 py-6 text-neutral-900'>
            <SealPercentIcon size={24} weight='fill' />
            <p className='text-14 select-none'>
              Use{' '}
              <span className='font-bold text-blue-600/70'>
                Payment by Token{' '}
              </span>
              to get{' '}
              <span className='font-bold text-green-600/70'>sale off 20%</span>
            </p>
          </div>
        </InfiniteCarousel>
        <BestSeller />
      </div>
      <NewCollection />
      <div className='mx-auto mt-4 flex max-w-2xl flex-col gap-4 text-gray-500'>
        <p>
          NgOo EST. 2023, Còn bạn? <br />
          Started when we was 20! <br />
        </p>
        <p>
          Nhắc nhỏ cho mọi người nhớ rằng, vào tháng 7 này khi đặt bất kì món
          nước nào của NgOo với số lượng 2 ly trở lên thì sẽ được tặng miễn phí
          2 Panna Cotta.
        </p>
        <p>
          Và chắc chắn sắp tới NgOo sẽ ra mắt rất nhiều món mới để phục vụ mọi
          người. Vì thế mọi người nhớ like cũng như là theo dõi NgOo để cập nhật
          thông tin mới sớm nhất nha!
        </p>
        <p>
          Biết đâu, crush của bạn thích món nước đó thì sao. Vậy thì còn chần
          chờ gì nữa mà không nhanh tay mà đặt nước cho bản thân cùng người
          aays!
        </p>
      </div>
    </main>
  )
}
