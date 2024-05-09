import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { Ref, forwardRef, useImperativeHandle, useState, ReactNode, ReactElement } from 'react'
import { IFormDialog } from '../../../interfaces'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'
import { PermissionConfig } from '../../../constant'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

type FormDialogProps = {
  dialogTitle?: string
  dialogContent?: string | ReactNode
  isShowCloseButton?: boolean
  isDisable?: boolean
  isShowCancelButton?: boolean
  children?: ReactNode | ReactElement
  buttonCancelText?: string
  buttonOkText?: string
  isUsePermission?: boolean
  moduleCode?: string
  onConfirm?: () => void
  onCancel?: () => void
}

const FormDialog = forwardRef((props: FormDialogProps, ref: Ref<IFormDialog>) => {
  const { dialogTitle, isShowCloseButton, dialogContent, moduleCode, isDisable, isUsePermission, isShowCancelButton, children, buttonCancelText, buttonOkText, onConfirm, onCancel } = props
  useImperativeHandle(ref, () => ({ onOpenDialog, onCloseDialog }))
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { t } = useTranslation()
  const ButtonCreate = withComponentPermissionModule(Button, moduleCode as string, [PermissionConfig.Create, PermissionConfig.Update])

  /*
    Ref:Open Dialog
  */
  const onOpenDialog = (isShow: boolean) => {
    setIsOpen(isShow)
  }

  /*
    Ref:Close Dialog
  */
  const onCloseDialog = () => {
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
    onCancel?.()
  }

  const handleConfirm = () => {
    onConfirm?.()
  }

  return (
    <BootstrapDialog fullWidth disableEscapeKeyDown onClose={onCloseDialog} aria-labelledby='customized-dialog-title' open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {dialogTitle}
      </DialogTitle>
      {isShowCloseButton ? (
        <IconButton
          aria-label='close'
          onClick={onCloseDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
      <DialogContent dividers>
        {dialogContent ? <DialogContentText>{dialogContent}</DialogContentText> : null}
        {children}
      </DialogContent>
      <DialogActions>
        {isShowCancelButton ? <Button onClick={handleCancel}>{buttonCancelText ?? t('common:buttons.cancel')}</Button> : null}
        {isUsePermission && moduleCode ? (
          <ButtonCreate onClick={handleConfirm} disabled={isDisable}>
            {buttonOkText ?? t('common:buttons.ok')}
          </ButtonCreate>
        ) : (
          <Button onClick={handleConfirm} disabled={isDisable}>
            {buttonOkText ?? t('common:buttons.ok')}
          </Button>
        )}
      </DialogActions>
    </BootstrapDialog>
  )
})
FormDialog.displayName = 'FormDialog'
export default FormDialog
