import useAuthStore from '@/store/auth-store'
import useCartStore from '@/store/cart-store'
import { cn } from '@/utils'
import { BasketIcon } from '@phosphor-icons/react/dist/ssr'
import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LoginModal } from '../ui/modal'

export const ShoppingCart = () => {
  const { cartAmount } = useCartStore()
  const userInfo = useAuthStore((state) => state.userInfo)
  const pathname = usePathname()

  const { status } = useSession()
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false)
  const router = useRouter()

  const handleClickCart = () => {
    if (status === 'unauthenticated' || !userInfo) {
      setOpenLoginModal(true)
      return
    }
    router.push('/checkout')
  }

  return (
    <>
      {cartAmount > 0 && !pathname.includes('checkout') && (
        <div className='pointer-events-none sticky bottom-20 z-50 px-2 md:px-6 lg:px-10'>
          <div className='relative z-50 mx-auto w-full max-w-[1200px]'>
            <div
              className={cn(
                'bg-secondary-500 center absolute -top-1 -right-1 flex rounded-full px-2 py-0.5',
                cartAmount > 9 && 'px-1',
              )}
            >
              <p className='center text-12 mt-0.25 text-center text-white'>
                {cartAmount > 9 ? '9+' : cartAmount}
              </p>
            </div>
            <button
              onClick={handleClickCart}
              className='center rounded-10 border-primary-500/15 from-primary-500/15 group to-primary-500/2 hover:from-secondary-500/5 hover:to-secondary-500/15 pointer-events-auto ml-auto flex size-fit cursor-pointer border bg-white bg-linear-to-br p-3 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] duration-700'
            >
              <BasketIcon
                size={24}
                weight='fill'
                className='text-orange-800 duration-700 group-hover:text-orange-600'
              />
            </button>
          </div>
        </div>
      )}
      <LoginModal
        isOpen={openLoginModal}
        onClose={() => setOpenLoginModal(false)}
      />
    </>
  )
}
