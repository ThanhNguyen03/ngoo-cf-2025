declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_APP_URL: string
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    NGOO_BACKEND_API: string
    NEXT_PUBLIC_NGOO_CONTRACT_ADDRESS: string
    NEXT_PUBLIC_NGOO_CHAIN_ID: string
  }
}
