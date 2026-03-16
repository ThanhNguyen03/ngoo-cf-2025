'use client'

import { createLinkChain } from '@/lib/apollo-client'
import {
  ApolloClient,
  ApolloNextAppProvider,
  InMemoryCache,
} from '@apollo/client-integration-nextjs'
import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

const makeClient = () => {
  return new ApolloClient({
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
