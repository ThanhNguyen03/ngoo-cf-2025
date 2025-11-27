import {
  ethereumIcon,
  monadIcon,
  u2uIcon,
  walletConnectIcon,
} from '@/assets/icons'
import {
  cherryJuiceBottle,
  kiwiJuiceBottole,
  orangeJuiceBottle,
  strawberryJuiceBottle,
} from '@/assets/products'
import { PaginationInput } from '@/lib/graphql/generated/graphql'
import {
  ENewProduct,
  TCollectionData,
  TItem,
  TItemOption,
  TNavigationItem,
} from '@/types'
import {
  ChatsCircleIcon,
  ClockUserIcon,
  FacebookLogoIcon,
  GearSixIcon,
  GithubLogoIcon,
  HouseIcon,
  LinkedinLogoIcon,
  SquaresFourIcon,
  TelegramLogoIcon,
  VaultIcon,
} from '@phosphor-icons/react/dist/ssr'
import { mainnet, monadTestnet, sepolia } from 'viem/chains'

export const DEV_APP_URL = 'http://localhost:3000'
export const LOCALSTORAGE_KEY = 'ngoo_coffee_visited'
export const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000
export const DEBOUNCE_DURATION = 500 // 500ms
export const EXPIRES_IN = 2 * 60 * 1000 // 60 minutes
export const REFRESH_GAP = 60 * 1000 // 60s
export const DEFAULT_PAGINATION: PaginationInput = {
  limit: 20,
  offset: 0,
}

export const METAMASK_BASE64_ICON =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzQiIHZpZXdCb3g9IjAgMCAzNSAzNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMyLjcwNzcgMzIuNzUyMkwyNS4xNjg4IDMwLjUxNzRMMTkuNDgzMyAzMy45MDA4TDE1LjUxNjcgMzMuODk5MUw5LjgyNzkzIDMwLjUxNzRMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDQ4OUwyLjI5MjI1IDE2LjQ5OTNMMCA5LjI3MDk0TDIuMjkyMjUgMC4zMTIyNTZMMTQuMDY3NCA3LjMxNTU0SDIwLjkzMjZMMzIuNzA3NyAwLjMxMjI1NkwzNSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0wzNSAyNS4wNDg5TDMyLjcwNzcgMzIuNzUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTIuMjkzOTUgMC4zMTIyNTZMMTQuMDY5MSA3LjMyMDQ3TDEzLjYwMDggMTIuMTMwMUwyLjI5Mzk1IDAuMzEyMjU2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNOS44Mjk1OSAyNS4wNTIyTDE1LjAxMDYgMjguOTgxMUw5LjgyOTU5IDMwLjUxNzVWMjUuMDUyMloiIGZpbGw9IiNGRjVDMTYiLz4KPHBhdGggZD0iTTE0LjU5NjYgMTguNTU2NUwxMy42MDA5IDEyLjEzMzNMNy4yMjY5MiAxNi41MDA5TDcuMjIzNjMgMTYuNDk5M1YxNi41MDI1TDcuMjQzMzUgMjAuOTk4M0w5LjgyODA5IDE4LjU1NjVIOS44Mjk3NEgxNC41OTY2WiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMzIuNzA3NyAwLjMxMjI1NkwyMC45MzI2IDcuMzIwNDdMMjEuMzk5MyAxMi4xMzAxTDMyLjcwNzcgMC4zMTIyNTZaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIyIDI1LjA1MjJMMTkuOTkxMiAyOC45ODExTDI1LjE3MjIgMzAuNTE3NVYyNS4wNTIyWiIgZmlsbD0iI0ZGNUMxNiIvPgo8cGF0aCBkPSJNMjcuNzc2NiAxNi41MDI1SDI3Ljc3ODNIMjcuNzc2NlYxNi40OTkzTDI3Ljc3NSAxNi41MDA5TDIxLjQwMSAxMi4xMzMzTDIwLjQwNTMgMTguNTU2NUgyNS4xNzIyTDI3Ljc1ODYgMjAuOTk4M0wyNy43NzY2IDE2LjUwMjVaIiBmaWxsPSIjRkY1QzE2Ii8+CjxwYXRoIGQ9Ik05LjgyNzkzIDMwLjUxNzVMMi4yOTIyNSAzMi43NTIyTDAgMjUuMDUyMkg5LjgyNzkzVjMwLjUxNzVaIiBmaWxsPSIjRTM0ODA3Ii8+CjxwYXRoIGQ9Ik0xNC41OTQ3IDE4LjU1NDlMMTYuMDM0MSAyNy44NDA2TDE0LjAzOTMgMjIuNjc3N0w3LjIzOTc1IDIwLjk5ODRMOS44MjYxMyAxOC41NTQ5SDE0LjU5M0gxNC41OTQ3WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjUuMTcyMSAzMC41MTc1TDMyLjcwNzggMzIuNzUyMkwzNS4wMDAxIDI1LjA1MjJIMjUuMTcyMVYzMC41MTc1WiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMjAuNDA1MyAxOC41NTQ5TDE4Ljk2NTggMjcuODQwNkwyMC45NjA3IDIyLjY3NzdMMjcuNzYwMiAyMC45OTg0TDI1LjE3MjIgMTguNTU0OUgyMC40MDUzWiIgZmlsbD0iI0UzNDgwNyIvPgo8cGF0aCBkPSJNMCAyNS4wNDg4TDIuMjkyMjUgMTYuNDk5M0g3LjIyMTgzTDcuMjM5OTEgMjAuOTk2N0wxNC4wMzk0IDIyLjY3NkwxNi4wMzQzIDI3LjgzODlMMTUuMDA4OSAyOC45NzZMOS44Mjc5MyAyNS4wNDcySDBWMjUuMDQ4OFoiIGZpbGw9IiNGRjhENUQiLz4KPHBhdGggZD0iTTM1LjAwMDEgMjUuMDQ4OEwzMi43MDc4IDE2LjQ5OTNIMjcuNzc4M0wyNy43NjAyIDIwLjk5NjdMMjAuOTYwNyAyMi42NzZMMTguOTY1OCAyNy44Mzg5TDE5Ljk5MTIgMjguOTc2TDI1LjE3MjIgMjUuMDQ3MkgzNS4wMDAxVjI1LjA0ODhaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yMC45MzI1IDcuMzE1NDNIMTcuNDk5OUgxNC4wNjczTDEzLjYwMDYgMTIuMTI1MUwxNi4wMzQyIDI3LjgzNEgxOC45NjU2TDIxLjQwMDggMTIuMTI1MUwyMC45MzI1IDcuMzE1NDNaIiBmaWxsPSIjRkY4RDVEIi8+CjxwYXRoIGQ9Ik0yLjI5MjI1IDAuMzEyMjU2TDAgOS4yNzA5NEwyLjI5MjI1IDE2LjQ5OTNINy4yMjE4M0wxMy41OTkxIDEyLjEzMDFMMi4yOTIyNSAwLjMxMjI1NloiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTEzLjE3IDIwLjQxOTlIMTAuOTM2OUw5LjcyMDk1IDIxLjYwNjJMMTQuMDQwOSAyMi42NzI3TDEzLjE3IDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTMyLjcwNzcgMC4zMTIyNTZMMzQuOTk5OSA5LjI3MDk0TDMyLjcwNzcgMTYuNDk5M0gyNy43NzgxTDIxLjQwMDkgMTIuMTMwMUwzMi43MDc3IDAuMzEyMjU2WiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMjEuODMzIDIwLjQxOTlIMjQuMDY5NEwyNS4yODUzIDIxLjYwNzlMMjAuOTYwNCAyMi42NzZMMjEuODMzIDIwLjQxODJWMjAuNDE5OVoiIGZpbGw9IiM2NjE4MDAiLz4KPHBhdGggZD0iTTE5LjQ4MTcgMzAuODM2MkwxOS45OTExIDI4Ljk3OTRMMTguOTY1OCAyNy44NDIzSDE2LjAzMjdMMTUuMDA3MyAyOC45Nzk0TDE1LjUxNjcgMzAuODM2MiIgZmlsbD0iIzY2MTgwMCIvPgo8cGF0aCBkPSJNMTkuNDgxNiAzMC44MzU5VjMzLjkwMjFIMTUuNTE2NlYzMC44MzU5SDE5LjQ4MTZaIiBmaWxsPSIjQzBDNENEIi8+CjxwYXRoIGQ9Ik05LjgyOTU5IDMwLjUxNDJMMTUuNTIgMzMuOTAwOFYzMC44MzQ2TDE1LjAxMDYgMjguOTc3OEw5LjgyOTU5IDMwLjUxNDJaIiBmaWxsPSIjRTdFQkY2Ii8+CjxwYXRoIGQ9Ik0yNS4xNzIxIDMwLjUxNDJMMTkuNDgxNyAzMy45MDA4VjMwLjgzNDZMMTkuOTkxMSAyOC45Nzc4TDI1LjE3MjEgMzAuNTE0MloiIGZpbGw9IiNFN0VCRjYiLz4KPC9zdmc+Cg=='

export const LIST_CONNECTOR_ICON: Record<string, string> = {
  walletConnect: walletConnectIcon.src,
}

export const LIST_CHAIN_ICON: Record<number, string> = {
  [mainnet.id]: ethereumIcon,
  [sepolia.id]: ethereumIcon,
  [monadTestnet.id]: monadIcon,
  2484: u2uIcon,
}

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

export const LIST_NEW_PRODUCT: TCollectionData[] = [
  {
    title: ENewProduct.Cherry,
    img: cherryJuiceBottle,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(335,75%,30%)_0%,hsla(345,7%,10%,1)_70%)]',
  },
  {
    title: ENewProduct.Kiwi,
    img: kiwiJuiceBottole,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,41%)_0%,hsla(345,7%,10%,1)_70%)]',
  },
  {
    title: ENewProduct.Orange,
    img: orangeJuiceBottle,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,52%)_0%,hsla(345,7%,10%,1)_70%)]',
  },
  {
    title: ENewProduct.Strawberry,
    img: strawberryJuiceBottle,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,42%)_0%,hsla(345,7%,10%,1)_70%)]',
  },
]

type TNewItem = TItem & {
  model: string
  tag: string
  bgClassName?: string
  buttonClassName?: string
  titleClassName?: string
}
export const SIZE_OPTION: TItemOption[] = [
  {
    group: 'size',
    name: 'M',
  },
  {
    group: 'size',
    name: 'L',
    extraPrice: 2,
  },
]
export const NEW_PRODUCT_DATA: Record<ENewProduct, TNewItem> = {
  [ENewProduct.Cherry]: {
    title: 'Cherry Juice',
    image: cherryJuiceBottle,
    model: '/models/cherry.glb',
    tag: 'Sweet, fresh, and a sip of happiness.',
    price: 5,
    amount: 0,
    additionalOption: SIZE_OPTION,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(340,75%,30%)_0%,hsl(335,75%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-cherry-500/70 to-white/10',
    titleClassName: 'bg-linear-to-br from-cherry-300 to-white',
    description:
      'Our Cherry Juice shines with a vibrant ruby-red color and a naturally sweet-tart taste from fresh cherries. Packed with antioxidants, it not only refreshes but also supports glowing skin and heart health. A perfect balance of sweetness and lightness in every sip.',
  },
  [ENewProduct.Kiwi]: {
    title: 'Kiwi Juice',
    image: kiwiJuiceBottole,
    model: '/models/kiwi.glb',
    tag: 'Tangy, refreshing, and naturally energizing.',
    price: 5,
    amount: 0,
    additionalOption: SIZE_OPTION,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,30%)_0%,hsl(68,76%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-kiwi-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-kiwi-300 to-white',
    description:
      'Kiwi Juice delivers a refreshing surprise with its tangy-sweet balance and distinctive fragrance of fresh kiwi. Rich in vitamin C and fiber, it boosts your energy while keeping you light, fresh, and healthy throughout the day.',
  },
  [ENewProduct.Orange]: {
    title: 'Orange Juice',
    image: orangeJuiceBottle,
    model: '/models/orange.glb',
    tag: 'One glass of orange, one brighter day.',
    price: 5,
    amount: 0,
    additionalOption: SIZE_OPTION,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,30%)_0%,hsl(32,99%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-orange-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-orange-300 to-white',
    description:
      'Nothing beats the freshness of pure Orange Juice. With its sweet, zesty flavor and vitamin C richness, it strengthens immunity, brightens your mood, and fuels your day with vitality. A timeless classic that never goes out of style.',
  },
  [ENewProduct.Strawberry]: {
    title: 'Strawberry Juice',
    image: strawberryJuiceBottle,
    model: '/models/strawberry.glb',
    tag: 'Naturally sweet, love at first sip.',
    price: 5,
    amount: 0,
    additionalOption: SIZE_OPTION,
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,30%)_0%,hsl(0,96%,42%)_40%,hsla(345,7%,10%)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-strawberry-500/50 to-white/10',
    titleClassName: 'bg-linear-to-br from-strawberry-300 to-white',
    description:
      'Strawberry Juice bursts with the sweet, refreshing taste of ripe strawberries. Each sip delivers freshness and a natural energy boost. More than just a drink, it’s a delightful treat for your senses that you’ll fall in love with instantly.',
  },
}

export const LIST_ACCOUNT_NAVIGATION: TNavigationItem[] = [
  {
    name: 'Settings',
    icon: <GearSixIcon weight='fill' size={24} className='text-primary-400' />,
    href: '/profile',
  },
  {
    name: 'Faucet',
    icon: <VaultIcon weight='fill' size={24} className='text-primary-400' />,
    href: '#', // TODO: faucet page ex: u2u, ftm, monad,...
  },
  {
    name: 'Activity',
    icon: (
      <ClockUserIcon weight='fill' size={24} className='text-primary-400' />
    ),
    href: '/activity',
  },
]
