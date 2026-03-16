import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

// Minimal Apollo Client for server-side use (NextAuth callbacks in auth-option.ts).
// Does NOT include authLink (callers pass their own Authorization header via context)
// or errorLink (browser-only signOut). This avoids importing browser APIs on the server.
export const serverClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_NGOO_BACKEND_API}/graphql`,
  }),
  defaultOptions: {
    mutate: { errorPolicy: 'all' },
    query: { errorPolicy: 'all' },
  },
})
