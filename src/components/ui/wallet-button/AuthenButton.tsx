import { LoginModal } from '@/components/ui/modal'
import { AccountPopover } from '@/components/ui/popover'
import { useClickOutside } from '@/hooks/use-click-outside'
import useAuthStore from '@/store/auth-store'
import { truncateAddress } from '@/utils'
import { SignInIcon } from '@phosphor-icons/react/dist/ssr'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export const AuthenButton = () => {
  const { status } = useSession()
  const userInfo = useAuthStore((state) => state.userInfo)
  const router = useRouter()
  const searchParams = useSearchParams()

  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const [openAccountPopover, setOpenAccountPopover] = useState<boolean>(false)

  // Guard against StrictMode double-fire or rapid searchParams changes
  const loginHandledRef = useRef(false)

  // Auto-open the login modal when the middleware redirects here with ?login=true.
  // This gives users clear feedback instead of silently landing on the home page.
  useEffect(() => {
    if (
      searchParams.get('login') === 'true' &&
      status === 'unauthenticated' &&
      !loginHandledRef.current
    ) {
      loginHandledRef.current = true
      setOpenLoginModal(true)
      // Clean up the query param from the URL without a page reload
      const params = new URLSearchParams(searchParams.toString())
      params.delete('login')
      const newUrl = params.size > 0 ? `/?${params}` : '/'
      router.replace(newUrl)
    }
  }, [searchParams, status, router])

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
