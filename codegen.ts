import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: process.env.NEXT_PUBLIC_NGOO_BACKEND_API,
  documents: ['src/lib/graphql/**/*.graphql'],
  generates: {
    'src/lib/graphql/generated/': {
      preset: 'client',
      config: {
        scalars: {
          Object: '{[key: string]: unknown}',
          Timestamp: 'number',
        },
      },
    },
  },
}

export default config
