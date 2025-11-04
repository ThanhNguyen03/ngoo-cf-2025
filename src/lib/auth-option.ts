import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || '',
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',

      // async authorize(credentials) {
      //   try {
      //     if (!projectKey) {
      //       throw new Error('Missing project key')
      //     }
      //     if (!credentials) {
      //       return null
      //     }
      //     // refresh and update accessToken
      //     if (credentials.isRefreshToken) {
      //       const session = await getServerSession(authOptions)
      //       if (!session?.uuid) {
      //         throw new Error('Missing session uuid')
      //       }
      //       if (!session?.accessToken || !session?.refreshToken) {
      //         throw new Error('Missing accessToken or refreshToken')
      //       }
      //       const { data: refreshTokenData, error: refreshTokenError } =
      //         await mutateUserRefreshToken({
      //           accessToken: session?.accessToken,
      //           refreshToken: session?.refreshToken,
      //         })
      //       if (refreshTokenError) {
      //         throw new Error(refreshTokenError.message)
      //       }
      //       return {
      //         id: session.uuid,
      //         accessToken: refreshTokenData.accessToken,
      //         refreshToken: session.refreshToken,
      //         uuid: session.uuid,
      //       } satisfies User
      //     }
      //     const { data, error } = await mutateUserVerifyAuthCode({
      //       authCode: credentials.authCode,
      //       projectKey,
      //     })
      //     if (error) {
      //       throw new Error(error.message)
      //     }
      //     return {
      //       id: `${pageName}-${data.userUuid}`,
      //       accessToken: data.accessToken,
      //       refreshToken: data.refreshToken,
      //       uuid: `${pageName}-${data.userUuid}`,
      //     } satisfies User
      //   } catch (error) {
      //     logger.error(`Error from verify auth code in next-auth`, error)
      //     return null
      //   }
      // },
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
