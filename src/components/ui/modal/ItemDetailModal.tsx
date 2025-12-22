'use client'

import { AmountCounter, Button, Checkbox } from '@/components/ui'
import { DEBOUNCE_DURATION } from '@/constants'
import {
  EItemStatus,
  ItemOptionInput,
  TItemOption,
  TItemResponse,
} from '@/lib/graphql/generated/graphql'
import useCartStore, { calculateItemPrice } from '@/store/cart-store'
import { TCartItem, TModalProps } from '@/types'
import { cn } from '@/utils'
import { TagIcon, TrashIcon, XIcon } from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { FC, useEffect, useMemo, useState } from 'react'
import { Modal } from './Modal'

type TItemOptionProps = {
  title: string
  isRequired?: boolean
  className?: string
  onChange: (selected: TItemOption[]) => void
  selectedOptions: ItemOptionInput[]
  listOption: TItemOption[]
}

type TItemOptionGroup = {
  group: string
  list: TItemOption[]
}

const ItemOption: FC<TItemOptionProps> = ({
  title,
  listOption,
  className,
  isRequired,
  onChange,
  selectedOptions,
}) => {
  const isSelected = (opt: TItemOption) =>
    selectedOptions.some((s) => s.group === opt.group && s.name === opt.name)

  const handleCheckboxChange = (opt: TItemOption) => {
    // required only check 1
    if (isRequired) {
      onChange([opt])
    } else {
      // optional
      const exists = isSelected(opt)
      if (exists) {
        onChange(
          selectedOptions.filter(
            (s) => !(s.group === opt.group && s.name === opt.name),
          ),
        )
      } else {
        onChange([...selectedOptions, opt])
      }
    }
  }

  return (
    <div
      className={cn(
        'border-dark-600/10 flex w-full flex-col gap-2 border-b py-2 pb-1 md:gap-4 md:py-4',
        className,
      )}
    >
      <div className='flex items-center justify-between'>
        <h3 className='font-small-caps text-20 font-semibold'>{title}</h3>
        <p
          className={cn(
            'rounded-2 bg-shade-700/10 text-dark-600/70 !text-12 px-2 py-0.75 font-medium',
            selectedOptions.length > 0 &&
              'bg-green-100 font-semibold text-green-600',
          )}
        >
          {selectedOptions.length > 0
            ? 'Selected'
            : isRequired
              ? 'Select 1 option'
              : `Optional - maximum ${listOption.length}`}
        </p>
      </div>
      {/* checkbox */}
      <div className='flex w-full flex-col items-start gap-1'>
        {listOption.map((option) => {
          const checked = isSelected(option)
          return (
            <div
              key={option.name}
              className='flex w-full items-center justify-between'
            >
              <div className='flex items-center gap-2'>
                <Checkbox
                  type={isRequired ? 'radio' : 'checkbox'}
                  checked={checked}
                  onChange={() => handleCheckboxChange(option)}
                  label={option.name}
                  className={cn(
                    selectedOptions.length > 0 &&
                      !checked &&
                      isRequired &&
                      'opacity-30',
                  )}
                  labelClassName={cn(
                    selectedOptions.length > 0 &&
                      !checked &&
                      isRequired &&
                      'opacity-30',
                  )}
                />
              </div>
              {option.extraPrice && (
                <p className='rounded-2 bg-shade-700/10 text-dark-600 text-12 min-w-10 px-1 py-0.75 text-center'>
                  +{option.extraPrice}$
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export enum EItemModalDetailStatus {
  UPDATE = 'update',
  CREATE = 'create',
}

type TItemDetailModalProps = TModalProps & {
  data: TItemResponse
  cartItem?: TCartItem
  status: EItemModalDetailStatus
}
export const ItemDetailModal: FC<TItemDetailModalProps> = ({
  isOpen,
  onClose,
  data,
  cartItem,
  status,
}) => {
  const { addToCart, removeFromCart, updateCartItem } = useCartStore()

  const [itemAmount, setItemAmount] = useState<number>(
    status === EItemModalDetailStatus.UPDATE ? cartItem?.amount || 1 : 1,
  )
  const [selectedOptions, setSelectedOptions] = useState<ItemOptionInput[]>(
    status === EItemModalDetailStatus.UPDATE
      ? cartItem?.selectedOptions || []
      : [],
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const requiredGroups: TItemOptionGroup[] = useMemo(() => {
    const map = new Map<string, TItemOption[]>()
    for (const opt of data.requireOption) {
      if (!map.has(opt.group)) {
        map.set(opt.group, [])
      }
      map.get(opt.group)!.push(opt)
    }
    return Array.from(map.entries()).map(([group, list]) => ({ group, list }))
  }, [data.requireOption])

  const additionalGroups: TItemOptionGroup[] = useMemo(() => {
    if (!data.additionalOption) {
      return []
    }
    const map = new Map<string, TItemOption[]>()
    for (const opt of data.additionalOption) {
      if (!map.has(opt.group)) {
        map.set(opt.group, [])
      }
      map.get(opt.group)!.push(opt)
    }
    return Array.from(map.entries()).map(([group, list]) => ({ group, list }))
  }, [data.additionalOption])

  const isRequiredSelected = useMemo(() => {
    if (requiredGroups.length === 0) {
      return true
    }
    return requiredGroups.every((o) =>
      selectedOptions.some((r) => r.group === o.group),
    )
  }, [requiredGroups, selectedOptions])

  useEffect(() => {
    setLoading(true)
    const handler = setTimeout(() => {
      setTotalPrice(calculateItemPrice(data, selectedOptions, itemAmount))
      setLoading(false)
    }, DEBOUNCE_DURATION)
    return () => clearTimeout(handler)
  }, [itemAmount, data, selectedOptions])

  const handleSubmit = () => {
    if (itemAmount === 0) {
      removeFromCart(data.itemId, selectedOptions)
      onClose()
      return
    }

    // UPDATE
    if (status === EItemModalDetailStatus.UPDATE && cartItem) {
      updateCartItem(data.itemId, cartItem.selectedOptions || [], {
        amount: itemAmount,
        selectedOptions,
      })
      onClose()
      return
    }

    // CREATE
    addToCart(data, selectedOptions, itemAmount)
    onClose()
  }

  useEffect(() => {
    if (!cartItem) {
      setItemAmount(1)
      setSelectedOptions([])
      return
    }
    if (status === EItemModalDetailStatus.UPDATE) {
      setItemAmount(cartItem.amount)
      setSelectedOptions(cartItem.selectedOptions || [])
    } else {
      setItemAmount(1)
      setSelectedOptions([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.itemId, status])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='rounded-4 max-h-[80%] w-80 overflow-hidden md:w-[420px]'
      closable={false}
      closeOnOutsideClick
    >
      <div className='rounded-4 relative flex size-full flex-col overflow-hidden'>
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/60 fixed top-4 right-4 z-10 flex items-center justify-center gap-0 rounded-full border border-neutral-900/10 p-1 backdrop-blur-2xl'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>
        <Image
          alt={`image-${data.name}`}
          src={data.image}
          width={500}
          height={500}
          className={cn(
            'rounded-t-4 h-60 w-full object-cover object-center',
            data.status?.includes(EItemStatus.New) && 'h-80 object-top',
          )}
        />
        <div className='mb-8 flex w-full flex-col bg-white'>
          {/* main detail */}
          <div className='border-dark-600/10 flex flex-col gap-0.25 border-b p-2 pb-4 md:p-4 md:pb-6'>
            {data.discountPercent && (
              <div className='flex items-start gap-1'>
                <TagIcon size={14} className='text-secondary-500 rotate-90' />
                <p className='text-12! text-dark-600'>
                  Sale {data.discountPercent}%
                </p>
              </div>
            )}
            <div className='flex w-full items-start justify-between'>
              <h3 className='text-18 from-primary-500 to-secondary-300 mt-1 bg-linear-to-r bg-clip-text font-bold text-transparent'>
                {data.name}
              </h3>
              <div className='flex items-start justify-center gap-2'>
                <p
                  className={cn(
                    'text-16! text-dark-600/50 mt-1.25',
                    !!data.discountPercent &&
                      'text-dark-600/50 text-12! line-through',
                  )}
                >
                  {data.price}$
                </p>
                {data.discountPercent && (
                  <p className='text-18! text-dark-600/70 font-bold'>
                    {data.price - (data.price * data.discountPercent) / 100}$
                  </p>
                )}
              </div>
            </div>
            <p className='text-14 text-dark-600 pt-2.75 font-medium'>
              {data.description}
            </p>
          </div>

          {/* Optional */}
          <div className='border-dark-600/10 border-b px-2 md:px-4'>
            {/* REQUIRED OPTIONS */}{' '}
            {requiredGroups.map((g) => (
              <ItemOption
                key={`req-${g.group}`}
                title={g.group}
                isRequired
                listOption={g.list}
                selectedOptions={selectedOptions.filter(
                  (s) => s.group === g.group,
                )}
                onChange={(next) => {
                  // replace selectedOptions for this group with next
                  setSelectedOptions((prev) => [
                    ...prev.filter((s) => s.group !== g.group),
                    ...next,
                  ])
                }}
              />
            ))}
            {/* ADDITIONAL OPTIONS */}
            {additionalGroups.map((g, i) => (
              <ItemOption
                key={`add-${g.group}`}
                title={g.group}
                listOption={g.list}
                selectedOptions={selectedOptions.filter(
                  (s) => s.group === g.group,
                )}
                onChange={(next) => {
                  setSelectedOptions((prev) => [
                    ...prev.filter((s) => s.group !== g.group),
                    ...next,
                  ])
                }}
                className={cn(
                  i === additionalGroups.length - 1 && 'border-b-0',
                )}
              />
            ))}
          </div>

          {/* Noted */}
          <div className='flex w-full flex-col gap-2 p-2 pb-1 md:gap-4 md:p-4'>
            <div className='flex items-center justify-between'>
              <h3 className='font-small-caps text-18 font-semibold uppercase'>
                Note:
              </h3>
              <p className='rounded-2 bg-shade-700/10 text-dark-600/70 !text-12 px-2 py-0.75'>
                Optional
              </p>
            </div>
            <textarea
              className='rounded-2 placeholder:text-14 text-16 border border-neutral-900/10 p-2 text-neutral-800 placeholder:leading-[160%] placeholder:text-neutral-900/50 focus-within:outline-none focus:ring-0 focus:ring-offset-0'
              placeholder="The fulfillment of the request depends on the restaurant's capabilities."
            />
          </div>

          {/* Amounts */}
          <AmountCounter
            className='mb-14 flex w-full items-center justify-center gap-4 px-2 md:gap-6 md:px-4'
            isInputAmount
            onChange={setItemAmount}
            amount={itemAmount}
          />
        </div>
        {/* Submit button */}
        <div className='bg-beige-50 border-dark-600/10 fixed bottom-0 flex w-full justify-center border-t p-2 md:p-4'>
          <Button
            disableAnimation
            onClick={handleSubmit}
            disabled={
              (!isRequiredSelected && itemAmount !== 0) ||
              loading ||
              (status === EItemModalDetailStatus.CREATE && itemAmount === 0)
            }
            className={cn(
              'rounded-3 w-full px-4 py-2 text-white duration-200',
              itemAmount === 0 ? 'bg-red-500' : 'bg-green-500',
            )}
          >
            {itemAmount === 0 ? (
              <>
                <TrashIcon size={20} className='text-white' />
                Delete Order
              </>
            ) : (
              <>
                {status === EItemModalDetailStatus.UPDATE
                  ? 'Update item'
                  : 'Add to cart'}{' '}
                {totalPrice.toFixed(2)}$
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
