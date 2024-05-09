import AddIcon from '@mui/icons-material/Add'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import PublishIcon from '@mui/icons-material/Publish'
import { Box, Breadcrumbs, Button, Divider, IconButton, Link, Menu, MenuItem, OutlinedInput, Pagination, Stack, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { Fragment, createRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { RouteName } from '../../../app/routes/routerConfig'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { AlertDialog, FormDialog, UploadFile } from '../../../components/core'
import { ApiPagingRequest, DialogProps, PermissionsDataGirdProps, PermissionSortProps, PermissionsProps } from '../../../data-type'
import { ApiResponseBasic, ApiResponsePagingProps } from '../../../data-type/apiResponse/apiResponseProps'
import { WriteLogTable } from '../../../utils/helper'
import { DeletePermissionsAsync, GetPermissionsPaging, ImportExcelAsync } from '../../../services'
import { IFormDialog } from '../../../interfaces'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const Permissions = () => {
  const { t } = useTranslation()
  const { onLoading } = useLoadingOverlay()
  const [loading, setLoading] = useState<boolean>(false)
  const [permissionsData, setPermissionsData] = useState<PermissionsProps[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [keywordValue, setKeywordValue] = useState<string>('')
  const [remoteSortGrid, setRemoteSortGird] = useState<PermissionSortProps>()
  const [rowsSelected, setRowsSelected] = useState<PermissionsProps[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '', isConfirm: true })
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const formDialogRef = createRef<IFormDialog>()

  const ButtonCreate = withComponentPermissionModule(Button, ModuleConfig.PERMISSION, [PermissionConfig.Create])
  const ButtonImportExcel = withComponentPermissionModule(Button, ModuleConfig.PERMISSION, [PermissionConfig.ImportExcel])
  const ButtonDelete = withComponentPermissionModule(Button, ModuleConfig.PERMISSION, [PermissionConfig.Delete])
  const MenuItemDelete = withComponentPermissionModule(MenuItem, ModuleConfig.PERMISSION, [PermissionConfig.Delete])
  const MenuItemCreate = withComponentPermissionModule(MenuItem, ModuleConfig.PERMISSION, [PermissionConfig.Create])
  const MenuItemImportExcel = withComponentPermissionModule(MenuItem, ModuleConfig.PERMISSION, [PermissionConfig.ImportExcel])

  const pageSize = 10

  const columns: GridColDef[] = [
    { field: 'code', headerName: t('permission:dataGrid.headers.code'), width: 130 },
    { field: 'name', headerName: t('permission:dataGrid.headers.name'), width: 130 },
    { field: 'serviceName', headerName: t('permission:dataGrid.headers.serviceName'), width: 130 },
    { field: 'moduleName', headerName: t('permission:dataGrid.headers.moduleName'), width: 130 },
    { field: 'buttonId', headerName: t('permission:dataGrid.headers.buttonId'), width: 130 },
    { field: 'lang', headerName: t('permission:dataGrid.headers.lang'), width: 130 },
    {
      field: 'isActive',
      headerName: t('permission:dataGrid.headers.status'),
      sortable: false,
      width: 160,
      valueGetter: (_value, row) => `${row?.isActive ? t('common:active') : t('common:deActive')}`,
    },
    { field: 'description', headerName: t('permission:dataGrid.headers.description'), width: 130, sortable: false },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('permission:dataGrid.headers.actions'),
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={'edit'}
            icon={<EditIcon />}
            label='Save'
            sx={{
              color: 'primary.main',
            }}
            onClick={() => {
              navigate(RouteName.FormPermissions, {
                state: {
                  id,
                },
              })
              console.log('Id : ', id)
            }}
          />,
        ]
      },
    },
  ]

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleRefreshAndClose = () => {
    setAnchorEl(null)
    onReloadData()
  }

  const handleAddNewAndClose = () => {
    setAnchorEl(null)
    navigate(RouteName.FormPermissions)
  }

  const handleDeleteAndClose = () => {
    setAnchorEl(null)
    setOpenDeleteAlertDialog({ isConfirm: true, open: true, content: t('common:dialog.confirmContent', { name: `[${rowsSelected.map(r => r?.name).join(', ')}]` }) })
  }

  const handleConfirm = async () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
    setRowsSelected([])
    await onDelete()
  }

  const handleCancel = () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
    setRowsSelected([])
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSearch = () => {
    setKeyword(keywordValue)
  }

  const handleImport = async () => {
    if (selectedFile) {
      console.log('Import file:', selectedFile)
      onLoading(true)
      await ImportExcelAsync<ApiResponseBasic>(selectedFile)
        .then(res => {
          WriteLogTable({
            data: res,
            groupTitle: 'Response from API handleUpload',
          })
          if (res?.status) {
            setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
            onReloadData()
            if (formDialogRef.current) {
              formDialogRef.current?.onCloseDialog?.()
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

  const handleOpenFormUpload = () => {
    if (formDialogRef.current) {
      formDialogRef.current?.onOpenDialog?.(true)
    }
  }

  const onDelete = async () => {
    const ids = rowsSelected.map(r => r?.id)
    onLoading(true)
    await DeletePermissionsAsync<ApiResponseBasic>({ Ids: ids as number[] })
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          onReloadData()
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onCreateAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onReloadData = () => {
    setRemoteSortGird({ field: '', sort: '' })
    setKeyword('')
  }

  const onRowsSelectionHandler = (ids: GridRowSelectionModel) => {
    const selectedIDs = new Set(ids)
    if (permissionsData && permissionsData.length !== 0) {
      const selectedRows = permissionsData.filter((row: PermissionsProps) => selectedIDs.has(row?.id as number))
      setRowsSelected(selectedRows)
    }
  }

  const renderRemoveButton = () => {
    if (rowsSelected && rowsSelected.length !== 0) {
      return (
        <ButtonDelete variant='outlined' size='small' onClick={handleDeleteAndClose}>
          <DeleteIcon />
          {t('common:actions.delete')}
        </ButtonDelete>
      )
    }
  }

  const renderMenuItemRemoveButton = () => {
    if (rowsSelected && rowsSelected.length !== 0) {
      return (
        <MenuItemDelete onClick={handleDeleteAndClose}>
          <DeleteIcon sx={{ mr: 1 }} />
          {t('common:actions.delete')}
        </MenuItemDelete>
      )
    }
  }

  const renderToolbarResponsive = () => {
    return (
      <Fragment>
        <Stack sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} direction='row' spacing={1} mb={2} divider={<Divider orientation='vertical' flexItem />}>
          <ButtonCreate variant='outlined' size='small' onClick={handleAddNewAndClose}>
            <AddIcon />
            {t('common:actions.add')}
          </ButtonCreate>

          <Button variant='outlined' size='small' onClick={fetchData}>
            <AutorenewIcon />
            {t('common:actions.refresh')}
          </Button>

          <ButtonImportExcel variant='outlined' size='small' onClick={handleOpenFormUpload}>
            <PublishIcon />
            {t('common:actions.importExcel')}
          </ButtonImportExcel>

          {renderRemoveButton()}

          <Box sx={{ display: 'flex' }}>
            <OutlinedInput sx={{ ml: 1, width: '40ch' }} size='small' placeholder={t('permission:searchPlaceholder')} value={keywordValue} onChange={e => setKeywordValue(e.target.value)} />
            <IconButton onClick={handleSearch} type='button' sx={{ p: '10px' }} aria-label='search'>
              <SearchIcon />
            </IconButton>
          </Box>
        </Stack>

        <Stack sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }} direction='row' spacing={1} mb={2}>
          <Button variant='outlined' size='small' onClick={handleClick}>
            <BuildCircleIcon sx={{ mr: 1 }} />
            {t('common:toolbar')}
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItemCreate onClick={handleAddNewAndClose}>
              <AddIcon sx={{ mr: 1 }} />
              {t('common:actions.add')}
            </MenuItemCreate>
            <Divider />
            <MenuItem onClick={handleRefreshAndClose}>
              <AutorenewIcon sx={{ mr: 1 }} />
              {t('common:actions.refresh')}
            </MenuItem>
            <Divider />
            <MenuItemImportExcel onClick={handleOpenFormUpload}>
              <PublishIcon sx={{ mr: 1 }} />
              {t('common:actions.importExcel')}
            </MenuItemImportExcel>
            <Divider />
            {renderMenuItemRemoveButton()}
            <MenuItem>
              <OutlinedInput sx={{ ml: 1 }} size='small' placeholder={t('permission:searchPlaceholder')} value={keywordValue} onChange={e => setKeywordValue(e.target.value)} />
              <IconButton onClick={handleSearch} type='button' sx={{ p: '10px' }} aria-label='search'>
                <SearchIcon />
              </IconButton>
            </MenuItem>
          </Menu>
        </Stack>
      </Fragment>
    )
  }

  const fetchData = async () => {
    const rows: PermissionsDataGirdProps[] = []
    const params: ApiPagingRequest = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      sidx: remoteSortGrid?.field,
      sortv: remoteSortGrid?.sort,
      keywords: keyword,
    }
    setLoading(true)
    await GetPermissionsPaging(params)
      .then(res => {
        const items: ApiResponsePagingProps<PermissionsProps[]> = res as ApiResponsePagingProps<PermissionsProps[]>
        if (items?.status) {
          setTotalPage(items?.data?.totalPages ?? 1)
          setTotalCount(items?.data?.totalCounts ?? 1)
          if (items?.data && items?.data?.records?.length !== 0) {
            items?.data?.records?.map((item: PermissionsDataGirdProps) => {
              rows.push({
                id: item?.id,
                code: item?.code,
                name: item?.name,
                moduleName: item?.moduleName,
                serviceName: item?.serviceName,
                buttonId: item?.buttonId,
                lang: item?.lang,
                description: item?.description ?? '-',
                isActive: item?.isActive,
              })
            })
            setPermissionsData(rows)
          } else {
            setPermissionsData([])
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    void fetchData()
    document.title = t('permission:title')
  }, [pageNumber, remoteSortGrid, keyword])

  return (
    <Box component='section'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link component={RouterLink} underline='hover' color='inherit' to={RouteName.Home}>
          {t('common:menuTop.home')}
        </Link>
        <Typography color='text.primary'>{t('common:menuTop.permissions')}</Typography>
      </Breadcrumbs>

      {renderToolbarResponsive()}

      <DataGrid
        rows={permissionsData}
        columns={columns}
        loading={loading}
        hideFooterPagination={true}
        hideFooter={true}
        checkboxSelection
        onSortModelChange={newSortModel => {
          if (newSortModel && newSortModel.length !== 0) {
            const sortModelItem = newSortModel[0]
            setRemoteSortGird({
              field: sortModelItem.field,
              sort: sortModelItem.sort as string,
            })
          }
        }}
        onRowSelectionModelChange={(rowSelected: GridRowSelectionModel) => {
          onRowsSelectionHandler(rowSelected)
        }}
        rowSelectionModel={rowsSelected.map(item => item.id) as GridRowId[]}
        autoHeight
      />

      <Box mt={1} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Stack direction='row' spacing={2} divider={<Divider orientation='vertical' flexItem />}>
          <Pagination count={totalPage} variant='outlined' shape='rounded' onChange={(_, value) => setPageNumber(value)} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography>{t('common:pagination.totalRows', { totalRows: totalCount })}</Typography>
          </Box>
        </Stack>
      </Box>

      {/* Upload Form */}
      <FormDialog
        ref={formDialogRef}
        onConfirm={handleImport}
        dialogTitle={t('common:dialog.importExcelTitle') as string}
        isDisable={!selectedFile}
        isShowCancelButton
        dialogContent={t('common:dialog.importExcelContent')}
      >
        <UploadFile GetFile={(file: File) => setSelectedFile(file)} />
      </FormDialog>

      <AlertDialog
        isConfirm={openDeleteAlertDialog.isConfirm}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
          if (formDialogRef.current) {
            formDialogRef.current?.onCloseDialog?.()
          }
        }}
      />
    </Box>
  )
}

export default Permissions
