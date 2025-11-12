import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { mainnet, monadTestnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, monadTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [monadTestnet.id]: http(),
  },
})
