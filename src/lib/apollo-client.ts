import { ApolloLink, HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { getSession, signOut } from 'next-auth/react'
import { createLogger } from './logger'

const logger = createLogger('ApolloClient')

// --- Shared building blocks (used by both the standalone client and the provider) ---

export const createHttpLink = () =>
  new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_NGOO_BACKEND_API}/graphql`,
  })

export const authLink = new SetContextLink(async ({ headers }) => {
  const session = await getSession()

  return {
    headers: {
      authorization: session ? `Bearer ${session.accessToken}` : '',
      ...headers,
    },
  }
})

// Auto sign-out on UNAUTHENTICATED GraphQL errors or network-level auth failures
export const errorLink = new ErrorLink(({ error }) => {
  let isUnauthenticated = false

  if (CombinedGraphQLErrors.is(error)) {
    isUnauthenticated = error.errors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED',
    )
  } else if (
    error instanceof Error &&
    'statusCode' in error &&
    (error as Error & { statusCode: number }).statusCode === 401
  ) {
    isUnauthenticated = true
  }

  if (isUnauthenticated) {
    logger.error('Session expired — signing out')
    signOut({ callbackUrl: '/' })
  }
})

export const createLinkChain = () =>
  ApolloLink.from([authLink, errorLink, createHttpLink()])

// --- Standalone client (for direct client.query / client.mutate calls) ---
export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: createLinkChain(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  },
})
