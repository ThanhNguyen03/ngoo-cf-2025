import { SwitchButton } from '@/components/ui'
import { useSpotlightCursor } from '@/hooks'
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { LinePattern } from '../icons/LinePattern'

export const ContactForWork = () => {
  const { position, onMouseMove } = useSpotlightCursor()
  return (
    <section
      className='relative overflow-hidden bg-linear-to-br from-neutral-900 via-blue-700 to-blue-900'
      onMouseMove={onMouseMove}
    >
      {/* pattern */}
      <div className='from-dark-600/30 absolute h-[480px] w-screen overflow-hidden bg-radial-[130.34%_100%_at_13.96%_0%] to-black/10'>
        <LinePattern
          id='hero-banner'
          position={position}
          cursorRadius={125}
          opacity={0.1}
          highlightColor='#df73ff'
          secondHighlightColor='hsl(32,99%,45%)'
          spotlightColor='hsl(335,75%,85%,0.3)'
          spotlightOpacity={0.5}
          className='absolute inset-0 w-full min-w-[1440px] mix-blend-color-dodge select-none'
        />
      </div>
      <div className='relative z-10 px-2 py-6 md:px-6 md:py-10 lg:px-10 lg:py-20'>
        <div className='mx-auto flex w-full max-w-[1024px] flex-col gap-4 md:gap-6 lg:gap-10'>
          <div className='flex items-start justify-between gap-4 md:gap-6'>
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
              variant='pink'
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
