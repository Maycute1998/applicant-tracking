import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'
import { AlertDialogProps } from '../../../data-type'
import { useTranslation } from 'react-i18next'
import React from 'react'

const AlertDialog = (props: AlertDialogProps) => {
  const { open, title, content, onOk, okText, onCancel, cancelText, onConfirm, confirmText, isConfirm = true } = props
  const { t } = useTranslation()

  return (
    <Dialog open={open}>
      <DialogTitle>{title ? title : t('common:dialog.confirmDeleteTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {isConfirm ? (
          <React.Fragment>
            <Button onClick={onCancel}>{cancelText ? cancelText : t('common:dialog.cancel')}</Button>
            <Button onClick={onConfirm} autoFocus>
              {confirmText ? confirmText : t('common:dialog.confirm')}
            </Button>
          </React.Fragment>
        ) : (
          <Button onClick={onOk}>{okText ? okText : t('common:dialog.ok')}</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
export default AlertDialog
