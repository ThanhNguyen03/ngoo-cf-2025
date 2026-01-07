import { OrderItemInput, TItemResponse } from '@/lib/graphql/generated/graphql'
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

export const enum ESorting {
  ASC = 'asc',
  DESC = 'desc',
}

export type TListStatus<T> = T | 'Status'

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

export type TPaginationQuery = {
  column: string
  sort: 'asc' | 'desc'
}

export type TPagination = {
  limit: number
  offset: number
  query?: TPaginationQuery[]
}

export type TCartItem = OrderItemInput & {
  itemInfo: TItemResponse
}

export type TCollectionData = {
  title: string
  img: string | StaticImageData
  bgClassName?: string
  textClassName?: string
  buttonClassName?: string
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
