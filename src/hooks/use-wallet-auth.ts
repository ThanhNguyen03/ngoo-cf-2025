'use client'

import { client } from '@/lib/apollo-client'
import {
  CryptoWalletWithNonceDocument,
  UserConnectCryptoWalletDocument,
} from '@/lib/graphql/generated/graphql'
import { createLogger } from '@/lib/logger'
import useAuthStore from '@/store/auth-store'
import { handleError } from '@/utils'
import { useCallback, useState } from 'react'
import { useAccount, useSignMessage } from 'wagmi'

const logger = createLogger('WalletAuth')

type TWalletAuthState = {
  isConnecting: boolean
  isSuccess: boolean
  error: string | null
}

type TWalletAuthReturn = TWalletAuthState & {
  connectWallet: () => Promise<void>
  reset: () => void
}

// Encapsulates the three-step wallet ownership verification flow:
// 1. Fetch a nonce message from the BE (prevents replay attacks)
// 2. Ask the user to sign it with their wallet (proves key ownership)
// 3. Send the signature to the BE for verification → updates walletAddress on user profile
export const useWalletAuth = (): TWalletAuthReturn => {
  const { address } = useAccount()
  const { signMessageAsync } = useSignMessage()
  const getUserInfo = useAuthStore((s) => s.getUserInfo)

  const [state, setState] = useState<TWalletAuthState>({
    isConnecting: false,
    isSuccess: false,
    error: null,
  })

  const connectWallet = useCallback(async () => {
    if (!address) {
      setState((s) => ({ ...s, error: 'No wallet connected' }))
      return
    }

    setState({ isConnecting: true, isSuccess: false, error: null })

    try {
      // Step 1: get nonce message to sign (server-generated, single-use)
      const { data: nonceData, error: nonceError } = await client.query({
        query: CryptoWalletWithNonceDocument,
        fetchPolicy: 'network-only',
      })

      if (nonceError) throw nonceError

      const nonce = nonceData?.cryptoWalletWithNonce
      if (!nonce) throw new Error('Failed to get nonce from server')

      logger.info('Nonce fetched, requesting wallet signature')

      // Step 2: prompt the wallet to sign the nonce message
      const signature = await signMessageAsync({ message: nonce })

      // Step 3: send signature + address to BE for verification
      const verifyResult = await client.mutate({
        mutation: UserConnectCryptoWalletDocument,
        variables: { signature, address },
      })

      if (!verifyResult.data?.userConnectCryptoWallet.connectCompleted) {
        throw new Error('Wallet verification failed')
      }

      logger.info({ address }, 'Wallet verified successfully')

      // Refresh auth store with updated walletAddress from BE
      await getUserInfo(true)

      setState({ isConnecting: false, isSuccess: true, error: null })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Wallet connection failed'
      handleError(err, 'useWalletAuth: connectWallet failed')
      setState({ isConnecting: false, isSuccess: false, error: message })
    }
  }, [address, signMessageAsync, getUserInfo])

  const reset = useCallback(() => {
    setState({ isConnecting: false, isSuccess: false, error: null })
  }, [])

  return { ...state, connectWallet, reset }
}
