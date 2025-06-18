import { TNavigationItem } from '@/types'
import {
  SquaresFourIcon,
  ChatsCircleIcon,
  VaultIcon,
  HouseIcon,
} from '@phosphor-icons/react/dist/ssr'

export const DEV_APP_URL = 'http://localhost:3000'

export const LIST_HEADER_NAVIGATION: TNavigationItem[] = [
  {
    name: 'Overview',
    icon: <HouseIcon weight='fill' size={18} className='text-primary-500' />,
    href: '/',
  },
  {
    name: 'Menu',
    icon: (
      <SquaresFourIcon weight='fill' size={18} className='text-primary-500' />
    ),
    href: '/menu',
  },
  {
    name: 'Faucet',
    icon: <VaultIcon weight='fill' size={18} className='text-primary-500' />,
    href: '#', // to faucet page ex: u2u, ftm, monad,...
  },
  {
    name: 'Contact',
    icon: (
      <ChatsCircleIcon weight='fill' size={18} className='text-primary-500' />
    ),
    href: '#', // to porfolio page
    openInNewTab: true,
  },
]
