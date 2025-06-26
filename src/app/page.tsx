'use client'

import BestSeller from '@/components/section/best-seller'
import Hero from '@/components/section/hero'
import { InfiniteCarousel } from '@/components/ui/InfiniteCarousel'
import { notifyBg } from '@/images'
import { SealPercentIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { useState } from 'react'

export default function Home() {
  const [animationEnded, setAnimationEnded] = useState<boolean>(false)

  return (
    <>
      <Hero
        animationEnded={animationEnded}
        setAnimationEnded={setAnimationEnded}
      />
      {animationEnded && (
        <>
          <InfiniteCarousel
            className='w-full bg-linear-to-t from-beige-600 to-primary-500/70'
            length={7}
            animation='rightToLeft'
            background={
              <Image
                alt='notify-bg'
                src={notifyBg}
                width={2560}
                height={1440}
                className='absolute inset-0 z-0 object-cover object-[85%_50%] size-full'
              />
            }
          >
            <div className='flex items-center justify-center gap-2 mx-4 w-[320px] text-beige-300 py-6'>
              <SealPercentIcon size={24} weight='fill' />
              <p className='text-14 select-none'>
                Use{' '}
                <span className='text-yellow-300 font-bold'>
                  Payment by Token{' '}
                </span>
                to get{' '}
                <span className='text-green-500 font-bold'>sale off 20%</span>
              </p>
            </div>
          </InfiniteCarousel>
          <div className='px-2 pt-6 pb-10 md:px-6 md:pb-20 md:pt-10 lg:pt-20 lg:px-10 lg:pb-30 bg-white'>
            <div className='max-w-[1024px] w-full mx-auto'>
              <BestSeller />
            </div>
          </div>
          <div className='text-gray-500 max-w-2xl mx-auto mt-4 flex flex-col gap-4'>
            <p>
              NgOo EST. 2023, Còn bạn? <br />
              Started when we was 20! <br />
            </p>
            <p>
              Nhắc nhỏ cho mọi người nhớ rằng, vào tháng 7 này khi đặt bất kì
              món nước nào của NgOo với số lượng 2 ly trở lên thì sẽ được tặng
              miễn phí 2 Panna Cotta.
            </p>
            <p>
              Và chắc chắn sắp tới NgOo sẽ ra mắt rất nhiều món mới để phục vụ
              mọi người. Vì thế mọi người nhớ like cũng như là theo dõi NgOo để
              cập nhật thông tin mới sớm nhất nha!
            </p>
            <p>
              Biết đâu, crush của bạn thích món nước đó thì sao. Vậy thì còn
              chần chờ gì nữa mà không nhanh tay mà đặt nước cho bản thân cùng
              người aays!
            </p>
          </div>
        </>
      )}
    </>
  )
}
