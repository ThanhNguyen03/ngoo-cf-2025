import { z } from 'zod'

export const validateEnv = () => {
  const envSchema = z.object({
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXTAUTH_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXT_PUBLIC_NGOO_BACKEND_API: z.string().url(),
  })

  const parsedEnv = envSchema.safeParse(process.env)

  if (!parsedEnv.success) {
    const errors = parsedEnv.error.errors
      .map((err) => `${err.path[0]}: ${err.message}`)
      .join(', ')
    throw new Error(`Environment variable validation failed: ${errors}`)
  }
}
