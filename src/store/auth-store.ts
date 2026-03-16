import { createLogger } from '@/lib/logger'
import { handleError } from '@/utils'
import type { ApolloClient } from '@apollo/client'
import { signIn, signOut } from 'next-auth/react'
import { create } from 'zustand'
import {
  MutationUserLoginArgs,
  TUserInfoResponse,
  UserInfoDocument,
  UserLogoutDocument,
} from './../lib/graphql/generated/graphql'

const logger = createLogger('AuthStore')

type TAuthState = {
  userInfo: TUserInfoResponse | null
  loading: boolean
  error: unknown | null
}

type TAuthAction = {
  getUserInfo: (refetch?: boolean, apolloClient?: ApolloClient) => Promise<void>
  login: (data: MutationUserLoginArgs, isRegister?: boolean) => Promise<void>
  logout: () => Promise<void>
  logoutAll: (apolloClient: ApolloClient) => Promise<void>
}

const useAuthStore = create<TAuthState & TAuthAction>()((set, get) => ({
  userInfo: null,
  loading: false,
  error: null,

  getUserInfo: async (refetch, apolloClient) => {
    if (!apolloClient) return
    if (get().userInfo && !refetch) {
      return
    }

    try {
      set({ loading: true })
      const { data, error } = await apolloClient.query({
        query: UserInfoDocument,
        fetchPolicy: 'network-only',
      })

      if (error) {
        set({ userInfo: null, error: error.message })
        throw error
      }

      if (data) {
        set({ userInfo: data.userInfo, error: null })
        logger.debug('User info fetched')
      }
    } catch (err) {
      if (err instanceof Error && err.message === 'Missing access token') {
        await get().logout()
      }
      handleError(err, 'Failed to get user info!')
    } finally {
      set({ loading: false })
    }
  },

  login: async (data: MutationUserLoginArgs, isRegister?: boolean) => {
    // Validate that both fields are present before attempting sign-in
    if (!data.email || !data.password) {
      throw new Error('Failed to sign in: Email and password are required!')
    }

    set({ loading: true })
    try {
      await signIn('credentials', {
        isRegister,
        email: data.email,
        password: data.password,
      })
    } catch (err) {
      handleError(err, 'Failed to sign in!')
    } finally {
      // Always reset loading, even if signIn throws
      set({ loading: false })
    }
  },

  logout: async () => {
    set({ userInfo: null })
    logger.info('User logged out')
    await signOut()
    localStorage.removeItem('cart-storage')
  },

  logoutAll: async (apolloClient) => {
    try {
      await apolloClient.mutate({
        mutation: UserLogoutDocument,
        variables: { logoutEverywhere: true },
      })
    } catch (err) {
      logger.warn({ err }, 'logoutAll mutation failed — proceeding with local logout')
    }
    await get().logout()
  },
}))

export default useAuthStore
