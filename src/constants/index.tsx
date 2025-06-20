import { TNavigationItem } from '@/types'
import {
  SquaresFourIcon,
  ChatsCircleIcon,
  VaultIcon,
  HouseIcon,
  DiscordLogoIcon,
  GithubLogoIcon,
  TelegramLogoIcon,
  FacebookLogoIcon,
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

export const LIST_SOCIAL_BUTTON: TNavigationItem[] = [
  {
    name: 'Facebook',
    icon: <FacebookLogoIcon size={24} weight='fill' fill='#0866fe' />,
    href: 'https://x.com/OrochiNetwork',
  },
  {
    name: 'Discord',
    icon: <DiscordLogoIcon size={24} weight='fill' fill='#707bf7' />,
    href: 'https://discord.com/invite/sTU4TUh8H3',
  },
  {
    name: 'Github',
    icon: <GithubLogoIcon size={24} weight='fill' fill='#51515d' />,
    href: 'https://x.com/OrochiNetwork',
  },
  {
    name: 'Telegram',
    icon: <TelegramLogoIcon size={24} weight='fill' fill='#3eb6f3' />,
    href: 'https://discord.com/invite/sTU4TUh8H3',
  },
]

export const LIST_FOOTER_NAVIGATION: Array<
  Record<'title', string> & {
    children: TNavigationItem[]
  }
> = [
  {
    title: 'Developers',
    children: [
      { href: '/', name: 'Homepage' },
      { href: '#', name: 'Github' },
      { href: '#', name: 'Cookbook' },
      { href: '#', name: 'Get started' },
    ],
  },
  {
    title: 'Ecosystem',
    children: [
      { href: '#', name: 'Explore' },
      { href: '#', name: 'Collaborate' },
    ],
  },
  {
    title: 'Resource',
    children: [
      { href: '#', name: 'Blog' },
      { href: '#', name: 'npm package' },
      { href: '#', name: 'MIPs' },
      { href: '#', name: 'RamenPasta' },
    ],
  },
]
