import { LoginModal } from '@/components/ui/modal'
import { AccountPopover } from '@/components/ui/popover'
import { useClickOutside } from '@/hooks/use-click-outside'
import useAuthStore from '@/store/auth-store'
import { truncateAddress } from '@/utils'
import { SignInIcon } from '@phosphor-icons/react/dist/ssr'
import { useSession } from 'next-auth/react'
import { useRef, useState } from 'react'

export const AuthenButton = () => {
  const { status } = useSession()
  const userInfo = useAuthStore((state) => state.userInfo)

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openAccountPopover, setOpenAccountPopover] = useState<boolean>(false)

  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const { ref: containerRef } = useClickOutside<HTMLDivElement>(() => {
    if (openAccountPopover) {
      setOpenAccountPopover(false)
    }
  })

  return (
    <div className='relative w-fit' ref={containerRef}>
      {status !== 'unauthenticated' && userInfo ? (
        <>
          <button
            className='flex cursor-pointer flex-col items-end justify-end'
            onClick={() => setOpenAccountPopover(true)}
            ref={triggerButtonRef}
          >
            <p className='text-16 text-primary-600 max-w-[113px]! truncate font-bold -tracking-[0.32px]'>
              {userInfo.name || userInfo.email}
            </p>
            {userInfo.walletAddress && (
              <p className='text-14 max-w-[113px]! truncate font-bold -tracking-[0.32px]'>
                {truncateAddress(userInfo.walletAddress, 6)}
              </p>
            )}
          </button>

          <AccountPopover
            userInfo={userInfo}
            isOpen={openAccountPopover}
            onClose={() => setOpenAccountPopover(false)}
            ref={popoverRef}
          />
        </>
      ) : (
        <>
          <button
            className='rounded-2 text-14! from-secondary-300 hidden cursor-pointer items-center justify-center gap-1 bg-linear-to-br to-red-500 px-2 py-1 leading-[160%] font-semibold text-white shadow md:flex'
            onClick={() => setOpenLoginModal(true)}
          >
            Sign In
            <SignInIcon size={18} />
          </button>
          <LoginModal
            isOpen={openLoginModal}
            onClose={() => setOpenLoginModal(false)}
          />
        </>
      )}
    </div>
  )
}
