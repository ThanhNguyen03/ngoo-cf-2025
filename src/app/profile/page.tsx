'use client'

import { SwitchButton } from '@/components/ui'
import { TextInput } from '@/components/ui/TextInput'
import { useForm } from '@/hooks/use-form'
import { TUserInfoResponse } from '@/lib/graphql/generated/graphql'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import {
  FediverseLogoIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useState } from 'react'

const ProfileInfoForm = () => {
  const userInfo = useAuthStore((state) => state.userInfo!)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, values },
  } = useForm<TUserInfoResponse>({
    defaultValues: {
      email: userInfo.email,
      name: userInfo?.name || '',
      phoneNumber: userInfo?.phoneNumber || '',
      address: userInfo?.address || '',
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
            {...register(
              'phoneNumber',
              userInfo.phoneNumber || values.phoneNumber
                ? {
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
                  }
                : undefined,
            )}
          />
        </div>
        <TextInput
          label='Address'
          errorMessage={errors.address}
          {...register(
            'address',
            userInfo.address
              ? {
                  required: 'Address is required',
                  minLength: {
                    value: 8,
                    message: 'Address must be at least 8 characters',
                  },
                }
              : undefined,
          )}
        />
        <SwitchButton
          disabled={!errors || !isValuesChanged}
          className='text-14 rounded-3! ml-auto h-10 min-h-10 w-fit leading-[160%] font-semibold text-white'
        >
          Update Profile
        </SwitchButton>
      </div>
    </div>
  )
}

const BILLING_TABS = [
  {
    key: 'profile',
    label: (
      <div className='flex items-center gap-1.5'>
        <UserIcon />
        <p className='text-14 leading-[160%]'>Profile</p>
      </div>
    ),
    children: <ProfileInfoForm />,
  },
  {
    key: 'connections',
    label: (
      <div className='flex items-center gap-1.5'>
        <FediverseLogoIcon />
        <p className='text-14 leading-[160%]'>Connections</p>
      </div>
    ),
    children: <></>,
    disabled: true,
  },
]

const ProfilePage = () => {
  const [activeKey, setActiveKey] = useState<string>(BILLING_TABS[0].key)

  const handleChangeTab = (key: string) => {
    if (key === activeKey) {
      return
    }
    setActiveKey(key)
  }

  return (
    <main className='relative size-full min-h-[calc(100dvh-60px)] overflow-x-hidden bg-white py-10 md:px-4 md:py-20 lg:px-8'>
      <section className='mx-auto flex size-full h-[480px] max-w-[1200px] items-start gap-6 md:gap-10'>
        {/* Tab bar */}
        <div className='flex size-full max-w-[320px] flex-col justify-between gap-10'>
          <div className='relative flex h-full flex-col gap-4'>
            {BILLING_TABS.map(({ key, label, disabled }) => (
              <label
                key={key}
                className={cn(
                  'text-dark-600 rounded-2 item-center flex cursor-pointer justify-start gap-[6px] border border-transparent px-[6px] py-1 text-center font-medium text-nowrap transition-all duration-200',
                  'hover:border-dark-600/10 hover:shadow-container hover:from-strawberry-500/10 hover:to-beige-50 hover:via-beige-50 hover:bg-linear-to-br',
                  key === activeKey &&
                    'border-dark-600/10 shadow-container from-strawberry-500/10 to-beige-50 via-beige-50 bg-linear-to-br font-semibold',
                  disabled && 'cursor-not-allowed opacity-30',
                )}
                onClick={() => !disabled && handleChangeTab(key)}
              >
                <input
                  type='radio'
                  name='tab'
                  className='peer hidden'
                  value={activeKey}
                  checked={key === activeKey}
                  disabled={disabled}
                  readOnly
                />
                {label}
              </label>
            ))}
          </div>

          <div className='mt-auto flex h-fit flex-col gap-3'>
            <button className='text-secondary-500 center text-16 w-fit cursor-pointer gap-3 px-4 font-bold'>
              <SignOutIcon size={16} weight='bold' />
              Sign out
            </button>
            {/* divider */}
            <div className='rounded-2 bg-dark-600/10 h-px w-full' />
            <p className='text-14 text-dark-600/50 leading-[130%] font-medium'>
              Copyright ©2026 by <b>thanhf.ng_dev</b>
            </p>
          </div>
        </div>

        <div className='rounded-2 from-dark-600/10 to-dark-600/2 h-full min-h-80 w-0.75 bg-linear-to-b' />
        {/* Children */}
        {BILLING_TABS.find(({ key }) => key === activeKey)?.children}
      </section>
    </main>
  )
}

export default ProfilePage
