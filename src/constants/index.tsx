import { ENewProduct, TNavigationItem } from '@/types'
import {
  ChatsCircleIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  HouseIcon,
  LinkedinLogoIcon,
  SquaresFourIcon,
  TelegramLogoIcon,
  VaultIcon,
} from '@phosphor-icons/react/dist/ssr'

export const DEV_APP_URL = 'http://localhost:3000'
export const LOCALSTORAGE_KEY = 'ngoo_coffee_visited'
export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000
export const DEBOUNCE_DURATION = 500 // 500ms

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
    href: '#', // TODO: faucet page ex: u2u, ftm, monad,...
  },
  {
    name: 'Contact',
    icon: (
      <ChatsCircleIcon weight='fill' size={18} className='text-primary-600' />
    ),
    href: 'https://thanhng-portfolio-2024.vercel.app/',
    openInNewTab: true,
  },
]

export const LIST_SOCIAL_BUTTON: TNavigationItem[] = [
  {
    name: 'Facebook',
    icon: <FacebookLogoIcon size={24} fill='#0866fe' />,
    href: 'https://www.facebook.com/thanhfnguyen.03',
  },
  {
    name: 'Github',
    icon: <GithubLogoIcon size={24} fill='#51515d' />,
    href: 'https://github.com/ThanhNguyen03',
  },
  {
    name: 'LinkedIn',
    icon: <LinkedinLogoIcon size={24} fill='#0a62bd' />,
    href: 'https://www.linkedin.com/in/thanhfnguyen03/',
  },
  {
    name: 'Mail',
    icon: <TelegramLogoIcon size={24} fill='#e94334' />,
    href: 'mailto:thanhfng.dev@gmail.com',
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
      { href: 'https://thanhng-portfolio-2024.vercel.app/', name: 'Explore' },
      { href: 'https://github.com/ThanhNguyen03', name: 'Github' },
    ],
  },
  {
    title: 'Contact',
    children: [
      { href: 'https://m.me/thanhfnguyen.03', name: 'Facebook' },
      { href: 'https://ig.me/m/thanhf.ng_', name: 'Instagram' },
      { href: 'https://www.linkedin.com/in/thanhfnguyen03/', name: 'LinkedIn' },
      { href: 'https://t.me/thanhf.ng_', name: 'Telegram' },
    ],
  },
]

export const NEW_PRODUCT_CLASSES: Record<ENewProduct, string> = {
  [ENewProduct.Cherry]:
    'bg-[radial-gradient(ellipse_at_center,hsl(335,75%,30%)_0%,hsla(345,7%,10%,1)_80%)]',
  [ENewProduct.Kiwi]:
    'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,41%)_0%,hsla(345,7%,10%,1)_80%)]',
  [ENewProduct.Orange]:
    'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,52%)_0%,hsla(345,7%,10%,1)_80%)]',
  [ENewProduct.Strawberry]:
    'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,42%)_0%,hsla(345,7%,10%,1)_80%)]',
}
