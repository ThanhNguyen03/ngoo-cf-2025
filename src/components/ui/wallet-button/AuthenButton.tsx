import { LoginModal } from '@/components/ui/modal'
import { AccountPopover } from '@/components/ui/popover'
import { EAuthMethod, ERole, UserInfo } from '@/lib/graphql/generated/graphql'
import { truncateAddress } from '@/utils'
import { SignInIcon } from '@phosphor-icons/react/dist/ssr'
import { useEffect, useRef, useState } from 'react'

const MOCK_USER_INFO: UserInfo = {
  uuid: '1',
  name: 'John Doe',
  email: 'asdasdasasd@gmail.com',
  role: ERole.User,
  walletAddress: '0x26c89c7A0b40E318C74B21752CdDC9bd7d6415A8',
  authMethod: EAuthMethod.Google,
}

export const AuthenButton = () => {
  // const { status } = useSession()
  const status = 'authenticated' // for demo purpose

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openAccountPopover, setOpenAccountPopover] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const triggerButtonRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // If the click/touch is inside the referenced element, ignore it
      if (
        !containerRef.current ||
        containerRef.current.contains(event.target as Node)
      ) {
        return
      }

      if (openAccountPopover) {
        setOpenAccountPopover(false)
      }
    }

    document.addEventListener('click', listener)
    document.addEventListener('touchstart', listener)

    return () => {
      document.removeEventListener('click', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [containerRef, openAccountPopover])

  return (
    <div className='relative w-fit' ref={containerRef}>
      {status === 'authenticated' ? (
        <>
          <button
            className='flex cursor-pointer flex-col items-end justify-end'
            onClick={() => setOpenAccountPopover(true)}
            ref={triggerButtonRef}
          >
            <p className='text-16 text-primary-600 max-w-[113px]! truncate font-bold -tracking-[0.32px]'>
              {MOCK_USER_INFO.name || MOCK_USER_INFO.email}
            </p>
            {MOCK_USER_INFO.walletAddress && (
              <p className='text-14 max-w-[113px]! truncate font-bold -tracking-[0.32px]'>
                {truncateAddress(MOCK_USER_INFO.walletAddress, 6)}
              </p>
            )}
          </button>

          <AccountPopover
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
            <SignInIcon size={18} />
            Sign In
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
