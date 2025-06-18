import { getWagmiConfig } from '@/lib/wagmi-config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren, useState } from 'react'
import { type State, WagmiProvider } from 'wagmi'

type TWalletConnectProviderProps = PropsWithChildren & {
  initialState?: State
}

export const WalletConnectProvider = ({
  children,
  initialState,
}: TWalletConnectProviderProps) => {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={getWagmiConfig()} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
