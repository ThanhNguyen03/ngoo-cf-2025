'use client'

import { SwitchButton } from '@/components/ui'
import { TextInput } from '@/components/ui/TextInput'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import {
  FediverseLogoIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ProfilePage = () => {
  const router = useRouter()
  const userInfo = useAuthStore((state) => state.userInfo!)

  const BILLING_TABS = [
    {
      key: 'profile',
      label: (
        <div className='flex items-center gap-1.5'>
          <UserIcon />
          <p className='text-14 leading-[160%]'>Profile</p>
        </div>
      ),
      children: (
        <div className='rounded-2 flex w-full flex-col overflow-hidden border border-neutral-900/10 bg-white'>
          <div className='to-paper text-16 border-b border-neutral-900/10 bg-gradient-to-r from-white px-3 py-2 font-semibold text-neutral-900'>
            Profile information
          </div>
          <div className='flex w-full flex-col gap-4 px-3 py-4'>
            {userInfo.walletAddress && (
              <TextInput
                disabled
                label='EVM Wallet'
                value={userInfo.walletAddress}
              />
            )}
            {userInfo.email && (
              <TextInput disabled label='Email' value={userInfo.email} />
            )}
          </div>
        </div>
      ),
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

  const [activeKey, setActiveKey] = useState<string>(BILLING_TABS[0].key)

  const handleChangeTab = (key: string) => {
    if (key === activeKey) {
      return
    }
    setActiveKey(key)
    router.push(`/settings/?tab=${key}`)
  }

  return (
    <main className='relative size-full min-h-[calc(100dvh-60px)] overflow-x-hidden bg-white py-10 md:px-4 md:py-20 lg:px-8'>
      <section className='mx-auto flex size-full h-[480px] max-w-[1200px] items-start gap-6 md:gap-10'>
        {/* Tab bar */}
        <div className='flex size-full max-w-[320px] flex-col justify-between gap-10'>
          <div className='relative mb-auto flex h-full flex-col gap-4'>
            {BILLING_TABS.map(({ key, label, disabled }) => (
              <label
                data-active={key === activeKey}
                key={key}
                className={cn(
                  'text-dark-600 rounded-2 item-center flex cursor-pointer justify-start gap-[6px] border border-transparent px-[6px] py-1 text-center font-medium text-nowrap transition-all duration-200',
                  key === activeKey && 'text-dark-600 font-semibold',
                  'data-[active=true]:border-dark-600/10 data-[active=true]:shadow-container from-secondary-500/10 to-beige-50 data-[active=true]:bg-linear-to-br',
                  'hover:border-dark-600/10 hover:shadow-container from-secondary-500/10 to-beige-50 hover:bg-linear-to-br',
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

          <div className='mt-auto flex h-fit w-60 flex-col gap-3'>
            <SwitchButton variant='pink' className='w-fit gap-3 px-4'>
              <SignOutIcon size={16} />
              Sign out
            </SwitchButton>
            {/* divider */}
            <div className='rounded-2 h-px w-full bg-neutral-900/10' />
            <p className='text-14 leading-[130%] font-medium text-neutral-900/50'>
              Copyright ©2025 <b>thanhf.ng_dev</b>
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
