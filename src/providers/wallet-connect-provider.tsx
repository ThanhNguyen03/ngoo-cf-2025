'use client'

import { Toaster } from '@/components/ui'
import { wagmiConfig } from '@/lib/wagmi-config'
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

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster
        duration={3000}
        offset={50}
        position='bottom-center'
        className='gap-4! p-4!'
        contentClassName='gap-4! font-semibold text-18!'
        closeBtnClassName='static'
        listTypeClass={{
          info: cn(
            'border-zk-support-500 rounded-3 bg-zk-support-100 shadow-zk-support-200 border-2 shadow-[0_8px_24px]',
          ),
          success: cn(
            'border-zk-green-500 rounded-3 bg-zk-green-100 shadow-zk-green-200 border-2 shadow-[0_8px_24px]',
          ),
          error: cn(
            'border-zk-pink-500 rounded-3 bg-zk-pink-100 shadow-zk-pink-200 border-2 shadow-[0_8px_24px]',
          ),
          warning: cn(
            'border-zk-orange-500 shadow-zk-orange-200 rounded-3 bg-zk-orange-100 border-2 shadow-[0_8px_24px]',
          ),
        }}
        listTypeIcon={{
          info: (
            <div className='rounded-2 center bg-zk-support-500 size-9'>
              <InfoIcon weight='fill' color='white' size={20} />
            </div>
          ),
          success: (
            <div className='rounded-2 center bg-zk-green-500 size-9'>
              <ConfettiIcon weight='fill' color='white' size={20} />
            </div>
          ),
          error: (
            <div className='rounded-2 center bg-zk-pink-500 size-9'>
              <XIcon color='white' size={20} />
            </div>
          ),
          warning: (
            <div className='rounded-2 center bg-zk-orange-500 size-9'>
              <WarningIcon weight='fill' color='white' size={20} />
            </div>
          ),
        }}
      />
    </WagmiProvider>
  )
}
