import { StaticImageData } from 'next/image'

export type TModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  closable?: boolean
  closeOnOutsideClick?: boolean
  className?: string
  overlayClassName?: string
}

export type TNavigationItem = {
  name: string
  icon?: string | React.ReactNode
  href: string
  openInNewTab?: boolean
}

export type TDirection = 'prev' | 'next'

export type TIconProps = {
  fill?: string
  className?: string
  width?: number
  height?: number
  text?: string
}

export type TItem = {
  image: string | StaticImageData
  title: string
  price: number
  amountDiscount?: number
}
