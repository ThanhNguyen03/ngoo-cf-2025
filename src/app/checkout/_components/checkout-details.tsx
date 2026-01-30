import { emptyBoxIcon } from '@/assets/icons'
import { AmountCounter } from '@/components/ui'
import { EItemModalDetailStatus, ItemDetailModal } from '@/components/ui/modal'
import { ConfirmModal } from '@/components/ui/modal/ConfirmModal'
import useCartStore, { calculateItemPrice } from '@/store/cart-store'
import { TCartItem } from '@/types'
import { cn } from '@/utils'
import {
  CaretLeftIcon,
  DotsThreeVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { FC, useState } from 'react'

type TItemCheckoutProps = {
  data: TCartItem
  handleSelectDeleteItem: (item: TCartItem) => void
  handleSelectUpdateItem: (item: TCartItem) => void
}
const ItemCheckout: FC<TItemCheckoutProps> = ({
  data,
  handleSelectDeleteItem,
  handleSelectUpdateItem,
}) => {
  const updateCartItem = useCartStore((state) => state.updateCartItem)

  const handleChangeAmount = (newAmount: number) => {
    updateCartItem(data.itemId, data.selectedOptions || [], {
      amount: newAmount,
    })
  }

  return (
    <>
      {/* product */}
      <td className='size-full p-4'>
        <div className='flex size-full gap-4'>
          <div className='rounded-2 relative size-30 bg-linear-to-br from-green-200 to-green-100'>
            <Image
              alt={data.itemInfo.name}
              src={data.itemInfo.image}
              width={200}
              height={200}
              className='rounded-2 size-auto object-cover'
            />
          </div>
          <div className='flex flex-col items-start p-1'>
            <h5 className='text-16 mb-1 font-semibold'>{data.itemInfo.name}</h5>
            <ul className='list-outside list-disc pl-5'>
              {data.selectedOptions &&
                data.selectedOptions.map((option) => (
                  <li key={option.name} className='text-14 text-dark-600/70'>
                    {option.group === 'size' ? 'Size' : ''} {option.name}{' '}
                    {option.extraPrice && option.extraPrice > 0
                      ? `(+${option.extraPrice}$)`
                      : ''}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </td>

      {/* price */}
      <td className='size-full px-2 py-4'>
        <p className='text-16 size-full min-w-25 text-center font-semibold'>
          {calculateItemPrice(
            data.itemInfo,
            data.selectedOptions || [],
            data.amount,
          ).toFixed(2)}
          $
        </p>
      </td>

      {/* quantity */}
      <td className='size-full p-4'>
        <AmountCounter
          className='flex w-full items-center justify-center gap-4 px-2 md:gap-6 md:px-4'
          isInputAmount
          onChange={handleChangeAmount}
          amount={data.amount}
          min={1}
        />
      </td>

      {/* option */}
      <td className='size-full py-4'>
        <div className='center size-full gap-2'>
          <button
            onClick={() => handleSelectUpdateItem(data)}
            className='rounded-2 cursor-pointer bg-blue-50 from-blue-200 to-blue-50 p-2 duration-300 hover:bg-linear-to-br'
          >
            <PencilIcon className='text-blue-500' size={20} />
          </button>
          <button
            onClick={() => handleSelectDeleteItem(data)}
            className='from-secondary-100 to-secondary-50 rounded-2 bg-secondary-50 cursor-pointer p-2 duration-300 hover:bg-linear-to-br'
          >
            <TrashIcon className='text-secondary-500' size={20} />
          </button>
        </div>
      </td>
    </>
  )
}

export const CheckoutDetails = () => {
  const listCartItem = useCartStore((state) => state.listCartItem)
  const getTotalCartPrice = useCartStore((state) => state.getTotalCartPrice)
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const [selectedDeleteItem, setSelectedDeleteItem] = useState<TCartItem>()
  const [selectedUpdateItem, setSelectedUpdateItem] = useState<TCartItem>()

  return (
    <div className='relative flex size-full max-w-[65%] flex-col items-start gap-4 overflow-hidden md:gap-6'>
      <h1 className='text-28 md:text-32 text-shadow-stroke-2 font-lobster w-fit pl-1.25 text-center font-black text-white'>
        Shopping Cart.
      </h1>

      {/* detail cart item */}
      <div className='flex size-full flex-col items-end gap-4 overflow-auto bg-white md:gap-6'>
        {/* data.length === 0 &&  */}
        <table
          className={cn(
            'relative w-full',
            listCartItem.length === 0
              ? 'h-full'
              : 'border-dark-600/10 border-b-2',
          )}
        >
          <colgroup>
            <col className='w-full' />
            <col className='w-full' />
            <col className='w-full' />
            <col className='w-20' />
          </colgroup>
          <thead className='border-dark-600/10 sticky top-0 z-10 border-b-2'>
            <tr className='text-dark-600'>
              <th className='text-16 p-4 text-start font-semibold'>Product</th>
              <th className='text-16 px-6 py-4 text-center font-semibold'>
                Price
              </th>
              <th className='text-16 p-4 text-center font-semibold'>
                Quantity
              </th>
              <th className='px-4'>
                <div className='center size-full'>
                  <DotsThreeVerticalIcon
                    fill='bold'
                    size={20}
                    className='text-dark-600'
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {listCartItem.length > 0 ? (
              listCartItem.map((item, i) => (
                <tr className='relative' key={`${item.itemId}-${i}`}>
                  <ItemCheckout
                    handleSelectDeleteItem={setSelectedDeleteItem}
                    handleSelectUpdateItem={setSelectedUpdateItem}
                    data={item}
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td className='py-10'>
                  <div className='center h-40 w-full flex-col p-4 text-center'>
                    <Image
                      alt='empty box'
                      src={emptyBoxIcon}
                      width={200}
                      height={200}
                      className='size-50'
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className='flex size-full items-end justify-between'>
          <Link
            href='/menu'
            className='text-16 text-dark-600 font-shantell center ml-3 gap-3 font-semibold duration-300 hover:-translate-x-3'
          >
            <CaretLeftIcon size={20} />
            <p>Continue shopping</p>
          </Link>
          {listCartItem.length > 0 && (
            <div className='flex flex-col gap-3'>
              <div className='center font-shantell text-14 justify-between gap-10 px-4 md:px-6'>
                <p className='text-dark-600/70'>Subtotal:</p>
                <p className='font-semibold'>
                  {getTotalCartPrice().toFixed(2)}$
                </p>
              </div>
              <div className='center font-shantell text-14 justify-between gap-10 pr-4 pl-3.75 md:pr-6 md:pl-5.75'>
                <p className='text-dark-600/70'>Shipping:</p>
                <p className='font-semibold'>Free</p>
              </div>

              <div className='bg-dark-600/10 h-0.5 w-full' />

              <div className='center text-16 justify-between gap-10 pr-4 pl-7.5 font-semibold md:pr-6 md:pl-9.5'>
                <p className='font-small-caps text-18 font-bold'>Total:</p>
                <p>{getTotalCartPrice().toFixed(2)}$</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedDeleteItem && (
        <ConfirmModal
          isOpen={!!selectedDeleteItem}
          onClose={() => setSelectedDeleteItem(undefined)}
          message={`Delete ${selectedDeleteItem.itemInfo.name}?`}
          onConfirm={() =>
            removeFromCart(
              selectedDeleteItem.itemId,
              selectedDeleteItem?.selectedOptions || [],
            )
          }
        />
      )}

      {selectedUpdateItem && (
        <ItemDetailModal
          isOpen={!!selectedUpdateItem}
          onClose={() => setSelectedUpdateItem(undefined)}
          data={selectedUpdateItem.itemInfo}
          cartItem={selectedUpdateItem}
          status={EItemModalDetailStatus.UPDATE}
        />
      )}
    </div>
  )
}
