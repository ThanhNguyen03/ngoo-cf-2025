import { SwitchButton, toast } from '@/components/ui'
import { TextInput } from '@/components/ui/TextInput'
import { useForm } from '@/hooks/use-form'
import { client } from '@/lib/apollo-client'
import {
  TUserInfoResponse,
  UserUpdateInfoDocument,
} from '@/lib/graphql/generated/graphql'
import { apolloWrapper } from '@/utils'
import { type FC } from 'react'

type TInfoFormProps = {
  userInfo: TUserInfoResponse
  onUpdateSuccess?: () => Promise<void>
}
export const InfoForm: FC<TInfoFormProps> = ({ userInfo, onUpdateSuccess }) => {
  const {
    register,
    formState: { errors, values },
    reset,
  } = useForm<TUserInfoResponse>({
    defaultValues: {
      email: userInfo.email,
      name: userInfo.name ?? '',
      phoneNumber: userInfo.phoneNumber ?? '',
      address: userInfo.address ?? '',
    },
    mode: 'onChange',
  })

  const isValuesChanged = Object.keys(values).some((key) => {
    return (
      !!values[key as keyof TUserInfoResponse] &&
      values[key as keyof TUserInfoResponse] !==
        userInfo[key as keyof TUserInfoResponse]
    )
  })

  const handleSubmit = apolloWrapper(
    async () => {
      toast.info('Updating user info', { progressBar: true, id: 'update' })
      const { data, error } = await client.mutate({
        mutation: UserUpdateInfoDocument,
        variables: {
          userInfo: {
            name: values.name,
            phoneNumber: values.phoneNumber,
            address: values.address,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data) {
        toast.success('Update successfully!', { id: 'update' })
        if (onUpdateSuccess) {
          await onUpdateSuccess()
        }
      }
    },
    {
      onFinally: () => {
        toast.close('update')
        reset()
      },
    },
  )

  return (
    <div className='rounded-2 border-dark-600/10 flex w-full flex-col overflow-hidden border bg-white'>
      <div className='to-beige-100 via-beige-50 text-16 border-dark-600/10 text-dark-600 from-beige-50 border-b bg-gradient-to-r px-3 py-2 font-semibold'>
        Profile information
      </div>
      <div className='flex w-full flex-col gap-8 px-3 py-6'>
        {userInfo.email && (
          <TextInput
            disabled
            label='Email'
            value={userInfo.email}
            inputClassName='opacity-70'
          />
        )}
        {userInfo.walletAddress && (
          <TextInput
            disabled
            label='EVM Wallet'
            value={userInfo.walletAddress}
            inputClassName='opacity-70'
          />
        )}
        <div className='center w-full gap-4'>
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
          />
          <TextInput
            label='Phone Number'
            errorMessage={errors.phoneNumber}
            {...register('phoneNumber', {
              required: 'Phone number is required',
              minLength: {
                value: 8,
                message: 'Phone must be at least 8 digits',
              },
              maxLength: {
                value: 15,
                message: 'Phone must be under 15 digits',
              },
              pattern: {
                value: /^[0-9]/,
                message: 'Phone number is invalid',
              },
            })}
          />
        </div>
        <TextInput
          label='Address'
          errorMessage={errors.address}
          {...register('address', {
            required: 'Address is required',
            minLength: {
              value: 8,
              message: 'Address must be at least 8 characters',
            },
          })}
        />
        <SwitchButton
          type='submit'
          disabled={
            Object.values(errors).some((value) => !!value) || !isValuesChanged
          }
          onClick={handleSubmit}
          className='text-14 rounded-3! ml-auto h-10 min-h-10 w-fit leading-[160%] font-semibold text-white'
        >
          Update Profile
        </SwitchButton>
      </div>
    </div>
  )
}
