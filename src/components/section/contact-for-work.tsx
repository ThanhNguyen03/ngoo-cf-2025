import { cn } from '@/utils'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { FC } from 'react'

type TContactForWorkProps = {
  isHover?: boolean
}

const ContactForWork: FC<TContactForWorkProps> = ({ isHover }) => {
  return (
    <section
      className={cn(
        'relative overflow-hidden px-2 pt-10 pb-6 md:px-6 md:pt-20 md:pb-10 lg:px-10 lg:pt-40 lg:pb-20',
        isHover
          ? 'from-dark-600 bg-linear-to-b to-white to-20%'
          : 'bg-linear-to-b from-[#dfd7be] to-white to-20%',
      )}
    >
      <div className='mx-auto flex w-full max-w-[1024px] flex-col gap-4 md:gap-6 lg:gap-10'>
        <h2 className='md:text-35 text-28 w-fit font-black text-[#3d3c3a]'>
          Contact For Work
        </h2>
        <div className='flex items-start justify-between gap-4 md:gap-6'>
          <div className='text-16 max-w-[640px] text-neutral-900/70'>
            This website is created and maintained solely as a personal project.
            It is not intended for commercial use or profit-making purposes.
            <br />
            <br />
            For any inquiries or work-related contact, please email:{' '}
            <Link
              className='font-light italic underline'
              href='mailto:thanhfng.dev@gmail.com'
              target='_blank'
            >
              thanhfng.dev@gmail.com
            </Link>
            .
          </div>
          <Link
            target='_blank'
            href='https://thanhng-portfolio-2024.vercel.app/'
            className='bg-secondary-500 rounded-4 flex items-center gap-2 px-4 py-3 text-nowrap text-white'
          >
            Explore more
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ContactForWork
