import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    accessTokenExpires?: number
    uuid?: string
    error?: string
  }
  interface User {
    accessToken?: string
    refreshToken?: string
    uuid?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    uuid?: string
    accessTokenExpires?: number
    error?: string
  }
}
