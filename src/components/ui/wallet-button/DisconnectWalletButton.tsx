import { SignOutIcon } from '@phosphor-icons/react'
import { useDisconnect } from 'wagmi'

export const DisconnectWalletButton = () => {
  const { disconnect } = useDisconnect()

  return (
    <button
      className='rounded-3 text-zk-yellow-300/70 flex h-12 w-full cursor-pointer items-center justify-center gap-2 bg-yellow-500/30 px-4 py-2 font-semibold'
      onClick={() => disconnect()}
    >
      <SignOutIcon size={20} />
      Disconnect
    </button>
  )
}
