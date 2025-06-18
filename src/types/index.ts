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
