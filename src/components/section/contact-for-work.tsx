import { SwitchButton } from '@/components/ui'
import { useSpotlightCursor } from '@/hooks'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { LinePattern } from '../icons/LinePattern'

export const ContactForWork = () => {
  const { position, onMouseMove } = useSpotlightCursor()
  return (
    <section
      className='relative overflow-hidden bg-gradient-to-br from-[hsla(30,59%,57%,1)] to-[hsla(28,66%,40%,1)]'
      onMouseMove={onMouseMove}
    >
      {/* pattern */}
      <div className='absolute h-[480px] w-screen overflow-hidden bg-[radial-gradient(circle_at_13.96%_0%,hsla(345,7%,10%,1)_0%,hsla(345,10%,85%,1)_100%)]'>
        <LinePattern
          id='line-pattern'
          position={position}
          cursorRadius={125}
          opacity={0.15}
          highlightColor='#f25202'
          secondHighlightColor='hsla(30, 65%, 63%, 1)'
          spotlightColor='#f25202'
          spotlightOpacity={0.3}
          className='absolute inset-0 w-full min-w-[1440px] mix-blend-color-dodge select-none'
        />
      </div>
      <div className='relative z-10 px-2 py-6 md:px-6 md:py-10 lg:px-10 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[1200px] flex-col gap-4 md:gap-6 lg:gap-10'>
          <div className='flex flex-col items-start justify-between gap-4 md:flex-row md:gap-6'>
            <div className='text-16 text-beige-50 max-w-[640px]'>
              This website is created and maintained solely as a personal
              project. It is not intended for commercial use or profit-making
              purposes.
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
            <SwitchButton
              target='_blank'
              className='rounded-3! flex w-fit gap-2 border-0'
              href='https://thanhng-portfolio-2024.vercel.app/'
              variant='gray'
            >
              Explore more
              <ArrowRightIcon />
            </SwitchButton>
          </div>
        </div>
      </div>
    </section>
  )
}
