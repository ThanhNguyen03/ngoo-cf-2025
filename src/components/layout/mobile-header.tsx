import { LIST_HEADER_NAVIGATION, LIST_SOCIAL_BUTTON } from '@/constants'
import { cn } from '@/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

type TMobileHeaderProps = {
  isOpen: boolean
  onClose: () => void
}
export const MobileHeader: FC<TMobileHeaderProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        'from-beige-50 to-primary-300 absolute inset-0 bg-linear-to-b from-60% backdrop-blur-3xl duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden',
        isOpen
          ? 'h-screen max-h-screen translate-y-0'
          : 'h-0 max-h-0 -translate-y-full',
      )}
    >
      <div
        className={cn(
          'relative size-full overflow-hidden px-2 pt-30 pb-4 backdrop-blur-3xl duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)]',
          isOpen
            ? 'h-screen max-h-screen translate-y-0'
            : 'h-0 max-h-0 -translate-y-full',
        )}
      >
        <div className='flex size-full flex-col items-start justify-between'>
          <div className='flex h-fit w-full flex-col items-start gap-6'>
            {LIST_HEADER_NAVIGATION.map((link) => (
              <Link
                data-active={pathname === link.href}
                key={link.name}
                href={link.href}
                onClick={onClose}
                className={cn(
                  'group text-23! rounded-4 font-small-caps text-dark-600/50 relative flex size-full items-center gap-6 border border-transparent px-4 py-2 font-bold transition-all duration-300',
                  pathname === link.href &&
                    'text-secondary-500 hover:text-secondary-500 hover:border-cherry-400/30 border-cherry-400/30 border bg-[radial-gradient(circle,hsl(0,96%,70%,0.3)_0%,hsl(335,75%,85%,0.5)_100%)] duration-500 hover:bg-[radial-gradient(circle,hsl(0,96%,70%,0.3)_0%,hsl(335,75%,85%,0.5)_100%)]',
                  'hover:text-dark-600/50 hover:border-dark-600/30 hover:bg-dark-600/10',
                )}
              >
                {link.icon}
                <p>{link.name}</p>
              </Link>
            ))}
          </div>
          <div
            className={cn(
              'flex w-full items-center justify-center gap-10 pt-6',
              isOpen && 'border-dark-600/30 border-t',
            )}
          >
            {LIST_SOCIAL_BUTTON.map((social) => (
              <Link
                key={social.name}
                className='size-6'
                href={social.href}
                title={social.name}
                target='_blank'
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
