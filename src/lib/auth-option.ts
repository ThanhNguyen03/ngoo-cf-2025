import { handleError } from '@/utils'
import { ErrorLike } from '@apollo/client'
import { NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { client } from './apollo-client'
import {
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
          if (credentials.isRegister === 'true') {
            const { data, error } = await client.mutate({
              mutation: UserRegisterDocument,
              variables,
            })
            result = { data: data?.userRegister, error }
          } else {
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
        } catch (error) {
          handleError(error, 'Failed to sign up')
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 15, // 15 minutes
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
          }
          return token
        } catch (error) {
          handleError(error, 'Failed to sign up')
        }
      } else if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.uuid = user.uuid
      }

      // TODO: handle refresh
      return token
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.uuid = token.uuid
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
