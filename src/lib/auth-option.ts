import { EXPIRES_IN } from '@/constants'
import { handleError } from '@/utils'
import { ErrorLike } from '@apollo/client'
import { NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { client } from './apollo-client'
import {
  RefreshTokenDocument,
  TUserAuth,
  UserLoginDocument,
  UserLogoutDocument,
  UserRegisterDocument,
} from './graphql/generated/graphql'

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || '',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    Credentials({
      credentials: {
        isRegister: { type: 'text' },
        email: { type: 'text' },
        password: { type: 'text' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null
          }

          const variables = {
            email: credentials.email,
            password: credentials.password,
          }
          let result: { data?: TUserAuth; error?: ErrorLike }
          // register flow
          if (credentials.isRegister === 'true') {
            const { data, error } = await client.mutate({
              mutation: UserRegisterDocument,
              variables,
            })
            result = { data: data?.userRegister, error }
          } else {
            // login flow
            const { data, error } = await client.mutate({
              mutation: UserLoginDocument,
              variables,
            })
            result = { data: data?.userLogin, error }
          }
          if (result.error) {
            throw result.error
          }
          if (result.data) {
            return {
              id: result.data.userUuid,
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken,
            } satisfies User
          }

          return null
        } catch {
          throw new Error('Failed to sign up')
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // handle login by google
      if (account?.provider === 'google' && account.id_token) {
        try {
          const { data, error } = await client.mutate({
            mutation: UserLoginDocument,
            variables: { token: account.id_token },
          })
          if (error) {
            throw error
          }
          if (data) {
            token.accessToken = data.userLogin.accessToken
            token.refreshToken = data.userLogin.refreshToken
            token.uuid = data.userLogin.userUuid
            token.accessTokenExpires = Date.now() + EXPIRES_IN
          }
          return token
        } catch (error) {
          console.error(error, 'Failed to sign up')
          return token
        }
      }
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.uuid = user.uuid
        token.accessTokenExpires = Date.now() + EXPIRES_IN

        return token
      }

      if (!token.accessTokenExpires) {
        return token
      }

      // refresh flow
      if (Date.now() >= token.accessTokenExpires - 60 * 1000) {
        try {
          if (!token.refreshToken || !token.accessToken) {
            throw new Error('Failed to refresh token')
          }
          const { data, error } = await client.mutate({
            mutation: RefreshTokenDocument,
            variables: {
              refreshToken: token.refreshToken,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          })
          if (error) {
            throw error
          }
          if (data) {
            token.accessToken = data.refreshToken.accessToken
            token.accessTokenExpires = Date.now() + EXPIRES_IN
            token.refreshToken = data.refreshToken.refreshToken
            token.uuid = data.refreshToken.userUuid
          }
          return token
        } catch (error) {
          console.log(error)
          token.error = 'RefreshAccessTokenError'
          return token
        }
      }

      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.accessTokenExpires = token.accessTokenExpires
      session.uuid = token.uuid
      session.error = token.error

      return session
    },
  },
  // TODO: implement sign out api
  events: {
    async signOut({ token }) {
      if (token.refreshToken && token.accessToken) {
        try {
          const { error } = await client.mutate({
            // TODO: will remove hard code when have design about logout button
            mutation: UserLogoutDocument,
            variables: {
              logoutEverywhere: false,
            },
            context: {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              },
            },
          })
          if (error) {
            throw error
          }
        } catch (error) {
          handleError(error, 'Error while logout user')
        }
      }
    },
  },
  // TODO: Design auth error page
  // pages: {
  //   // redirect to error page if hit error when signin
  //   error: '/api/auth/error',
  // },
}

export default authOptions
