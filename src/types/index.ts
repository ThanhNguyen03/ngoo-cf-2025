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
  extraPrice?: number | string
}
export type TListItemOption = {
  title: string
  listOption: TItemOption[]
  isRequired?: boolean
}

export type TItem = {
  image: string | StaticImageData
  title: string
  price: number
  amountDiscount?: number
  description?: string
  additionalOption?: TListItemOption[]
}

export type TCollection = {
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
