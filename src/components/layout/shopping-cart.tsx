import useCartStore from '@/store/cart-store'
import { BasketIcon } from '@phosphor-icons/react/dist/ssr'

export const ShoppingCart = () => {
  const { listCartItem } = useCartStore()
  return (
    <>
      {listCartItem.length > 0 && (
        <div className='sticky bottom-20 z-50 mx-auto max-w-[1024px]'>
          <div className='relative ml-auto size-fit'>
            <div className='bg-secondary-500 center absolute -top-1 -right-1 flex rounded-full px-1 py-0.5'>
              <p className='center text-12 mt-0.25 text-center text-white'>
                {listCartItem.length > 9 ? '9+' : listCartItem.length}
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
