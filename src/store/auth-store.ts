import { client } from '@/lib/apollo-client'
import { handleError } from '@/utils'
import { signIn, signOut } from 'next-auth/react'
import { create } from 'zustand'
import {
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
  login: (data: MutationUserLoginArgs, isRegister?: boolean) => Promise<void>
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

    try {
      set({ loading: true })
      const { data, error } = await client.query({
        query: UserInfoDocument,
        fetchPolicy: 'network-only',
      })

      if (error) {
        set({ userInfo: null, error: error.message })
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

  login: async (data: MutationUserLoginArgs, isRegister?: boolean) => {
    set({ loading: true })
    if (!data.email && !data.password) {
      throw new Error('Failed to sign in: Invalid data!')
    }

    await signIn('credentials', {
      redirect: false,
      isRegister,
      email: data.email,
      password: data.password,
    })

    set({ loading: false })
  },

  logout: async () => {
    set({ userInfo: null })
    await signOut()
  },
}))

export default useAuthStore
