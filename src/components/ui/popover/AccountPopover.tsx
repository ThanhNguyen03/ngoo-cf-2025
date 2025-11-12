import { defaultAvatar } from '@/assets/images'
import { Button, Tooltip } from '@/components/ui'
import {
  ConnectWalletButton,
  SwitchChainButton,
} from '@/components/ui/wallet-button'
import { LIST_ACCOUNT_NAVIGATION, LIST_CONNECTOR_ICON } from '@/constants'
import { TUserInfo } from '@/lib/graphql/generated/graphql'
import useAuthStore from '@/store/auth-store'
import { TPopoverProps } from '@/types'
import { cn } from '@/utils'
import {
  CopyIcon,
  PlugsIcon,
  SignOutIcon,
} from '@phosphor-icons/react/dist/ssr'
import Image from 'next/image'
import Link from 'next/link'
import { ComponentPropsWithRef, FC, useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'

type TAccountPopoverProps = TPopoverProps &
  ComponentPropsWithRef<'div'> & {
    userInfo: TUserInfo
  }

export const AccountPopover: FC<TAccountPopoverProps> = ({
  isOpen,
  ref,
  className,
  userInfo,
}) => {
  const { isConnected, address, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const logout = useAuthStore((state) => state.logout)

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

  const connectorIcon =
    LIST_CONNECTOR_ICON[connector?.id ?? ''] ?? connector?.icon

  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2 absolute right-0 z-20 h-fit flex-col border border-black/[0.02] bg-white shadow-md',
        isOpen ? 'flex w-[280px]' : 'hidden',
        className,
      )}
    >
      <div className='flex flex-col py-2 md:py-3'>
        <div className='flex items-center gap-3 px-2 md:px-3'>
          <div className='bg-primary-50 center border-secondary-500 relative flex size-12 shrink-0 self-start rounded-full border-2'>
            <Image
              alt='default-avt'
              src={defaultAvatar}
              width={48}
              height={48}
              className='size-11'
            />

            {isConnected && (
              <div className='rounded-1.5 absolute -right-1 -bottom-1 flex size-5 items-center justify-center border border-black/10 bg-white'>
                <Image
                  alt='connector-icon'
                  src={connectorIcon}
                  width={12}
                  height={12}
                  className='size-3'
                />
              </div>
            )}
          </div>
          <div className='flex w-full flex-col justify-center gap-2'>
            <div
              className={cn(
                'flex flex-col items-end text-black/80',
                isConnected && 'pr-6',
              )}
            >
              <p className='text-16 text-primary-600 text-right font-bold -tracking-[0.32px] wrap-anywhere'>
                {userInfo.email}
              </p>
              <p className='text-14 font-medium'>{userInfo.name}</p>
            </div>

            {/* divider */}
            <div className='h-px w-full bg-linear-to-l from-black/10 to-black/[2%]' />
          </div>
        </div>
        {isConnected && userInfo.walletAddress && (
          <div className='text-14 mt-4 flex items-center gap-2 px-2 font-semibold text-black/80 md:px-3'>
            <Tooltip
              content={userInfo.walletAddress}
              wrapperClassName='wrap-anywhere'
              className='text-primary-500 bg-white font-semibold shadow'
            >
              {userInfo.walletAddress}
            </Tooltip>
            <Tooltip
              content={tooltipContent}
              onHide={() => setTooltipContent('Copy')}
            >
              <CopyIcon
                className='cursor-pointer'
                weight='duotone'
                onClick={copyAddressToClipboard}
              />
            </Tooltip>
          </div>
        )}

        <div className='my-4 w-full px-2 md:px-3'>
          {isConnected ? (
            <SwitchChainButton />
          ) : (
            <div className='flex w-full items-end justify-end'>
              <ConnectWalletButton />
            </div>
          )}
        </div>

        {/* divider */}
        <div className='h-px w-full bg-linear-to-l from-black/10 to-black/[2%] px-2 md:px-3' />

        <div className='flex w-full flex-col'>
          {LIST_ACCOUNT_NAVIGATION.map((link) => (
            <Link
              key={link.name}
              target={link.openInNewTab ? '_blank' : '_self'}
              href={link.href}
              title={link.name}
              className='from-primary-100 to-beige-50 flex size-full items-center justify-between gap-2 px-2 py-2 hover:bg-linear-to-r md:px-3'
            >
              <p className='text-18 font-small-caps text-dark-600/70 font-semibold'>
                {link.name}
              </p>
              <div className='shrink-0'>{link.icon}</div>
            </Link>
          ))}
        </div>

        {/* divider */}
        <div className='h-px w-full bg-linear-to-l from-black/10 to-black/[2%] px-2 md:px-3' />

        <div className='mt-4 flex w-full flex-col gap-2 px-2 md:px-3'>
          {isConnected && (
            <Button
              disableAnimation
              className='bg-dark-600 text-beige-50! text-14 hover:bg-dark-400 w-full'
              icon={<PlugsIcon size={20} />}
              onClick={() => disconnect()}
            >
              Disconnect
            </Button>
          )}
          <Button
            onClick={logout}
            className='bg-secondary-500 text-beige-50! text-14 hover:bg-secondary-600 w-full'
            disableAnimation
            icon={<SignOutIcon />}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  )
}
