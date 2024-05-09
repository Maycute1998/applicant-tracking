export type AlertDialogProps = {
  open: boolean
  title?: string
  content?: string
  isConfirm?: boolean
  onCancel?: () => void
  cancelText?: string | 'Cancel'
  onOk?: () => void
  okText?: string | 'Ok'
  onConfirm?: () => void
  confirmText?: string | 'Confirm'
}
