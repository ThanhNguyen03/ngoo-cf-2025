'use client'

import { ApolloLink, HttpLink } from '@apollo/client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { SetContextLink } from '@apollo/client/link/context'
import { Session } from 'next-auth'
import { getSession, SessionProvider } from 'next-auth/react'

const makeClient = () => {
  const httpLink = new HttpLink({
    uri: `${process.env.NGOO_BACKEND_API}/graphql`,
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

export function ApolloProvider({
  children,
  session,
}: { session?: Session | null } & React.PropsWithChildren) {
  return (
    <SessionProvider session={session}>
      <ApolloNextAppProvider makeClient={makeClient}>
        {children}
      </ApolloNextAppProvider>
    </SessionProvider>
  )
}
