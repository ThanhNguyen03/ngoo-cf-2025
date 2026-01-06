import { notFoundCow } from '@/assets/images'
import Image from 'next/image'

const NotFound = () => {
  return (
    <section className='center relative h-[calc(100dvh-60px)] flex-col overflow-hidden'>
      <Image
        src={notFoundCow}
        alt='not found cow'
        width={609}
        height={409}
        className='aspect-[609/409] h-80 w-auto object-cover'
      />
      <h2 className='font-shantell text-28 text-shadow-stroke-2 font-bold text-white'>
        Oops! Something not right!
      </h2>
    </section>
  )
}

export default NotFound
