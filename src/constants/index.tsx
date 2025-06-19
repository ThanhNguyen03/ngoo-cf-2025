import { TNavigationItem } from '@/types'
import {
  SquaresFourIcon,
  ChatsCircleIcon,
  VaultIcon,
  HouseIcon,
} from '@phosphor-icons/react/dist/ssr'

export const DEV_APP_URL = 'http://localhost:3000'
export const LOCALSTORAGE_KEY = 'ngoo_coffee_visited'
export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000

export const LIST_HEADER_NAVIGATION: TNavigationItem[] = [
  {
    name: 'Overview',
    icon: <HouseIcon weight='fill' size={18} className='text-primary-600' />,
    href: '/',
  },
  {
    name: 'Menu',
    icon: (
      <SquaresFourIcon weight='fill' size={18} className='text-primary-600' />
    ),
    href: '/menu',
  },
  {
    name: 'Faucet',
    icon: <VaultIcon weight='fill' size={18} className='text-primary-600' />,
    href: '#', // to faucet page ex: u2u, ftm, monad,...
  },
  {
    name: 'Contact',
    icon: (
      <ChatsCircleIcon weight='fill' size={18} className='text-primary-600' />
    ),
    href: '#', // to porfolio page
    openInNewTab: true,
  },
]
