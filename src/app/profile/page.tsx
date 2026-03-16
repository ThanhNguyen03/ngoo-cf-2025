'use client'

import { Footer } from '@/components/layout/footer'
import { SkeletonLoader } from '@/components/ui'
import { ConfirmModal } from '@/components/ui/modal'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import { useApolloClient } from '@apollo/client/react'
import {
  ClockUserIcon,
  SignOutIcon,
  UserIcon,
} from '@phosphor-icons/react/dist/ssr'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AuthMethodsSection } from './_components/auth-methods-section'
import { HistoryTable } from './_components/history-table'
import { InfoForm } from './_components/info-form'
import { WalletSection } from './_components/wallet-section'

const BILLING_TABS = [
  {
    key: 'profile',
    label: (
      <div className='flex items-center gap-1.5'>
        <UserIcon />
        <p className='text-14 leading-[160%]'>Profile</p>
      </div>
    ),
  },
  {
    key: 'activity',
    label: (
      <div className='flex items-center gap-1.5'>
        <ClockUserIcon />
        <p className='text-14 leading-[160%]'>Activities</p>
      </div>
    ),
  },
]

const ProfilePage = () => {
  const apolloClient = useApolloClient()
  const router = useRouter()
  const userInfo = useAuthStore((state) => state.userInfo!)
  const getUserInfo = useAuthStore((state) => state.getUserInfo)
  const logout = useAuthStore((state) => state.logout)
  const logoutAll = useAuthStore((state) => state.logoutAll)
  const loading = useAuthStore((state) => state.loading)

  const tabId = useSearchParams().get('tab') || BILLING_TABS[0].key
  const [activeKey, setActiveKey] = useState<string>(tabId)
  const [showLogoutAllModal, setShowLogoutAllModal] = useState(false)

  useEffect(() => {
    if (tabId && tabId !== activeKey) {
      setActiveKey(tabId)
    }
  }, [tabId, activeKey])

  const handleChangeTab = (key: string) => {
    if (key === activeKey) {
      return
    }
    setActiveKey(key)
    router.replace(`/profile/?tab=${key}`)
  }

  const handleRefreshUserInfo = () => getUserInfo(true, apolloClient)

  return (
    <>
      <main className='relative size-full overflow-x-hidden bg-white'>
        <section className='mx-auto flex size-full min-h-[calc(100dvh-380px)] max-w-[1200px] items-start gap-6 py-10 md:gap-10 md:px-4 md:py-20 lg:px-8'>
          {/* Tab bar */}
          <div className='flex size-full max-w-[320px] flex-col justify-between gap-10'>
            <div className='relative flex h-full flex-col gap-4'>
              {BILLING_TABS.map(({ key, label }) => (
                <label
                  key={key}
                  className={cn(
                    'text-dark-600 rounded-2 item-center flex cursor-pointer justify-start gap-[6px] border border-transparent px-[6px] py-1 text-center font-medium text-nowrap transition-all duration-200',
                    'hover:border-dark-600/10 hover:shadow-container hover:from-strawberry-500/10 hover:to-beige-50 hover:via-beige-50 hover:bg-linear-to-br',
                    key === activeKey &&
                      'border-dark-600/10 shadow-container from-strawberry-500/10 to-beige-50 via-beige-50 text-secondary-500 bg-linear-to-br font-bold',
                  )}
                  onClick={() => handleChangeTab(key)}
                >
                  <input
                    type='radio'
                    name='tab'
                    className='peer hidden'
                    value={activeKey}
                    checked={key === activeKey}
                    readOnly
                  />
                  {label}
                </label>
              ))}
            </div>

            <div className='mt-auto flex h-fit flex-col gap-3'>
              <button
                className='text-secondary-500 center text-16 w-fit cursor-pointer gap-3 px-4 font-bold'
                onClick={() => logout()}
              >
                <SignOutIcon size={16} weight='bold' />
                Sign out
              </button>
              <button
                className='text-dark-600/50 text-13 w-fit cursor-pointer px-4 font-medium underline-offset-2 hover:underline'
                onClick={() => setShowLogoutAllModal(true)}
              >
                Sign out from all devices
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
          {activeKey === 'profile' ? (
            <SkeletonLoader loading={loading} className='min-h-[350px]'>
              <div className='flex w-full flex-col gap-6'>
                <InfoForm
                  userInfo={userInfo}
                  onUpdateSuccess={handleRefreshUserInfo}
                />
                <AuthMethodsSection
                  authMethods={userInfo.authMethods}
                  onLinkSuccess={handleRefreshUserInfo}
                />
                <WalletSection
                  walletAddress={userInfo.walletAddress}
                  onConnectSuccess={handleRefreshUserInfo}
                />
              </div>
            </SkeletonLoader>
          ) : (
            <HistoryTable />
          )}
        </section>
      </main>
      <Footer />

      <ConfirmModal
        isOpen={showLogoutAllModal}
        onClose={() => setShowLogoutAllModal(false)}
        message='You will be signed out from all devices.'
        onConfirm={() => logoutAll(apolloClient)}
      />
    </>
  )
}

export default ProfilePage
