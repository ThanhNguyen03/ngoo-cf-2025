import { client } from '@/lib/apollo-client'
import {
  UserInfoDocument,
  UserInfoQuery,
} from '@/lib/graphql/generated/graphql'
import { handleError } from '@/utils'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export const useLogin = () => {
  const { status } = useSession()
  const [userInfo, setUserInfo] = useState<UserInfoQuery>()

  const handleRefresh = async () => {
    try {
      await signIn('credentials', {
        redirect: false,
        isRefreshToken: true,
      })
      const { data, error } = await client.query({
        query: UserInfoDocument,
      })
      if (error) {
        throw new Error(error.message)
      }
      setUserInfo(data)
    } catch {
      signOut()
    }
  }

  const getUserInfo = async () => {
    try {
      const { data, error } = await client.query({
        query: UserInfoDocument,
      })

      if (error) {
        if (error.message === 'Missing access token') {
          // try to refresh token, logout if fail
          // call refreshToken via signIn to update new accessToken into server side session
          await handleRefresh()
          return
        }
        throw new Error(error.message)
      }
      setUserInfo(data)
    } catch (error) {
      handleError(error, 'Failed to fetch user information')
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      getUserInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  return { userInfo }
}
