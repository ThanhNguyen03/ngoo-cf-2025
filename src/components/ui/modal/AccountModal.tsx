import { type FC, useEffect, useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

import type { TModalProps } from '@/types'
import { formatBalance, truncateAddress } from '@/utils'
import { CopyIcon } from '@phosphor-icons/react'

import { defaultAvatar } from '@/assets/images'
import Image from 'next/image'
import { Tooltip } from '../Tooltip'
import { DisconnectWalletButton } from '../wallet-button/DisconnectWalletButton'
import { Modal } from './Modal'

export const AccountModal: FC<TModalProps> = ({ isOpen, onClose }) => {
  const { isConnected, address } = useAccount()
  const { data: balance } = useBalance({ address })
  const formattedBalance = formatBalance(
    balance?.value || BigInt(0),
    balance?.decimals || 0,
    balance?.symbol || '',
  )
  const [tooltipContent, setTooltipContent] = useState<'Copy' | 'Copied!'>(
    'Copy',
  )

  const copyAddressToClipboard = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setTooltipContent('Copied!')
      setTimeout(() => {
        setTooltipContent('Copy')
      }, 2000)
    }
  }

  useEffect(() => {
    if (!isConnected) {
      onClose()
    }
  }, [isConnected, onClose])

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='flex items-center gap-3 p-4'>
        <Image alt='default-avt' src={defaultAvatar} className='size-10' />
        <div className='flex flex-col justify-center gap-0.5'>
          <div className='text-18 flex items-center gap-2 font-semibold text-white'>
            <Tooltip content={address || ''}>
              {truncateAddress(address || '')}
            </Tooltip>
            <Tooltip
              content={tooltipContent}
              onHide={() => setTooltipContent('Copy')}
            >
              <CopyIcon
                className='cursor-pointer'
                onClick={copyAddressToClipboard}
              />
            </Tooltip>
          </div>
          <p className='text-14 text-white/50 sm:hidden'>
            {formattedBalance.rawValue}
          </p>
          <Tooltip
            content={formattedBalance.rawValue}
            className='hidden sm:flex'
          >
            <p className='text-14 text-white/50'>
              {formattedBalance.toPrecision()}
            </p>
          </Tooltip>
        </div>
      </div>
      <div className='w-full border-t border-white/10 p-4'>
        <DisconnectWalletButton />
      </div>
    </Modal>
  )
}
