import { ApolloLink, HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs'
import { SetContextLink } from '@apollo/client/link/context'
import { ErrorLink } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { signOut, getSession } from 'next-auth/react'
import { createLogger } from './logger'

const logger = createLogger('ApolloClient')

const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_NGOO_BACKEND_API}/graphql`,
  // force-cache removed: conflicts with defaultOptions fetchPolicy 'no-cache'
})

const authLink = new SetContextLink(async ({ headers }) => {
  const session = await getSession()

  return {
    headers: {
      authorization: session ? `Bearer ${session.accessToken}` : '',
      ...headers,
    },
  }
})

// Auto sign-out on UNAUTHENTICATED GraphQL errors or network-level auth failures
const errorLink = new ErrorLink(({ error }) => {
  let isUnauthenticated = false

  if (CombinedGraphQLErrors.is(error)) {
    isUnauthenticated = error.errors.some(
      (err) => err.extensions?.code === 'UNAUTHENTICATED',
    )
  } else if ('statusCode' in error && (error as { statusCode: number }).statusCode === 401) {
    isUnauthenticated = true
  }

  if (isUnauthenticated) {
    logger.error('Session expired — signing out')
    signOut({ callbackUrl: '/' })
  }
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  // Chain: auth headers → error handling → HTTP request
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  // Set default options so all queries surface errors rather than swallowing them
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
