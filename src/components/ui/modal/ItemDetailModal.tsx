import { DEBOUNCE_DURATION } from '@/constants'
import { useDebounce } from '@/hooks/use-debounce'
import { TItem, TItemOption, TListItemOption, TModalProps } from '@/types'
import { cn } from '@/utils'
import {
  MinusIcon,
  PlusIcon,
  TagIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import { ChangeEvent, FC, useEffect, useMemo, useState } from 'react'
import Button from '../Button'
import { Checkbox } from '../CheckBox'
import { Modal } from './Modal'

const LIST_DEFAULT_OPTION: TListItemOption[] = [
  {
    title: 'size',
    listOption: [{ name: 'M' }, { name: 'L', extraPrice: 2 }],
    isRequired: true,
  },
  {
    title: 'sweet',
    listOption: [
      { name: 'Less Sweet' },
      { name: 'Default Sweet' },
      { name: 'More Sweet' },
    ],
    isRequired: true,
  },
  {
    title: 'ice',
    listOption: [
      { name: 'Less Ices' },
      { name: 'Default Ices' },
      { name: 'More Ices' },
    ],
    isRequired: true,
  },
]

type TItemOptionProps = TListItemOption & {
  className?: string
  onChange?: (selected: string[] | string) => void
}

const ItemOption: FC<TItemOptionProps> = ({
  title,
  listOption,
  className,
  isRequired,
  onChange,
}) => {
  const [radioOption, setRadioOption] = useState<string | string[]>(
    isRequired ? '' : [],
  )

  useEffect(() => {
    onChange?.(radioOption)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radioOption, isRequired])

  const handleCheckboxChange = (value: string) => {
    if (!isRequired) {
      setRadioOption((prev) => {
        if (Array.isArray(prev)) {
          return prev.includes(value)
            ? prev.filter((option) => option !== value)
            : [...prev, value]
        }
        return [value]
      })
    } else {
      setRadioOption(value)
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
        <h3 className='font-small-caps text-18 font-semibold uppercase'>
          {title}
        </h3>
        <p
          className={cn(
            'rounded-2 bg-shade-700/10 text-dark-600/70 !text-12 px-2 py-0.75',
            (Array.isArray(radioOption)
              ? radioOption.length > 0
              : !!radioOption) && 'bg-green-100 text-green-600',
          )}
        >
          {(Array.isArray(radioOption) ? radioOption.length > 0 : !!radioOption)
            ? 'Selected'
            : isRequired
              ? 'Select 1 option'
              : `Optional - maximum ${listOption.length}`}
        </p>
      </div>
      {/* checkbox */}
      <div className='flex w-full flex-col items-start gap-1'>
        {listOption.map((option) => (
          <div
            key={option.name}
            className='flex w-full items-center justify-between'
          >
            <div className='flex items-center gap-2'>
              <Checkbox
                type={isRequired ? 'radio' : 'checkbox'}
                checked={
                  Array.isArray(radioOption)
                    ? radioOption.includes(option.name)
                    : radioOption === option.name
                }
                onChange={() => handleCheckboxChange(option.name)}
                label={option.name}
                className={cn(
                  radioOption &&
                    isRequired &&
                    radioOption !== option.name &&
                    'opacity-30',
                )}
                labelClassName={cn(
                  radioOption &&
                    isRequired &&
                    radioOption !== option.name &&
                    'opacity-30',
                )}
              />
            </div>
            {option.extraPrice && (
              <p className='rounded-2 bg-shade-700/10 text-dark-600/70 text-10 min-w-10 px-1 py-0.75 text-center'>
                +{option.extraPrice}$
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const ItemDetailModal: FC<TModalProps & { data: TItem }> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [itemAmount, setItemAmount] = useState<number>(1)
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string | string[]>
  >({})

  const debounceAmount = useDebounce(itemAmount, DEBOUNCE_DURATION)

  const isRequiredSelected = useMemo(() => {
    const requiredOptions = [
      ...LIST_DEFAULT_OPTION.filter((opt) => opt.isRequired).map(
        (opt) => opt.title,
      ),
      ...(data.additionalOption
        ?.filter((opt) => opt.isRequired)
        .map((opt) => opt.title) || []),
    ]

    return requiredOptions.every((key) => {
      const value = selectedOptions[key]
      if (Array.isArray(value)) {
        return value.length > 0
      }
      return !!value
    })
  }, [selectedOptions, data])

  const totalPrice = useMemo(() => {
    const basePrice = data.amountDiscount
      ? data.price - (data.price * data.amountDiscount) / 100
      : data.price

    const findOption = (name: string): TItemOption | undefined => {
      const allOptions = [
        ...LIST_DEFAULT_OPTION.flatMap((add) => add.listOption),
        ...(data.additionalOption?.flatMap((add) => add.listOption) ?? []),
      ]
      return allOptions.find((opt) => opt.name === name)
    }
    let extraPrice = 0
    Object.entries(selectedOptions).forEach(([, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          const option = findOption(v)
          if (option && option.extraPrice) {
            extraPrice += Number(option.extraPrice) || 0
          }
        })
      } else {
        const option = findOption(value)
        if (option && option.extraPrice) {
          extraPrice += Number(option.extraPrice) || 0
        }
      }
    })
    return (basePrice + extraPrice) * debounceAmount
  }, [debounceAmount, data, selectedOptions])

  const onChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0
    setItemAmount(value)
  }

  const handleSubmit = () => {
    if (itemAmount === 0) {
      onClose()
    } else {
      // TODO:
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='bg-beige-50 max-h-[80%] w-80 md:w-[420px]'
      closable={false}
      closeOnOutsideClick
    >
      <div className='relative flex size-full flex-col'>
        <Button
          onClick={onClose}
          disableAnimation
          className='bg-beige-50/50 fixed top-4 right-4 z-10 flex items-center justify-center gap-0 rounded-full p-1 backdrop-blur-2xl'
        >
          <XIcon size={16} className='text-dark-600' />
        </Button>
        <Image
          alt={`image-${data.title}`}
          src={data.image}
          width={240}
          height={240}
          className='rounded-t-2 h-60 w-full object-cover'
        />
        <div className='flex w-full flex-col'>
          {/* main detail */}
          <div className='border-dark-600/10 flex flex-col gap-0.25 border-b p-2 pb-4 md:p-4 md:pb-6'>
            <div className='flex w-full items-start justify-between'>
              <h3 className='text-18 mt-1 leading-5 font-bold'>{data.title}</h3>
              <div className='flex items-start justify-center gap-2'>
                <p
                  className={cn(
                    'text-16! text-dark-600/50 mt-1.25',
                    !!data.amountDiscount &&
                      'text-dark-600/50 text-12! line-through',
                  )}
                >
                  {data.price}$
                </p>
                {data.amountDiscount && (
                  <p className='text-18! text-dark-600/70 font-bold'>
                    {data.price - (data.price * data.amountDiscount) / 100}$
                  </p>
                )}
              </div>
            </div>
            {data.amountDiscount && (
              <div className='flex items-start gap-1'>
                <TagIcon size={14} className='text-secondary-500 rotate-90' />
                <p className='text-12! text-dark-600/70'>
                  Sale {data.amountDiscount}%
                </p>
              </div>
            )}
            <p className='text-12 text-dark-600/50 pt-2.75'>
              {data.description}
            </p>
          </div>

          {/* required option */}
          <div className='border-dark-600/10 border-b px-2 md:px-4'>
            {LIST_DEFAULT_OPTION.map((add, i) => (
              <ItemOption
                key={add.title}
                isRequired={add.isRequired}
                title={add.title}
                listOption={add.listOption}
                className={cn(
                  i === LIST_DEFAULT_OPTION.length - 1 && 'border-0',
                )}
                onChange={(v) =>
                  setSelectedOptions((prev) => ({ ...prev, [add.title]: v }))
                }
              />
            ))}
          </div>

          {/* Optional */}
          {data.additionalOption && data.additionalOption.length > 0 && (
            <div className='border-dark-600/10 border-b px-2 md:px-4'>
              {data.additionalOption.map((add, i) => (
                <ItemOption
                  key={add.title}
                  isRequired={add.isRequired}
                  title={add.title}
                  listOption={add.listOption}
                  className={cn(
                    data.additionalOption &&
                      data.additionalOption.length > 0 &&
                      i === data.additionalOption.length - 1 &&
                      'border-0',
                  )}
                  onChange={(v) =>
                    setSelectedOptions((prev) => ({ ...prev, [add.title]: v }))
                  }
                />
              ))}
            </div>
          )}

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
          <div className='flex w-full items-center justify-center gap-4 p-2 md:gap-6 md:p-4'>
            <Button
              onClick={() => {
                if (itemAmount > 0) {
                  setItemAmount((prev) => prev - 1)
                }
              }}
              disabled={itemAmount < 1}
              className='rounded-full bg-green-500 p-1.5'
              disableAnimation
              icon={
                <MinusIcon className='text-white' size={14} weight='bold' />
              }
            />
            <input
              className='rounded-2 flex size-8 items-center justify-center border border-neutral-900/10 text-center text-sm text-neutral-800 lining-nums focus-within:outline-none focus:ring-0 focus:ring-offset-0 disabled:pointer-events-none disabled:opacity-50'
              type='number'
              aria-label='Enter page'
              value={itemAmount}
              min={0}
              onChange={onChangeAmount}
            />
            <Button
              onClick={() => setItemAmount((prev) => prev + 1)}
              className='rounded-full bg-green-500 p-1.5'
              disableAnimation
              icon={<PlusIcon className='text-white' size={14} weight='bold' />}
            />
          </div>
        </div>
        {/* Submit button */}
        <div className='bg-beige-50 fixed bottom-0 flex w-full justify-center p-2 md:p-4'>
          <Button
            disableAnimation
            onClick={handleSubmit}
            disabled={!isRequiredSelected}
            className={cn(
              'rounded-3 w-full px-4 py-2 text-white',
              itemAmount === 0 ? 'bg-red-500' : 'bg-green-500',
            )}
          >
            {itemAmount === 0 ? (
              <>
                <TrashIcon size={20} className='text-white' />
                Delete Order
              </>
            ) : (
              <>Add to cart {totalPrice.toFixed(2)}$</>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ItemDetailModal
