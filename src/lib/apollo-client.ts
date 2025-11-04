import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  InMemoryCache,
  registerApolloClient,
} from '@apollo/client-integration-nextjs'
import { SetContextLink } from '@apollo/client/link/context'
import { getServerSession } from 'next-auth'
import authOptions from './auth-option'

const httpLink = new HttpLink({
  uri: process.env.NGOO_BACKEND_API,
  fetchOptions: { cache: 'force-cache' },
})

const authLink = new SetContextLink(async ({ headers }) => {
  const session = await getServerSession(authOptions)

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

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]), // authLink must come before httpLink
  })
})

export const client = getClient()
