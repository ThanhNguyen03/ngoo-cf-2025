import {
  cherryJuiceBottle,
  kiwiJuiceBottole,
  orangeJuiceBottle,
  strawberryJuiceBottle,
} from '@/products'
import {
  ENewProduct,
  TCollection,
  TNavigationItem,
  TNewCollection,
} from '@/types'
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

export const LIST_NEW_PRODUCT: TCollection[] = [
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

export const NEW_PRODUCT_DATA: Record<ENewProduct, TNewCollection> = {
  [ENewProduct.Cherry]: {
    model: '/models/cherry.glb',
    tag: 'Sweet, fresh, and a sip of happiness.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(335,75%,30%)_0%,hsla(345,7%,10%,1)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-cherry-500/50 to-white/10',
    description:
      'Our Cherry Juice shines with a vibrant ruby-red color and a naturally sweet-tart taste from fresh cherries. Packed with antioxidants, it not only refreshes but also supports glowing skin and heart health. A perfect balance of sweetness and lightness in every sip.',
  },
  [ENewProduct.Kiwi]: {
    model: '/models/kiwi.glb',
    tag: 'Tangy, refreshing, and naturally energizing.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(68,76%,41%)_0%,hsla(345,7%,10%,1)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-kiwi-500/50 to-white/10',
    description:
      'Kiwi Juice delivers a refreshing surprise with its tangy-sweet balance and distinctive fragrance of fresh kiwi. Rich in vitamin C and fiber, it boosts your energy while keeping you light, fresh, and healthy throughout the day.',
  },
  [ENewProduct.Orange]: {
    model: '/models/orange.glb',
    tag: 'One glass of orange, one brighter day.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(32,99%,52%)_0%,hsla(345,7%,10%,1)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-orange-500/50 to-white/10',
    description:
      'Nothing beats the freshness of pure Orange Juice. With its sweet, zesty flavor and vitamin C richness, it strengthens immunity, brightens your mood, and fuels your day with vitality. A timeless classic that never goes out of style.',
  },
  [ENewProduct.Strawberry]: {
    model: '/models/strawberry.glb',
    tag: 'Naturally sweet, love at first sip.',
    bgClassName:
      'bg-[radial-gradient(ellipse_at_center,hsl(0,96%,42%)_0%,hsla(345,7%,10%,1)_80%)]',
    buttonClassName: 'hover:bg-linear-to-br from-strawberry-500/50 to-white/10',
    description:
      'Strawberry Juice bursts with the sweet, refreshing taste of ripe strawberries. Each sip delivers freshness and a natural energy boost. More than just a drink, it’s a delightful treat for your senses that you’ll fall in love with instantly.',
  },
}
