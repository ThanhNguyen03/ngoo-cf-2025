import { getServerSession, NextAuthOptions, User } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || '',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),

    Credentials({
      credentials: {
        email: { type: 'text' },
        password: { type: 'text' },
        isRefresh: { type: 'boolean' },
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null
          }
          // refresh and update accessToken
          if (credentials.isRefresh) {
            const session = await getServerSession(authOptions)
            if (!session?.uuid) {
              throw new Error('Missing session uuid')
            }
            if (!session?.accessToken || !session?.refreshToken) {
              throw new Error('Missing accessToken or refreshToken')
            }

            // TODO: call refresh token api here to get new access token
          }
          // TODO: call verify auth code api here to get user info
          return {
            id: 'session.uuid',
            accessToken: 'refreshTokenData.accessToken',
            refreshToken: 'session.refreshToken',
            uuid: 'session.uuid',
          } satisfies User
        } catch (error) {
          console.error(`Error from verify auth code in next-auth`, error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.uuid = user.uuid
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      session.uuid = token.uuid
      return session
    },
  },
  // TODO: implement sign out api
  // events: {
  //   async signOut({ session, token }) {
  //     if (token.refreshToken) {
  //       try {
  //         const { error } = await mutateUserSignOut({
  //           // TODO: will remove hard code when have design about logout button
  //           logoutEverywhere: false,
  //           refreshToken: token.refreshToken,
  //         })
  //         if (error) {
  //           throw new Error(error.message)
  //         }
  //       } catch (error) {
  //         logger.error('Error while logout user', error)
  //       }
  //     }
  //   },
  // },
  // TODO: Design auth error page
  // pages: {
  //   // redirect to error page if hit error when signin
  //   error: '/api/auth/error',
  // },
}

export default authOptions
