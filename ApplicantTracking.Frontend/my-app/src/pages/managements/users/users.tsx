import AddIcon from '@mui/icons-material/Add'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import BuildCircleIcon from '@mui/icons-material/BuildCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SearchIcon from '@mui/icons-material/Search'
import { Box, Breadcrumbs, Button, Divider, IconButton, Link, Menu, MenuItem, OutlinedInput, Pagination, Stack, Typography } from '@mui/material'
import { DataGrid, GridActionsCellItem, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { RouteName } from '../../../app/routes/routerConfig'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { AlertDialog } from '../../../components/core'
import { ApiPagingRequest, DialogProps, SortProps, UsersDataGirdProps, UsersProps } from '../../../data-type'
import { ApiResponseBasic, ApiResponsePagingProps } from '../../../data-type/apiResponse/apiResponseProps'
import { DeleteUserAsync, GetUsersPaging } from '../../../services'
import { WriteLogTable } from '../../../utils/helper'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const Users = () => {
  const { t } = useTranslation()
  const { onLoading } = useLoadingOverlay()
  const [loading, setLoading] = useState<boolean>(false)
  const [UsersData, setUsersData] = useState<UsersProps[]>([])
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(1)
  const [totalCount, setTotalCount] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [keywordValue, setKeywordValue] = useState<string>('')
  const [remoteSortGrid, setRemoteSortGird] = useState<SortProps>()
  const [rowsSelected, setRowsSelected] = useState<UsersProps[]>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '', isConfirm: true })
  const navigate = useNavigate()
  const open = Boolean(anchorEl)

  const ButtonCreate = withComponentPermissionModule(Button, ModuleConfig.USER, [PermissionConfig.Create])
  const ButtonDelete = withComponentPermissionModule(Button, ModuleConfig.USER, [PermissionConfig.Delete])
  const MenuItemCreate = withComponentPermissionModule(MenuItem, ModuleConfig.USER, [PermissionConfig.Create])
  const MenuItemDelete = withComponentPermissionModule(MenuItem, ModuleConfig.USER, [PermissionConfig.Delete])

  const pageSize = 10

  const columns: GridColDef[] = [
    { field: 'userName', headerName: t('users:dataGrid.headers.userName'), width: 250 },
    { field: 'email', headerName: t('users:dataGrid.headers.email'), width: 250 },
    {
      field: 'isActive',
      headerName: t('users:dataGrid.headers.status'),
      sortable: false,
      width: 160,
      valueGetter: (_value, row) => `${row?.isActive ? t('common:active') : t('common:deActive')}`,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('users:dataGrid.headers.actions'),
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
              navigate(RouteName.FormUsers, {
                state: {
                  id,
                },
              })
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
    navigate(RouteName.FormUsers)
  }

  const handleDeleteAndClose = () => {
    setAnchorEl(null)
    setOpenDeleteAlertDialog({ isConfirm: true, open: true, content: t('common:dialog.confirmContent', { name: `[${rowsSelected.map(r => r?.userName).join(', ')}]` }) })
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

  const onDelete = async () => {
    const ids = rowsSelected.map(r => r?.id)
    onLoading(true)
    await DeleteUserAsync<ApiResponseBasic>({ Ids: ids as number[] })
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
    if (UsersData && UsersData.length !== 0) {
      const selectedRows = UsersData.filter((row: UsersProps) => selectedIDs.has(row?.id as number))
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

          {renderRemoveButton()}

          <Box sx={{ display: 'flex' }}>
            <OutlinedInput sx={{ ml: 1, width: '40ch' }} size='small' placeholder={t('Users:searchPlaceholder')} value={keywordValue} onChange={e => setKeywordValue(e.target.value)} />
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
            {renderMenuItemRemoveButton()}
            <MenuItem>
              <OutlinedInput sx={{ ml: 1 }} size='small' placeholder={t('Users:searchPlaceholder')} value={keywordValue} onChange={e => setKeywordValue(e.target.value)} />
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
    const rows: UsersDataGirdProps[] = []
    const params: ApiPagingRequest = {
      pageNumber: pageNumber,
      pageSize: pageSize,
      sidx: remoteSortGrid?.field,
      sortv: remoteSortGrid?.sort,
      keywords: keyword,
    }
    setLoading(true)
    await GetUsersPaging(params)
      .then(res => {
        const items: ApiResponsePagingProps<UsersProps[]> = res as ApiResponsePagingProps<UsersProps[]>
        if (items?.status) {
          setTotalPage(items?.data?.totalPages ?? 1)
          setTotalCount(items?.data?.totalCounts ?? 1)
          if (items?.data && items?.data?.records?.length !== 0) {
            items?.data?.records?.map((item: UsersDataGirdProps) => {
              rows.push({
                id: item?.id,
                userName: item?.userName,
                email: item?.email ?? '-',
                isActive: item?.isActive,
              })
            })
            WriteLogTable({
              data: items?.data?.records,
              groupTitle: 'Response from API GetUsersPaging',
            })
            setUsersData(rows)
          } else {
            setUsersData([])
          }
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    void fetchData()
    document.title = t('users:title')
  }, [pageNumber, remoteSortGrid, keyword])

  return (
    <Box component='section'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link component={RouterLink} underline='hover' color='inherit' to={RouteName.Home}>
          {t('common:menuTop.home')}
        </Link>
        <Typography color='text.primary'>{t('common:menuTop.users')}</Typography>
      </Breadcrumbs>

      {renderToolbarResponsive()}

      <DataGrid
        rows={UsersData}
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

      <AlertDialog
        isConfirm={openDeleteAlertDialog.isConfirm}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        onOk={() => setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })}
      />
    </Box>
  )
}

export default Users
