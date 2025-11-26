import { LIST_FOOTER_NAVIGATION, LIST_SOCIAL_BUTTON } from '@/constants'
import Link from 'next/link'
import { NgOoLogo } from '../ui/NgOoLogo'

export const Footer = () => {
  return (
    <footer className='border-t border-neutral-900/10 bg-white px-2 md:p-10 lg:px-10 lg:py-0'>
      <div className='relative mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center gap-14 pt-10'>
        {/* list */}
        <div className='flex w-full flex-col gap-10 pb-10 md:flex-row md:justify-between'>
          {/* left */}
          <div className='flex w-full min-w-70 flex-col gap-6 md:max-w-100 md:items-start'>
            {/* logo */}
            <NgOoLogo />
            {/* description */}
            <p className='text-14! leading-[160%] text-neutral-900/70 md:text-left'>
              The <b>NgOo Coffee</b> by{' '}
              <span className='underline'>thanhf.ng_</span>
            </p>
            {/* social */}
            <div className='flex items-center gap-6'>
              {LIST_SOCIAL_BUTTON.map((link) => (
                <Link
                  key={link.name}
                  className='size-6'
                  href={link.href}
                  title={link.name}
                  target='_blank'
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* right */}
          <div className='flex gap-10 lg:gap-20'>
            {LIST_FOOTER_NAVIGATION.map((link) => (
              <div key={link.title} className='flex flex-col gap-4 lg:gap-3'>
                <p className='text-14! leading-[160%] font-semibold text-neutral-900/30'>
                  {link.title}
                </p>
                <ul className='flex flex-col gap-4 text-left font-semibold lg:gap-1'>
                  {link.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        target={child.openInNewTab ? '_blank' : '_self'}
                        href={child.href}
                        title={child.name}
                        className='text-14! hover:text-primary-500 animated-hover-underline hover:before:bg-primary-500 py-0.75 leading-[160%] text-neutral-900 before:h-[1px]'
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* policy */}
        <div className='text-12! flex w-full flex-col justify-between gap-2 border-t border-neutral-900/10 py-2 leading-[130%] md:flex-row md:gap-0'>
          <p className='font-medium text-neutral-900/50'>
            © 2025 <span className='italic'>thanhf.ng_</span>. All rights
            reserved.
          </p>
          <div className='flex items-center gap-3'>
            <Link
              href='/'
              title='Privacy Policy'
              className='py-0.75 text-neutral-900 underline'
            >
              Privacy Policy
            </Link>
            <Link
              href='/'
              title='Term of Service'
              className='py-0.75 text-neutral-900 underline'
            >
              Term of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
