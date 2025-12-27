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
    fetchOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  }
})

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([authLink, httpLink]), // authLink must come before httpLink
})
