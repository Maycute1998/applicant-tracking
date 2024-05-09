import { Box, Breadcrumbs, Button, Grid, Link, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router-dom'
import { RouteName } from '../../../app/routes/routerConfig'
import { AlertDialog, DropdownList, SelectLanguage } from '../../../components/core'
import { useEffect, useState } from 'react'
import {
  ModulesProps,
  DropdownOptions,
  ApiResponseProps,
  ServicesProps,
  PermissionInGroupProps,
  PermissionReqRoleAndModuleProps,
  RolesProps,
  ApiResponseBasic,
  PermissionInGroupFormData,
  DialogProps,
  PermissionReqRoleAndModuleWithSearchProps,
} from '../../../data-type'
import { useLoadingOverlay } from '../../../app/stores/systems'
import {
  GetServices,
  GetModuleByServiceId,
  GetPermissionNotInGroupPermissionByModuleIdAsync,
  GetPermissionInGroupsAsync,
  GetRoles,
  CreatePermissionInGroupAsync,
  DeletePermissionInGroupAsync,
} from '../../../services'
import { WriteLog, WriteLogTable } from '../../../utils/helper'
import FolderIcon from '@mui/icons-material/Folder'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'
import { DataGrid, GridColDef, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid'
import { useLanguage } from '../../../hooks'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const PermissionInGroup = () => {
  const { t } = useTranslation()
  const { onLoading } = useLoadingOverlay()
  const languages = useLanguage()
  const [modules, setModules] = useState<ModulesProps[]>([])
  const [services, setServices] = useState<DropdownOptions[]>([])
  const [roles, setRoles] = useState<DropdownOptions[]>([])
  const [permissionInGroups, setPermissionInGroups] = useState<PermissionInGroupProps[]>([])
  const [permissionNotInGroups, setPermissionNotInGroups] = useState<PermissionInGroupProps[]>([])
  const [selectedModuleId, setSelectedModuleId] = useState<number>(0)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(0)
  const [selectedLanguageValue, setSelectedLanguageValue] = useState<string>('vi-VN')
  const [rowsPermissionInGroupSelected, setRowsPermissionInGroupSelected] = useState<PermissionInGroupProps[]>([])
  const [rowsPermissionNotInGroupSelected, setRowsPermissionNotInGroupSelected] = useState<PermissionInGroupProps[]>([])
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })

  const ButtonCreate = withComponentPermissionModule(Button, ModuleConfig.ACCESS_CONTROL, [PermissionConfig.Create])
  const ButtonDelete = withComponentPermissionModule(Button, ModuleConfig.ACCESS_CONTROL, [PermissionConfig.Delete])

  const columns: GridColDef[] = [{ field: 'name', flex: 1, resizable: false, headerName: t('permission:dataGrid.headers.name'), minWidth: 150 }]

  const handleSelectModule = (item: ModulesProps) => {
    setSelectedModuleId(item?.id as number)
  }

  const onCreateAsync = async () => {
    const paramPermissionIds: number[] = []
    if (rowsPermissionNotInGroupSelected && rowsPermissionNotInGroupSelected.length !== 0) {
      paramPermissionIds.push(...rowsPermissionNotInGroupSelected.map(item => item?.id as number))
    }
    onLoading(true)
    const formData: PermissionInGroupFormData = {
      permissionIds: paramPermissionIds,
      roleId: selectedRoleId,
      lang: selectedLanguageValue ?? 'vi-VN',
    }
    await CreatePermissionInGroupAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
          setRowsPermissionNotInGroupSelected([])
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
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

  const onRemoveAsync = async () => {
    const ids = rowsPermissionInGroupSelected.map(r => r?.id)
    onLoading(true)
    await DeletePermissionInGroupAsync<ApiResponseBasic>({ Ids: ids as number[] })
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onRemoveAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
          setRowsPermissionInGroupSelected([])
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onRemoveAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onRowsSelectionPermissionInGroupHandler = (ids: GridRowSelectionModel) => {
    const selectedIDs = new Set(ids)
    if (permissionInGroups && permissionInGroups.length !== 0) {
      const selectedRows = permissionInGroups.filter((row: PermissionInGroupProps) => selectedIDs.has(row?.id as number))
      setRowsPermissionInGroupSelected(selectedRows)
    }
  }

  const onRowsSelectionPermissionNotInGroupHandler = (ids: GridRowSelectionModel) => {
    const selectedIDs = new Set(ids)
    if (permissionNotInGroups && permissionNotInGroups.length !== 0) {
      const selectedRows = permissionNotInGroups.filter((row: PermissionInGroupProps) => selectedIDs.has(row?.id as number))
      setRowsPermissionNotInGroupSelected(selectedRows)
    }
  }

  const getPermissions = async () => {
    onLoading(true)
    const params: PermissionReqRoleAndModuleProps = {
      moduleId: selectedModuleId,
      roleId: selectedRoleId,
    }
    onLoading(true)
    try {
      const permissionInGroupPromise = await getPermissionInGroup(params)
      const permissionNotInGroupPromise = await getPermissionNotInGroup(params)
      const [permissionInGroupRes, permissionNotInGroupRes] = await Promise.all([permissionInGroupPromise, permissionNotInGroupPromise])
      setPermissionInGroups(permissionInGroupRes)
      setPermissionNotInGroups(permissionNotInGroupRes)
    } catch (err) {
      WriteLog({
        data: err,
        groupTitle: 'Response from API getPermissions',
      })
    } finally {
      onLoading(false)
    }
  }

  const getPermissionInGroup = async (params: PermissionReqRoleAndModuleWithSearchProps) => {
    const rows: PermissionInGroupProps[] = []
    await GetPermissionInGroupsAsync(params)
      .then(res => {
        const items: ApiResponseProps<PermissionInGroupProps[]> = res as ApiResponseProps<PermissionInGroupProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map(item => {
              rows.push({
                id: item?.id,
                name: item?.name,
              })
            })
          }
          WriteLogTable({
            groupTitle: 'Response from API getServices',
            data: items.data,
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API getServices',
          data: err,
        })
      })
    return rows
  }

  const getPermissionNotInGroup = async (params: PermissionReqRoleAndModuleProps) => {
    const rows: PermissionInGroupProps[] = []
    await GetPermissionNotInGroupPermissionByModuleIdAsync(params)
      .then(res => {
        const items: ApiResponseProps<PermissionInGroupProps[]> = res as ApiResponseProps<PermissionInGroupProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map(item => {
              rows.push({
                id: item?.id,
                name: item?.name,
              })
            })
          }
          WriteLogTable({
            groupTitle: 'Response from API getServices',
            data: items.data,
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API getServices',
          data: err,
        })
      })
    return rows
  }

  const getAllDropdownlistFropApi = async () => {
    onLoading(true)
    try {
      const listRoles = await getRoles()
      const listService = await getServices()
      const [listRolesRes, listServiceRes] = await Promise.all([listRoles, listService])
      setServices(listServiceRes)
      setRoles(listRolesRes)
    } catch (err) {
      WriteLog({
        data: err,
        groupTitle: 'Response from API getPermissions',
      })
    } finally {
      onLoading(false)
    }
  }

  const getRoles = async () => {
    const rows: DropdownOptions[] = []
    await GetRoles()
      .then(res => {
        const items: ApiResponseProps<RolesProps[]> = res as ApiResponseProps<RolesProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map(item => {
              rows.push({
                label: item?.name as string,
                value: item?.id as number,
              })
            })
          }
          WriteLogTable({
            groupTitle: 'Response from API getRoles',
            data: items.data,
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API getRoles',
          data: err,
        })
      })
    return rows
  }

  const getServices = async () => {
    const rows: DropdownOptions[] = []
    await GetServices()
      .then(res => {
        const items: ApiResponseProps<ServicesProps[]> = res as ApiResponseProps<ServicesProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map(item => {
              rows.push({
                label: item?.name as string,
                value: item?.id as number,
              })
            })
          }
          WriteLogTable({
            groupTitle: 'Response from API getServices',
            data: items.data,
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API getServices',
          data: err,
        })
      })
    return rows
  }

  const getModuleByService = async (serviceId: number) => {
    const modules: ModulesProps[] = []
    const params = {
      serviceId: serviceId,
    }
    onLoading(true)
    await GetModuleByServiceId(params)
      .then(res => {
        const items: ApiResponseProps<ModulesProps[]> = res as ApiResponseProps<ModulesProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map((item: ModulesProps) => {
              modules.push({
                id: item?.id,
                label: item?.label,
                children: item?.children,
              })
            })
            setModules(modules)
          }
          WriteLogTable({
            groupTitle: 'Response from API getModules',
            data: items.data,
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API getModules',
          data: err,
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const renderTreeItem = (item: ModulesProps) => {
    if (item?.children && item?.children?.length !== 0) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'flex-start' }}>
              <FolderIcon fontSize='small' sx={{ mr: 1 }} />
              <Typography fontSize={13} variant='inherit'>
                {item?.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    } else {
      return (
        <Box onClick={() => handleSelectModule(item)} sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box flex={1} sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
              <FormatListBulletedIcon fontSize='small' sx={{ mr: 1 }} />
              <Typography variant='caption' fontSize={13}>
                {item?.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      )
    }
  }

  const renderTreeViewMenu = (items: ModulesProps[]) => {
    if (items && items.length !== 0) {
      return items.map(item => {
        return (
          <TreeItem2 key={item?.id?.toString()} itemId={item?.id?.toString() as string} label={renderTreeItem(item)}>
            {item?.children && renderTreeViewMenu(item?.children)}
          </TreeItem2>
        )
      })
    }
  }

  const renderTreeView = () => {
    return <SimpleTreeView>{renderTreeViewMenu(modules)}</SimpleTreeView>
  }

  useEffect(() => {
    void getAllDropdownlistFropApi()
  }, [])

  useEffect(() => {
    void getPermissions()
  }, [selectedModuleId, selectedRoleId])

  return (
    <Box component='section'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ mb: 2 }}>
        <Link component={RouterLink} underline='hover' color='inherit' to={RouteName.Home}>
          {t('common:menuTop.home')}
        </Link>
        <Typography color='text.primary'>{t('common:menuTop.permissionInGroup')}</Typography>
      </Breadcrumbs>

      <Grid container spacing={0.5} columns={12}>
        <Grid item xs={12} sm={2} md={2}>
          <Box>
            <DropdownList
              size='small'
              dataSource={roles}
              textFieldProps={{
                fullWidth: true,
                label: t('common:roles'),
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value }: any = event.target
                  setSelectedRoleId(value)
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <DropdownList
              size='small'
              dataSource={services}
              textFieldProps={{
                fullWidth: true,
                label: t('common:services'),
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value }: any = event.target
                  void getModuleByService(value)
                },
              }}
            />
          </Box>
          <Box sx={{ mt: 1 }}>{renderTreeView()}</Box>
          <Box sx={{ mt: 1 }}>
            <SelectLanguage
              dataSource={languages}
              size='small'
              defaultValue={'vi-VN'}
              textFieldProps={{
                label: t('common:language'),
                fullWidth: true,
                onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedLanguageValue(event.target.value)
                },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Box>
            <DataGrid
              disableColumnSorting
              disableColumnMenu
              rows={permissionInGroups}
              columns={columns}
              loading={false}
              hideFooterPagination={true}
              hideFooter={true}
              checkboxSelection
              onRowSelectionModelChange={(rowSelected: GridRowSelectionModel) => {
                onRowsSelectionPermissionInGroupHandler(rowSelected)
              }}
              rowSelectionModel={rowsPermissionInGroupSelected.map(item => item.id) as GridRowId[]}
              autoHeight
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={2} md={2}>
          <Box sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', border: '1px dashed grey' }}>
            <Box sx={{ flexDirection: 'column' }}>
              <Box sx={{ mt: 1 }}>
                {/* Remove Roles */}
                <ButtonDelete onClick={onRemoveAsync} disabled={rowsPermissionInGroupSelected && rowsPermissionInGroupSelected.length === 0} variant='outlined' size='small'>
                  <KeyboardDoubleArrowRightIcon fontSize='small' />
                </ButtonDelete>
              </Box>

              <Box sx={{ mb: 1, mt: 1 }}>
                {/* Add Roles */}
                <ButtonCreate onClick={onCreateAsync} disabled={rowsPermissionNotInGroupSelected && rowsPermissionNotInGroupSelected.length === 0} variant='outlined' size='small'>
                  <KeyboardDoubleArrowLeftIcon fontSize='small' />
                </ButtonCreate>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <Box>
            <DataGrid
              disableColumnSorting
              disableColumnMenu
              rows={permissionNotInGroups}
              columns={columns}
              loading={false}
              hideFooterPagination={true}
              hideFooter={true}
              checkboxSelection
              onRowSelectionModelChange={(rowSelected: GridRowSelectionModel) => {
                onRowsSelectionPermissionNotInGroupHandler(rowSelected)
              }}
              rowSelectionModel={rowsPermissionNotInGroupSelected.map(item => item.id) as GridRowId[]}
              autoHeight
            />
          </Box>
        </Grid>
      </Grid>

      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={false}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '' })
          void getPermissions()
        }}
      />
    </Box>
  )
}

export default PermissionInGroup
