import { client } from '@/lib/apollo-client'
import { handleError } from '@/utils'
import { signIn, signOut } from 'next-auth/react'
import { create } from 'zustand'
import {
  EAuthMethod,
  MutationUserLoginArgs,
  TUserInfo,
  UserInfoDocument,
} from './../lib/graphql/generated/graphql'

type TAuthState = {
  userInfo: TUserInfo | null
  loading: boolean
  error: unknown | null
}

type TAuthAction = {
  getUserInfo: () => Promise<void>
  login: (method: EAuthMethod, data: MutationUserLoginArgs) => Promise<void>
  logout: () => Promise<void>
}

const useAuthStore = create<TAuthState & TAuthAction>()((set, get) => ({
  userInfo: null,
  loading: false,
  error: null,

  getUserInfo: async () => {
    if (get().userInfo) {
      return
    }
    const refresh = async () => {
      try {
        set({ loading: true })
        await signIn('credentials', {
          redirect: false,
          isRefresh: true,
        })

        const { data, error } = await client.query({
          query: UserInfoDocument,
        })
        if (error) {
          throw new Error(error.message)
        }
        set({ userInfo: data?.userInfo })
      } catch (error) {
        set({ userInfo: null, error })
        signOut()
      } finally {
        set({ loading: false })
      }
    }

    try {
      set({ loading: true })
      const { data, error } = await client.query({
        query: UserInfoDocument,
        fetchPolicy: 'network-only',
      })

      if (error) {
        if (error.message.includes('Missing access token')) {
          await refresh()
        } else {
          set({ userInfo: null, error: error.message })
        }
        throw error
      }

      if (data) {
        set({ userInfo: data.userInfo, error: null })
      }
    } catch (err) {
      handleError(err, 'Failed to sign in!')
    } finally {
      set({ loading: false })
    }
  },

  login: async (method: EAuthMethod, data: MutationUserLoginArgs) => {
    set({ loading: true })
    if (method === EAuthMethod.Credential) {
      if (!data.email && !data.password) {
        throw new Error('Failed to sign in: Invalid data!')
      }

      await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      })
    } else {
      if (!data.token) {
        throw new Error('Failed to sign in: Invalid data!')
      }

      await signIn('google', {
        redirect: false,
      })
    }
    await get().getUserInfo()
    set({ loading: false })
  },

  logout: async () => {
    set({ userInfo: null })
    await signOut()
  },
}))

export default useAuthStore
