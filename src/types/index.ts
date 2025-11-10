import { StaticImageData } from 'next/image'
import { SVGProps } from 'react'

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

export type TIconProps = SVGProps<SVGSVGElement> & {
  width?: number
  height?: number
  size?: number
}

export type TItemOption = {
  name: string
  extraPrice?: number
  group: string
}
export type TGroupOption = {
  group: string
  isRequired?: boolean
}
export type TItem = {
  image: string | StaticImageData
  title: string
  price: number
  amount: number
  discountPercent?: number
  description?: string
  additionalOption?: TItemOption[]
}

export type TCollectionData = {
  title: string
  img: string | StaticImageData
  bgClassName?: string
}

export enum ENewProduct {
  Cherry = 'cherry',
  Kiwi = 'kiwi',
  Orange = 'orange',
  Strawberry = 'strawberry',
}

export type TCursorPosition = { x: number; y: number }

export type TPopoverProps = {
  isOpen: boolean
  onClose: () => void
  className?: string | undefined
}
