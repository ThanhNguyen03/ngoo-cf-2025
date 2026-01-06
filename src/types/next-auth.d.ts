import { ERole } from '@/lib/graphql/generated/graphql'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken?: string
    accessTokenExpires?: number
    uuid?: string
    error?: string
    user: {
      role: ERole
    }
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
    role?: ERole
  }
}
