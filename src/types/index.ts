export type TModalProps = {
  title?: string
  isOpen: boolean
  onClose: () => void
  closable?: boolean
  closeOnOutsideClick?: boolean
  className?: string
  overlayClassName?: string
}