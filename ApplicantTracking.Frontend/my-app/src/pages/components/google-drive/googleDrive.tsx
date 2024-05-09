import React, { createRef, useEffect, useState } from 'react'
import {
  Stack,
  Divider,
  Button,
  Box,
  Menu,
  MenuItem,
  Breadcrumbs,
  Paper,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Typography,
  Table,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { DeleteFileOrFolderAsync, GetFolders, GetFoldersContainFolders, RevokeTokenAsync, UploadFileIntoFolderAsync } from '../../../services'
import { ApiResponseBasic, ApiResponseProps, DialogProps, GoogleDriveBreadcrumbs, GoogleDriveFoldersContainsFolderReq, GoogleDriveFoldersProps } from '../../../data-type'
import { FormatFileSize, WriteLogTable } from '../../../utils/helper'
import { GoogleDriveMimeTypeMapping } from '../../../utils/uiHelper'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DeleteIcon from '@mui/icons-material/Delete'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import DownloadIcon from '@mui/icons-material/Download'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import UsbOffIcon from '@mui/icons-material/UsbOff'
import _ from 'lodash'
import moment from 'moment'
import GoogleDriveForm from './googleDriveForm'
import { IFormDialog, IGoogle } from '../../../interfaces'
import { AlertDialog, FormDialog, UploadFile } from '../../../components/core'
import { useTranslation } from 'react-i18next'

const GoogleDrive = () => {
  const { onLoading } = useLoadingOverlay()
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [folders, setFolders] = useState<GoogleDriveFoldersProps[]>([])
  const [googleDriveBreadcrumbs, setGoogleDriveBreadcrumbs] = useState<GoogleDriveBreadcrumbs[]>([])
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)
  const [selectedId, setSelectedId] = useState<string>('')
  const [contextMenuItemSelected, setContextMenuItemSelected] = useState<GoogleDriveFoldersProps | null>(null)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })
  const open = Boolean(anchorEl)
  const googleFormRef = createRef<IGoogle>()
  const formDialogRef = createRef<IFormDialog>()
  const formDialogViewFileRef = createRef<IFormDialog>()

  /**
   * Sets the anchor element to the current target of the mouse event.
   *
   * @param {React.MouseEvent<HTMLButtonElement>} event - The mouse event that triggered the function.
   * @return {void} This function does not return anything.
   */
  const handleOpenToolbar = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  /**
   * A function to handle closing the toolbar by setting the anchor element to null.
   *
   * @return {void} This function does not return anything.
   */
  const handleCloseToolbar = () => {
    setAnchorEl(null)
  }

  /**
   * Closes the anchor element, sets the isOpen state to true, clears the selectedId state,
   * and resets the contextMenuItemSelected state. If the googleFormRef is defined, it calls the
   * onResetForm method on the current instance.
   *
   * @return {void} This function does not return anything.
   */
  const handleCreateFolderAndClose = () => {
    setAnchorEl(null)
    setIsOpen(true)
    setSelectedId('')
    setContextMenuItemSelected(null)
    if (googleFormRef.current) {
      googleFormRef.current?.onResetForm?.()
    }
  }

  /**
   * Handles navigating to subfolders in Google Drive.
   *
   * @param {GoogleDriveFoldersProps} row - The row representing the folder to navigate to.
   * @return {Promise<void>} A promise that resolves when the navigation is complete.
   */
  const handleGotoSubFolders = async (row: GoogleDriveFoldersProps) => {
    if (row && row?.mimeType === 'application/vnd.google-apps.folder') {
      await getFoldersContainsFolder(row?.id as string)
      setGoogleDriveBreadcrumbs([...googleDriveBreadcrumbs, { id: row?.id, name: row?.name, isActive: false }])
      setSelectedId(row?.id as string)
    }
  }

  /**
   * A function to handle clicking on breadcrumbs in the Google Drive component.
   *
   * @param {string} folderId - The ID of the folder clicked on.
   * @param {GoogleDriveFoldersProps} row - The folder row object clicked on.
   * @return {Promise<void>} This function does not return anything immediately, but performs asynchronous operations.
   */
  const handleBreadcrumbsClick = async (folderId: string, row: GoogleDriveFoldersProps) => {
    let updatedItems = _.cloneDeep(googleDriveBreadcrumbs)
    const index = updatedItems.findIndex(item => item.id === row?.id)
    if (index !== -1) {
      updatedItems = updatedItems.slice(0, index + 1)
      setGoogleDriveBreadcrumbs(updatedItems)
    }
    setSelectedId(row?.id as string)
    await getFoldersContainsFolder(folderId)
  }

  /**
   * Handles the context menu event for the Google Drive component.
   *
   * @param {React.MouseEvent} event - The mouse event that triggered the context menu.
   * @param {GoogleDriveFoldersProps} row - The row object associated with the context menu.
   * @return {void} This function does not return anything.
   */
  const handleContextMenu = (event: React.MouseEvent, row: GoogleDriveFoldersProps) => {
    event.preventDefault()
    setContextMenuItemSelected(row)
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null
    )
  }

  /**
   * Closes the context menu.
   *
   * @return {void}
   */
  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  /**
   * Closes the context menu for creating a subfolder and sets the "isOpen" state to true.
   *
   * @param {none} none - This function does not take any parameters.
   * @return {none} This function does not return anything.
   */
  const handleCloseContextMenuCreateSubFolder = () => {
    setIsOpen(true)
    handleCloseContextMenu()
  }

  /**
   * Handles creating a subfolder and reloading data.
   *
   * @return {Promise<void>} A promise that resolves when the subfolder is created and data is reloaded.
   */
  const handleCreateSubFolderAndReloadData = async () => {
    await handleGotoSubFolders(contextMenuItemSelected as GoogleDriveFoldersProps)
  }

  /**
   * Handles deleting and closing the context menu.
   *
   * @param {none} none - This function does not take any parameters.
   * @return {none} This function does not return anything.
   */
  const handleDeleteAndClose = () => {
    setAnchorEl(null)
    setOpenDeleteAlertDialog({ isConfirm: true, open: true, content: t('common:dialog.confirmContent', { name: `[${contextMenuItemSelected?.name}]` }) })
    setContextMenu(null)
  }

  /**
   * A function to handle viewing a file by setting the anchor element and context menu to null.
   *
   * @param {none} none - This function does not take any parameters.
   * @return {none} This function does not return anything.
   */
  const handleViewFile = () => {
    setAnchorEl(null)
    if (formDialogViewFileRef.current) {
      formDialogViewFileRef.current?.onOpenDialog?.(true)
    }
    setContextMenu(null)
  }

  /**
   * A function that handles confirmation actions by setting delete alert dialog parameters and deleting a folder.
   *
   * @param {none} none - This function does not take any parameters.
   * @return {Promise<void>} A promise that resolves after deleting the specified folder.
   */
  const handleConfirm = async () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
    const folderId = contextMenuItemSelected?.id
    await onDelete(folderId as string)
  }

  /**
   * Sets the openDeleteAlertDialog state to false, clears the content, and sets isConfirm to true.
   *
   * @param {none} none - This function does not take any parameters.
   * @return {none} This function does not return anything.
   */
  const handleCancel = () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
  }

  /**
   * Handles the upload of a file.
   *
   * @return {Promise<void>} A promise that resolves when the upload is complete.
   */
  const handleUpload = async () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile)
      onLoading(true)
      await UploadFileIntoFolderAsync<ApiResponseBasic>(selectedFile, [
        {
          folderId: selectedId,
        },
      ])
        .then(res => {
          WriteLogTable({
            data: res,
            groupTitle: 'Response from API handleUpload',
          })
          if (res?.status) {
            setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
            if (formDialogRef.current) {
              formDialogRef.current?.onCloseDialog?.()
            }
            if (selectedId) {
              void getFoldersContainsFolder(selectedId as string)
            } else {
              void getFolders()
            }
          } else {
            setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          }
        })
        .catch(err => {
          WriteLogTable({
            data: err,
            groupTitle: 'Response from API handleUpload',
          })
        })
        .finally(() => {
          onLoading(false)
        })
    }
  }

  /**
   * Opens the form upload dialog if the formDialogRef is not null.
   *
   * @return {void}
   */
  const handleOpenFormUpload = () => {
    if (formDialogRef.current) {
      formDialogRef.current?.onOpenDialog?.(true)
    }
  }

  /**
   * Deletes a folder by its ID.
   *
   * @param {string} folderId - The ID of the folder to be deleted.
   * @return {Promise<void>} A promise that resolves when the folder is deleted.
   */
  const onDelete = async (folderId: string) => {
    onLoading(true)
    await DeleteFileOrFolderAsync<ApiResponseBasic>({ folderId: folderId })
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onDelete',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          if (selectedId) {
            void getFoldersContainsFolder(selectedId as string)
          } else {
            void getFolders()
          }
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onDelete',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  /**
   * Retrieves a list of Google Drive folders and updates the state with the retrieved data.
   *
   * @return {Promise<void>} A promise that resolves when the folders have been retrieved and the state has been updated.
   */
  const getFolders = async () => {
    const folders: GoogleDriveFoldersProps[] = []
    onLoading(true)
    await GetFolders()
      .then(res => {
        const items: ApiResponseProps<GoogleDriveFoldersProps[]> = res as ApiResponseProps<GoogleDriveFoldersProps[]>
        if (items?.status) {
          if (items?.data && items?.data?.length !== 0) {
            items?.data?.map((item: GoogleDriveFoldersProps) => {
              folders.push({
                id: item?.id,
                name: item?.name,
                size: item?.size,
                createdTime: item?.createdTime,
                parents: item?.parents,
                mimeType: item?.mimeType,
              })
            })
            setFolders(folders)
            setGoogleDriveBreadcrumbs([])
            setSelectedId('')
            WriteLogTable({
              data: items?.data,
              groupTitle: 'Response from API getFolders',
            })
          } else {
            setFolders([])
          }
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getFolders',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  /**
   * Retrieves folders that contain a specific folder.
   *
   * @param {string} folderId - The ID of the folder to search for.
   * @return {Promise<void>} A promise that resolves when the folders are retrieved.
   */
  const getFoldersContainsFolder = async (folderId: string) => {
    const folders: GoogleDriveFoldersProps[] = []
    const params: GoogleDriveFoldersContainsFolderReq = {
      folderId: folderId,
    }
    onLoading(true)
    await GetFoldersContainFolders(params)
      .then(res => {
        const items: ApiResponseProps<GoogleDriveFoldersProps[]> = res as ApiResponseProps<GoogleDriveFoldersProps[]>
        if (items?.status) {
          if (items?.data && items?.data?.length !== 0) {
            items?.data?.map((item: GoogleDriveFoldersProps) => {
              folders.push({
                id: item?.id,
                name: item?.name,
                size: item?.size,
                createdTime: item?.createdTime,
                parents: item?.parents,
                mimeType: item?.mimeType,
                fileExtension: item?.fileExtension,
                thumbnailLink: item?.thumbnailLink,
                webContentLink: item?.webContentLink,
                webViewLink: item?.webViewLink,
                trashed: item?.trashed,
              })
            })
            setFolders(folders)
            WriteLogTable({
              data: items?.data,
              groupTitle: 'Response from API getFolders',
            })
          } else {
            setFolders([])
          }
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getFolders',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  /**
   * Asynchronously revokes the token and handles the response.
   *
   * @return {Promise<void>} A promise that resolves when the token has been revoked and the state has been updated.
   */

  const onRevokeTokenAsync = async () => {
    onLoading(true)
    await RevokeTokenAsync<ApiResponseBasic>()
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateFolderAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
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

  /**
   * Renders a responsive toolbar with various buttons and a menu.
   *
   * @return {JSX.Element} The rendered toolbar.
   */
  const renderToolbarResponsive = () => {
    return (
      <>
        <Stack sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} direction='row' spacing={1} mb={2} divider={<Divider orientation='vertical' flexItem />}>
          <Button variant='outlined' size='small' onClick={handleCreateFolderAndClose} startIcon={<CreateNewFolderIcon />}>
            {t('googleDrive:menuContext.createFolder')}
          </Button>
          <Button disabled={!selectedId} variant='outlined' size='small' onClick={handleOpenFormUpload} startIcon={<CloudUploadIcon />}>
            {t('common:googleDriveDialog.buttons.uploadFile')}
          </Button>
          <Button variant='outlined' size='small' onClick={onRevokeTokenAsync} startIcon={<UsbOffIcon />}>
            {t('googleDrive:disconnect')}
          </Button>
        </Stack>

        <Stack sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} direction='row' spacing={1} mb={2}>
          <Button variant='outlined' size='small' onClick={handleOpenToolbar} startIcon={<BuildCircleIcon />}>
            {t('common:toolbar')}
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseToolbar}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleCreateFolderAndClose}>
              <CreateNewFolderIcon sx={{ mr: 1 }} />
              {t('googleDrive:menuContext.createFolder')}
            </MenuItem>
            <Divider />
            <MenuItem disabled={!selectedId} onClick={handleOpenFormUpload}>
              <CloudUploadIcon sx={{ mr: 1 }} />
              {t('common:googleDriveDialog.buttons.uploadFile')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={onRevokeTokenAsync}>
              <UsbOffIcon />
              {t('googleDrive:disconnect')}
            </MenuItem>
          </Menu>
        </Stack>
      </>
    )
  }

  /**
   * Renders the context menu item based on the mimeType of the selected context item.
   *
   * @return {JSX.Element} The JSX element representing the context menu item.
   */
  const renderContextMenuItem = () => {
    switch (contextMenuItemSelected?.mimeType) {
      case 'application/vnd.google-apps.folder':
        return (
          <Box>
            <MenuItem onClick={handleCloseContextMenuCreateSubFolder}>
              <ListItemIcon>
                <CreateNewFolderIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.createFolder')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteAndClose}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.deleteFolder')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseContextMenu}>
              <ListItemIcon>
                <FileUploadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.uploadFile')}</ListItemText>
            </MenuItem>
          </Box>
        )
      case 'image/jpeg':
        return (
          <Box>
            <MenuItem onClick={handleViewFile}>
              <ListItemIcon>
                <RemoveRedEyeIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.viewFile')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteAndClose}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.deleteFile')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseContextMenu}>
              <ListItemIcon>
                <DownloadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.downloadFile')}</ListItemText>
            </MenuItem>
          </Box>
        )
      case 'image/png':
        return (
          <Box>
            <MenuItem onClick={handleViewFile}>
              <ListItemIcon>
                <RemoveRedEyeIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.viewFile')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleDeleteAndClose}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.deleteFile')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseContextMenu}>
              <ListItemIcon>
                <DownloadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.downloadFile')}</ListItemText>
            </MenuItem>
          </Box>
        )
      default:
        return (
          <Box>
            <MenuItem onClick={handleDeleteAndClose}>
              <ListItemIcon>
                <DeleteIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.deleteFile')}</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleCloseContextMenu}>
              <ListItemIcon>
                <DownloadIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('googleDrive:menuContext.downloadFile')}</ListItemText>
            </MenuItem>
          </Box>
        )
    }
  }

  /**
   * Renders a context menu component.
   *
   * @return {JSX.Element} The rendered context menu component.
   */

  const renderContextMenu = () => {
    return (
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference='anchorPosition'
        anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      >
        {renderContextMenuItem()}
      </Menu>
    )
  }

  /**
   * Renders a table row component for displaying Google Drive folder information.
   *
   * @param {GoogleDriveFoldersProps} row - The row representing the Google Drive folder.
   * @return {JSX.Element} The rendered table row component.
   */
  const renderTableRow = (row: GoogleDriveFoldersProps) => {
    if (row) {
      return (
        <TableRow key={row?.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
          <TableCell component='th' scope='row' onContextMenu={event => handleContextMenu(event, row)} sx={{ cursor: 'context-menu' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <Box mr={1}>{GoogleDriveMimeTypeMapping(row?.mimeType as string)}</Box>
              <Box sx={{ cursor: 'pointer' }} onClick={() => handleGotoSubFolders(row)}>
                {row?.name}
              </Box>
            </Box>
          </TableCell>
          <TableCell align='center' onContextMenu={event => handleContextMenu(event, row)} sx={{ cursor: 'context-menu' }}>
            {row?.size ? FormatFileSize(row?.size as number) : '-'}
          </TableCell>
          <TableCell align='right' onContextMenu={event => handleContextMenu(event, row)} sx={{ cursor: 'context-menu' }}>
            {row?.createdTime ? moment(row.createdTime).format('MMM DD,YYYY') : '-'}
          </TableCell>
        </TableRow>
      )
    } else {
      return (
        <TableRow>
          <Typography>No data</Typography>
        </TableRow>
      )
    }
  }

  useEffect(() => {
    const updatedBreadcrumbs = _.cloneDeep(googleDriveBreadcrumbs)
    const index = _.findIndex(updatedBreadcrumbs, { id: selectedId })
    if (index !== -1) {
      _.forEach(updatedBreadcrumbs, (item, i) => {
        item.isActive = i === index
      })
    }
    setGoogleDriveBreadcrumbs(updatedBreadcrumbs)
  }, [selectedId])

  return (
    <Box component='section' sx={{ mt: 0 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs separator='›' aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Button onClick={getFolders}>{t('googleDrive:title')}</Button>
        {googleDriveBreadcrumbs?.map((item: GoogleDriveBreadcrumbs) => {
          if (item?.isActive) {
            return <Typography key={item?.id}>{item?.name}</Typography>
          } else {
            return (
              <Button key={item?.id} onClick={() => handleBreadcrumbsClick(item?.id as string, item)}>
                {item?.name}
              </Button>
            )
          }
        })}
      </Breadcrumbs>

      {/* Toolbar */}
      {renderToolbarResponsive()}

      {/* Context Menu */}
      {renderContextMenu()}

      <TableContainer component={Paper}>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>{t('googleDrive:dataGrid.headers.name')}</TableCell>
              <TableCell align='center'>{t('googleDrive:dataGrid.headers.fileSize')}</TableCell>
              <TableCell align='right'>{t('googleDrive:dataGrid.headers.createdTime')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{folders?.map((row: GoogleDriveFoldersProps) => renderTableRow(row))}</TableBody>
        </Table>
      </TableContainer>

      {/* Create Folder Form */}
      <GoogleDriveForm
        ref={googleFormRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReloadData={getFolders}
        onReloadDataSubFolder={handleCreateSubFolderAndReloadData}
        onCloseModalAfterSubmit={() => setIsOpen(false)}
        onResetState={() => {
          setContextMenuItemSelected(null)
          setSelectedId('')
        }}
        folderId={contextMenuItemSelected?.id}
        folderName={contextMenuItemSelected?.name}
      />

      {/* Upload Form */}
      <FormDialog
        ref={formDialogRef}
        onConfirm={handleUpload}
        dialogTitle={t('common:dialog.uploadFileTitle') as string}
        isDisable={!selectedFile}
        isShowCancelButton
        dialogContent={t('common:dialog.uploadFileContent')}
      >
        <UploadFile GetFile={(file: File) => setSelectedFile(file)} />
      </FormDialog>

      {/* View File */}
      <FormDialog
        ref={formDialogViewFileRef}
        onConfirm={() => {
          if (formDialogViewFileRef.current) {
            formDialogViewFileRef.current?.onCloseDialog?.()
          }
        }}
        buttonOkText={t('common:buttons.ok')}
        dialogTitle={t('common:dialog.viewFile') as string}
        isShowCancelButton={false}
      >
        <Box justifyContent={'center'} alignItems={'center'} alignContent={'center'} alignSelf={'center'}>
          {contextMenuItemSelected && contextMenuItemSelected?.thumbnailLink && <img src={contextMenuItemSelected?.thumbnailLink} />}
        </Box>
      </FormDialog>

      {/* Alert Dialog */}
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={openDeleteAlertDialog.isConfirm}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
        }}
      />
    </Box>
  )
}

export default GoogleDrive
