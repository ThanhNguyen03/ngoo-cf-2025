import { ApolloLink, HttpLink } from '@apollo/client'
import { ApolloClient, InMemoryCache } from '@apollo/client-integration-nextjs'
import { SetContextLink } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'

const httpLink = new HttpLink({
  uri: `${process.env.NGOO_BACKEND_API}/graphql`,
  fetchOptions: { cache: 'force-cache' },
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

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authLink, httpLink]), // authLink must come before httpLink
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
