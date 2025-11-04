'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { SetContextLink } from '@apollo/client/link/context'
import { getSession } from 'next-auth/react'

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: process.env.NGOO_BACKEND_API,
  })

  const authLink = new SetContextLink(async ({ headers }) => {
    const session = await getSession()

    return {
      headers: {
        ...headers,
        authorization: session ? `Bearer ${session.accessToken}` : '',
      },
    }
  })

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([authLink, httpLink]),
  })
}

export function ApolloProvider({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  )
}
