import useCartStore from '@/store/cart-store'
import { cn } from '@/utils'
import { BasketIcon } from '@phosphor-icons/react/dist/ssr'

export const ShoppingCart = () => {
  const { cartAmount } = useCartStore()

  return (
    <>
      {cartAmount > 0 && (
        <div className='sticky bottom-20 z-50 mx-auto max-w-[1200px]'>
          <div className='relative ml-auto size-fit'>
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
              onClick={() => console.log('first')}
              className='center rounded-10 border-primary-500/15 from-primary-500/15 group to-primary-500/2 hover:from-secondary-500/5 hover:to-secondary-500/15 flex size-fit cursor-pointer border bg-white bg-linear-to-br p-3 shadow-[0px_4px_12px_0px_rgba(9,9,11,0.02)] duration-700'
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
    </>
  )
}
