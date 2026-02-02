import { Button, Checkbox, Tooltip } from '@/components/ui'
import { SelectDropdown } from '@/components/ui/SelectDropdown'
import { TextInput } from '@/components/ui/TextInput'
import { useForm } from '@/hooks/use-form'
import { client } from '@/lib/apollo-client'
import {
  CreateOrderDocument,
  CreateOrderInput,
  EPaymentMethod,
  type UserInfoSnapshotInput,
} from '@/lib/graphql/generated/graphql'
import useAuthStore from '@/store/auth-store'
import useCartStore, { convertCartToOrderItems } from '@/store/cart-store'
import { apolloWrapper, cn } from '@/utils'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  MoneyWavyIcon,
  PaypalLogoIcon,
  XCircleIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { FC, useMemo, useState } from 'react'

type TCheckoutInfoProps = {
  setLoading: (loading: boolean) => void
  startProcessTimeout: () => void
  getCheckoutData: (data: { url: string; orderId: string }) => void
}
export const CheckoutInfo: FC<TCheckoutInfoProps> = ({
  setLoading,
  startProcessTimeout,
  getCheckoutData,
}) => {
  const listCartItem = useCartStore((state) => state.listCartItem)
  const getTotalCartPrice = useCartStore((state) => state.getTotalCartPrice)
  const clearCart = useCartStore((state) => state.clearCart)
  const userInfo = useAuthStore((state) => state.userInfo!)
  const router = useRouter()

  const [openInfoForm, setOpenInfoForm] = useState<boolean>(true)
  const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod>()

  const listPaymentMethod = Object.values(EPaymentMethod)

  const {
    register,
    formState: { values, errors },
  } = useForm<UserInfoSnapshotInput>({
    defaultValues: {
      email: userInfo.email,
      name: userInfo.name ?? '',
      phoneNumber: userInfo.phoneNumber ?? '',
      address: userInfo.address ?? '',
    },
    mode: 'onChange',
  })

  const isValidForm = useMemo(() => {
    return Object.values(values).every((v) => !!v)
  }, [values])

  const handleCheckout = apolloWrapper(
    async () => {
      setLoading(true)
      startProcessTimeout()
      if (!listCartItem || listCartItem.length === 0) {
        throw new Error('Your cart is empty! Check it again')
      }
      if (!isValidForm) {
        throw new Error('Please fill your information!')
      }
      if (!paymentMethod) {
        throw new Error('Please choose your payment method!')
      }

      const userInfo: UserInfoSnapshotInput = {
        address: values.address!,
        email: values.email!,
        name: values.name!,
        phoneNumber: values.phoneNumber!,
      }

      const input: CreateOrderInput = {
        items: convertCartToOrderItems(listCartItem),
        paymentMethod,
        userInfo,
        cancelUrl: `${process.env.APP_URL}/payment/return?status=cancel&t=${Date.now()}`,
        returnUrl: `${process.env.APP_URL}/payment/return?status=success&t=${Date.now()}`,
      }

      const { data, error } = await client.mutate({
        mutation: CreateOrderDocument,
        variables: { input },
      })

      if (error) {
        throw error
      }
      if (data) {
        // handle Paypal
        if (data.createOrder.paypalApproveUrl) {
          getCheckoutData({
            url: data.createOrder.paypalApproveUrl,
            orderId: data.createOrder.orderId,
          })
        }

        // handle COD
        if (data.createOrder.transactionId) {
          router.replace(
            `/payment/${data.createOrder.transactionId}?method=COD`,
          )
        }
      }
    },
    { onFinally: () => clearCart() },
  )

  return (
    <div className='from-beige-50 to-primary-500/2 rounded-4 shadow-container border-primary-500/10 relative mt-11 flex size-full max-w-[35%] flex-col items-start gap-6 overflow-hidden border bg-linear-to-b p-2 md:mt-13 md:gap-10 md:p-4'>
      <h2 className='text-23 text-tint-600 font-bold'>Payment Info.</h2>

      <div className='flex w-full flex-col items-start gap-4'>
        {/* customer info */}
        <SelectDropdown
          openDropdown={openInfoForm && listCartItem.length > 0}
          defaultValue={
            <div
              onClick={() => setOpenInfoForm(!openInfoForm)}
              className='center w-full cursor-pointer justify-between'
            >
              <h4 className='text-18 font-small-caps text-cherry-800 font-bold'>
                Customer Info
              </h4>
              {isValidForm ? (
                <CheckCircleIcon
                  weight='fill'
                  size={20}
                  className='text-green-600'
                />
              ) : (
                <XCircleIcon
                  weight='fill'
                  size={20}
                  className='text-secondary-500'
                />
              )}
            </div>
          }
          selectButtonClassName='p-2 md:px-4'
          disabled={listCartItem.length === 0}
        >
          <form className='flex size-full flex-col gap-4 p-2 md:p-4'>
            {/* email */}
            <TextInput
              label='Email'
              errorMessage={errors.email}
              isRequired
              value={userInfo.email}
              disabled
              placeholder='Email....'
              className='mb-2'
            />

            <div className='center my-2 w-full gap-2'>
              {/* name */}
              <TextInput
                label='Name'
                errorMessage={errors.name}
                isRequired
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 8,
                    message: 'Name must be at least 8 characters',
                  },
                  maxLength: {
                    value: 25,
                    message: 'Name must be under 25 characters',
                  },
                })}
                placeholder='Name....'
              />

              {/* phone number */}
              <TextInput
                label='Phone number'
                errorMessage={errors.phoneNumber}
                isRequired
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{8,15}$/,
                    message: 'Phone number is invalid',
                  },
                  minLength: {
                    value: 8,
                    message: 'Phone must be at least 8 digits',
                  },
                  maxLength: {
                    value: 15,
                    message: 'Phone must be under 15 digits',
                  },
                })}
                placeholder='Phone number....'
              />
            </div>

            {/* address */}
            <TextInput
              label='Address'
              errorMessage={errors.address}
              isRequired
              {...register('address', {
                required: 'Address is required',
                minLength: {
                  value: 8,
                  message: 'Address must be at least 8 characters',
                },
              })}
              placeholder='Address....'
              className='mt-2'
            />

            <button
              type='button'
              className='center font-small-caps text-dark-600 hover:text-primary-500 ml-auto w-fit cursor-pointer gap-2 font-semibold duration-200 hover:translate-x-2 disabled:cursor-not-allowed disabled:opacity-30'
              onClick={() => setOpenInfoForm(false)}
              disabled={
                Object.values(errors).some((err) => !!err) || !isValidForm
              }
            >
              <p className='text-18! mb-0.5'>Next</p>
              <ArrowRightIcon size={16} />
            </button>
          </form>
        </SelectDropdown>

        {/* payment method */}
        <SelectDropdown
          openDropdown={isValidForm && !openInfoForm}
          defaultValue='Payment Method.'
          valueClassName='text-18! font-small-caps text-cherry-800 font-bold'
          selectButtonClassName='p-2 md:px-4'
          disabled={!isValidForm}
        >
          <div className='flex flex-col gap-4 p-2 md:p-4'>
            {listPaymentMethod.map((method) => (
              <Tooltip
                key={method}
                position='top'
                offset={0}
                className={cn(
                  method !== EPaymentMethod.Crypto && 'hidden',
                  'shadow-container',
                )}
                content={
                  <p className='text-14 font-semibold text-white'>
                    Coming soon!
                  </p>
                }
              >
                <button
                  className={cn(
                    'text-16 text-dark-600/50 hover:text-dark-600/70 group flex cursor-pointer items-center gap-4 font-bold duration-300',
                    paymentMethod && paymentMethod !== method && 'opacity-50',
                    method === EPaymentMethod.Crypto && 'cursor-not-allowed',
                  )}
                  onClick={() => setPaymentMethod(method)}
                  disabled={method === EPaymentMethod.Crypto}
                >
                  <Checkbox
                    type='radio'
                    checked={paymentMethod === method}
                    className={cn(
                      'group-hover:border-primary-500',
                      paymentMethod === EPaymentMethod.Cod
                        ? 'checked:border-green-600 checked:group-hover:border-green-600 checked:hover:border-green-600'
                        : 'checked:border-[#022475] checked:group-hover:border-[#022475] checked:hover:border-[#022475]',
                    )}
                    onChange={() => setPaymentMethod(method)}
                    labelClassName={cn(
                      paymentMethod && paymentMethod !== method && 'opacity-30',
                    )}
                    checkedRadioClassName={
                      paymentMethod === EPaymentMethod.Cod
                        ? 'bg-green-600'
                        : 'bg-[#022475]'
                    }
                  />
                  {method === EPaymentMethod.Cod && (
                    <div className='center gap-2'>
                      <MoneyWavyIcon
                        weight='fill'
                        size={24}
                        className='text-green-600'
                      />
                      <p
                        className={cn(
                          paymentMethod === method &&
                            'text-green-600 hover:text-green-600',
                        )}
                      >
                        Pay on Delivery
                      </p>
                    </div>
                  )}
                  {method === EPaymentMethod.Crypto && (
                    <div className='center gap-2 opacity-50'>
                      Cryptocurrency
                    </div>
                  )}
                  {method === EPaymentMethod.Paypal && (
                    <div className='center gap-2'>
                      <PaypalLogoIcon
                        weight='fill'
                        size={24}
                        className='text-[#022475]'
                      />
                      <p
                        className={cn(
                          paymentMethod === method &&
                            'text-[#022475] hover:text-[#022475]',
                        )}
                      >
                        Paypal
                      </p>
                    </div>
                  )}
                </button>
              </Tooltip>
            ))}
          </div>
        </SelectDropdown>
      </div>

      <Button
        className='rounded-3 w-full bg-green-500 px-6 py-3 font-bold uppercase'
        disableAnimation
        disabled={!isValidForm || !paymentMethod}
        onClick={handleCheckout}
      >
        Check Out {getTotalCartPrice().toFixed(2)}$
      </Button>
    </div>
  )
}
