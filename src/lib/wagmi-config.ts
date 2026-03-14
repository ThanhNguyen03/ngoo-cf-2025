import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { bscTestnet, mainnet, monadTestnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet, monadTestnet, bscTestnet],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(),
    [monadTestnet.id]: http(),
    [bscTestnet.id]: http(),
  },
})
