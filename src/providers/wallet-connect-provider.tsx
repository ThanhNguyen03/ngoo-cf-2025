'use client'

import Loading from '@/app/loading'
import { ShoppingCart } from '@/components/layout/shopping-cart'
import { Toaster } from '@/components/ui'
import { useIsHydrated } from '@/hooks'
import { useAutoRefresh } from '@/hooks/use-auto-refresh'
import { wagmiConfig } from '@/lib/wagmi-config'
import useAuthStore from '@/store/auth-store'
import { cn } from '@/utils'
import {
  ConfettiIcon,
  InfoIcon,
  WarningIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
import { WagmiProvider } from 'wagmi'

export const WalletConnectProvider = ({ children }: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient())
  const [config] = useState(() => wagmiConfig)
  const { loading } = useAuthStore()
  const isHydrated = useIsHydrated()

  useAutoRefresh()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {!isHydrated ? (
          <Loading />
        ) : loading ? (
          <Loading className='from-primary-50/30 to-secondary-50/30 text-beige-50 backdrop-blur-md' />
        ) : (
          children
        )}
      </QueryClientProvider>
      <ShoppingCart />
      <Toaster
        duration={3000}
        offset={50}
        position='bottom-center'
        className='gap-4! p-4!'
        contentClassName='gap-4! font-semibold text-18!'
        closeBtnClassName='static'
        listTypeClass={{
          info: cn(
            'rounded-3 border-2 border-blue-500 bg-blue-100 shadow-[0_8px_24px] shadow-blue-200',
          ),
          success: cn(
            'rounded-3 border-2 border-green-500 bg-green-100 shadow-[0_8px_24px] shadow-green-200',
          ),
          error: cn(
            'rounded-3 border-2 border-pink-500 bg-pink-100 shadow-[0_8px_24px] shadow-pink-200',
          ),
          warning: cn(
            'rounded-3 border-2 border-orange-500 bg-orange-100 shadow-[0_8px_24px] shadow-orange-200',
          ),
        }}
        listTypeIcon={{
          info: (
            <div className='rounded-2 center bg-zk-support-500 size-9'>
              <InfoIcon weight='fill' className='text-blue-500' size={20} />
            </div>
          ),
          success: (
            <div className='rounded-2 center bg-zk-green-500 size-9'>
              <ConfettiIcon
                weight='fill'
                className='text-green-500'
                size={20}
              />
            </div>
          ),
          error: (
            <div className='rounded-2 center bg-zk-pink-500 size-9'>
              <XIcon className='text-pink-500' size={20} />
            </div>
          ),
          warning: (
            <div className='rounded-2 center bg-zk-orange-500 size-9'>
              <WarningIcon
                weight='fill'
                className='text-orange-500'
                size={20}
              />
            </div>
          ),
        }}
      />
    </WagmiProvider>
  )
}
