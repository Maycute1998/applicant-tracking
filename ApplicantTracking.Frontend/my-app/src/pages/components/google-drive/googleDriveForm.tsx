import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, styled } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Ref, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { ApiResponseBasic, DialogProps, GoogleDriveFormData, GoogleDriveSubFolderFormData } from '../../../data-type'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { WriteLog, WriteLogTable } from '../../../utils/helper'
import { AlertDialog } from '../../../components/core'
import { CreateFolderAsync, CreateSubFolderAsync } from '../../../services'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { IGoogle } from '../../../interfaces'
import { useTranslation } from 'react-i18next'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

type GoogleDriveModalProps = {
  isOpen: boolean
  folderId?: string
  folderName?: string
  onClose: () => void
  onReloadData?: () => void
  onReloadDataSubFolder?: () => void
  onCloseModalAfterSubmit?: () => void
  onResetState?: () => void
}

const GoogleDriveForm = forwardRef((props: GoogleDriveModalProps, ref: Ref<IGoogle>) => {
  const { isOpen, folderId, folderName, onClose, onReloadData, onReloadDataSubFolder, onCloseModalAfterSubmit, onResetState } = props
  const { t } = useTranslation()
  useImperativeHandle(ref, () => ({ onResetForm }))
  const { onLoading } = useLoadingOverlay()
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })

  const validationLocales = {
    folderName: {
      required: t('googleDrive:validations.required.folderName'),
    },
  }

  const schema = Yup.object().shape({
    folderName: Yup.string().label('folderName').trim().required(validationLocales.folderName.required),
  })
  const {
    control,
    resetField,
    formState: { errors },
    handleSubmit,
  } = useForm<GoogleDriveFormData>({
    mode: 'onChange',
    defaultValues: {
      folderName: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<GoogleDriveFormData> = async (data: GoogleDriveFormData) => {
    const formData: GoogleDriveFormData = {
      folderName: data.folderName,
    }
    if (folderId) {
      const formSubFolder: GoogleDriveSubFolderFormData = {
        folderName: data.folderName,
        folderId: folderId,
      }
      await onCreateSubFolderAsync(formSubFolder)
    } else {
      await onCreateFolderAsync(formData)
    }

    WriteLog({
      groupTitle: 'Google Drive Form',
      logType: 'info',
      data: formData,
    })
  }

  const onCreateFolderAsync = async (formData: GoogleDriveFormData) => {
    onLoading(true)
    await CreateFolderAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateFolderAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onCreateFolderAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onCreateSubFolderAsync = async (formData: GoogleDriveSubFolderFormData) => {
    onLoading(true)
    await CreateSubFolderAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateSubFolderAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onCreateSubFolderAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onResetForm = () => {
    resetField('folderName')
  }

  useEffect(() => {
    console.log('Folder Id: ', folderId)
  }, [folderId])

  return (
    <BootstrapDialog fullWidth disableEscapeKeyDown onClose={onClose} aria-labelledby='customized-dialog-title' open={isOpen}>
      <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
        {t('common:googleDriveDialog.createFolderTitle')}
      </DialogTitle>
      <IconButton
        aria-label='close'
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        {folderName ? (
          <DialogContentText>
            {folderId}-{folderName}
          </DialogContentText>
        ) : null}
        <Controller
          control={control}
          name='folderName'
          render={({ field }) => (
            <TextField
              autoFocus
              variant='standard'
              margin='dense'
              label={t('forms:googleDrive.folderName')}
              fullWidth
              {...field}
              size='small'
              placeholder={t('forms:googleDrive.folderName')}
              error={!!errors.folderName}
              helperText={errors.folderName && `${errors.folderName.message}`}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          {t('common:googleDriveDialog.buttons.cancel')}
        </Button>
        <Button autoFocus onClick={handleSubmit(onSubmit)}>
          {t('common:googleDriveDialog.buttons.createFolder')}
        </Button>
      </DialogActions>
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={false}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '' })
          if (!folderId) {
            onReloadData?.()
          } else {
            onReloadDataSubFolder?.()
          }
          onCloseModalAfterSubmit?.()
          onResetState?.()
          onResetForm()
        }}
      />
    </BootstrapDialog>
  )
})
GoogleDriveForm.displayName = 'GoogleDriveForm'
export default GoogleDriveForm
