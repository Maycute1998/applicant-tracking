import { yupResolver } from '@hookform/resolvers/yup'
import AccountCircle from '@mui/icons-material/AccountCircle'
import AddIcon from '@mui/icons-material/Add'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FolderIcon from '@mui/icons-material/Folder'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import HomeIcon from '@mui/icons-material/Home'
import LanguageIcon from '@mui/icons-material/Language'
import LoginIcon from '@mui/icons-material/Login'
import Logout from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView'
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2'
import { createRef, useEffect, useMemo, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Outlet, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { RouteName } from '../app/routes/routerConfig'
import { useAuth, useCustomTheme, useLoadingOverlay } from '../app/stores/systems'
import { AlertDialog, DrawerMenuLeft, DropdownTree, FormDialog, SelectLanguage } from '../components/core'
import { LocalStorageConfig, PermissionConfig, ModuleConfig } from '../constant'
import { ApiResponseAuth, ApiResponseAuthorize, ApiResponseBasic, ApiResponseProps, DialogProps, DropdownTreeProps, LanguageOptions, ModuleFormData, ModulesProps, ServicesProps } from '../data-type'
import { IFormDialog } from '../interfaces'
import { AuthorizeAsync, CreateModuleAsync, DeleteModuleAsync, GetModuleById, GetModules, GetServices, LogoutServiceAsync, UpdateModuleAsync } from '../services'
import { WriteLog, WriteLogTable } from '../utils/helper'
import { useLanguage } from '../hooks'
import { withComponentPermissionModule } from '../hocs/withComponentPermissionModule'

const drawerMinWidth = 240
const drawerMaxWidth = 350
const AdminLayout = () => {
  const theme = useTheme()
  const { t, i18n } = useTranslation()
  const { onToggleTheme } = useCustomTheme()
  const languagesOption = useLanguage()
  const { onLoading, state: loadingState } = useLoadingOverlay()
  const navigate = useNavigate()
  const { state: authState, onUnauthenticated, onAuthenticated } = useAuth()
  const [openDrawerLeft, setOpenDrawerLeft] = useState<boolean>(false)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '', isConfirm: false })
  const [anchorElMenuRight, setAnchorElMenuRight] = useState<null | HTMLElement>(null)
  const [anchorElAccount, setAnchorElAccount] = useState<null | HTMLElement>(null)
  const openAccount = Boolean(anchorElAccount)

  const openMenuRight = Boolean(anchorElMenuRight)
  const [language, setLanguage] = useState<string>('vi')
  const [languages, setLanguages] = useState<LanguageOptions[]>([])
  const [modules, setModules] = useState<ModulesProps[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(1)
  const [drawerWidth, setDrawerWidth] = useState<number>(drawerMinWidth)
  const [showToolbar, setShowToolbar] = useState<boolean>(false)
  const [moduleValue, setModuleValue] = useState<ModulesProps | null>(null)
  const [services, setServices] = useState<ServicesProps[]>([])
  const [titleModal, setTitleModal] = useState<string>('')
  const [selectedItemTree, setSelectedItemTree] = useState<DropdownTreeProps>()
  const [editMode, setEditMode] = useState<boolean>(false)
  const formDialogRef = createRef<IFormDialog>()

  const ButtonCreate = withComponentPermissionModule(Button, ModuleConfig.MODULE, [PermissionConfig.Create])
  const IconButtonCreateSubItem = withComponentPermissionModule(Button, ModuleConfig.MODULE, [PermissionConfig.Create])
  const IconButtonUpdate = withComponentPermissionModule(IconButton, ModuleConfig.MODULE, [PermissionConfig.Update])
  const IconButtonDelete = withComponentPermissionModule(IconButton, ModuleConfig.MODULE, [PermissionConfig.Delete])

  // #region [hook-form]
  const validationLocales = {
    code: {
      required: t('module:validations.required.code'),
    },
    name: {
      required: t('module:validations.required.name'),
    },
    serviceId: {
      required: t('module:validations.required.serviceId'),
    },
  }

  const schema = Yup.object().shape({
    code: Yup.string().label('code').trim().required(validationLocales.code.required),
    name: Yup.string().label('name').trim().required(validationLocales.name.required),
    serviceId: Yup.number().label('serviceId').required(validationLocales.serviceId.required),
  })

  const defaultFormValue: ModuleFormData = {
    serviceId: 0,
    parentId: undefined,
    code: '',
    name: '',
    description: '',
    isActive: true,
  }

  const {
    control,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<ModuleFormData>({
    mode: 'onChange',
    defaultValues: defaultFormValue,
    resolver: yupResolver(schema),
  })
  // #endregion

  // #region [handle-event]
  const handleShowToolbar = () => {
    setShowToolbar(prev => !prev)
  }

  const handleOpenMenuRight = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuRight(event.currentTarget)
  }

  const handleOpenAccount = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAccount(event.currentTarget)
  }

  const handleCloseAccount = () => {
    setAnchorElAccount(null)
  }

  const handleChangeLanguage = (item: LanguageOptions, index: number) => {
    setLanguage(item.value)
    i18n.changeLanguage(item.value)
    localStorage.setItem(LocalStorageConfig.languageKey, item.value)
    setSelectedIndex(index)
  }

  const handleToggleTheme = () => {
    onToggleTheme()
  }

  const handleDrawerToggle = (item?: ModulesProps) => {
    if (!showToolbar) {
      setOpenDrawerLeft(prevState => !prevState)
    }

    if (item && !showToolbar) {
      navigate(item?.routePath as string)
    }
  }

  const handleCreateModule = () => {
    setTitleModal(t('module:titleCreate'))
    setEditMode(false)
    if (formDialogRef.current) {
      formDialogRef.current?.onOpenDialog?.(true)
      resetForm()
    }
  }

  const handleCreateSubModule = (item: ModulesProps) => {
    setModuleValue(item)
    setTitleModal(t('module:titleCreate'))
    setEditMode(false)
    if (formDialogRef.current) {
      formDialogRef.current?.onOpenDialog?.(true)
    }
  }

  const handleDeleteModule = (item: ModulesProps) => {
    setModuleValue(item)
    setOpenDeleteAlertDialog({ isConfirm: true, open: true, content: t('common:dialog.confirmContent', { name: `[${item?.label}]` }) })
  }

  const handleEditModule = (item: ModulesProps) => {
    setEditMode(true)
    setModuleValue(item)
    void getModuleById(item?.id as number)
    setTitleModal(t('module:titleModify'))
    if (formDialogRef.current) {
      formDialogRef.current?.onOpenDialog?.(true)
    }
  }

  const handleConfirm = async () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
    await onDeleteAsync()
  }

  const handleConfirmCancel = () => {
    setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: true })
    setModuleValue(null)
  }
  // #endregion

  // #region [Method]
  const onLogoutAsync = async () => {
    onLoading(true)
    await LogoutServiceAsync<ApiResponseAuth>()
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onLoginAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          localStorage.removeItem(LocalStorageConfig.userTokenKey)
          localStorage.removeItem(LocalStorageConfig.userNameKey)
          onUnauthenticated()
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onLoginAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onCheckAuthorize = async () => {
    onLoading(true)
    await AuthorizeAsync<ApiResponseAuthorize>()
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCheckAuthorize',
        })
        if (res?.status) {
          onAuthenticated()
        } else {
          onUnauthenticated()
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onCheckAuthorize',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const setDefaultLanguage = () => {
    if (language === localStorage.getItem(LocalStorageConfig.languageKey)) {
      if (languages && languages.length !== 0) {
        const index = languages.findIndex(item => item.value === language)
        setSelectedIndex(index)
      }
    }
  }

  const resetForm = () => {
    reset(defaultFormValue)
    setModuleValue(null)
  }
  // #endregion

  // #region [api]
  const getLanguages = () =>
    useMemo(() => {
      {
        const langOptions: LanguageOptions[] = []
        langOptions.push(
          {
            value: 'vi',
            label: t('common:languages.vi'),
          },
          {
            value: 'en',
            label: t('common:languages.en'),
          }
        )
        setLanguages(langOptions)
        return langOptions
      }
    }, [])

  const getModules = async () => {
    const modules: ModulesProps[] = []
    await GetModules()
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
  }

  const getServices = async () => {
    await GetServices()
      .then(res => {
        const items: ApiResponseProps<ServicesProps[]> = res as ApiResponseProps<ServicesProps[]>
        if (items?.status) {
          if (items?.data) {
            setServices(items?.data)
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
  }

  const getModuleById = async (id: number) => {
    const params = {
      id: id ?? 0,
    }
    onLoading(true)
    await GetModuleById(params)
      .then(res => {
        const item: ApiResponseProps<ModuleFormData> = res as ApiResponseProps<ModuleFormData>
        if (item?.status) {
          setValue('parentId', item?.data?.parentId as number)
          setValue('serviceId', item?.data?.serviceId as number)
          setValue('code', item?.data?.code as string)
          setValue('name', item?.data?.name as string)
          setValue('lang', item?.data?.lang as string)
          setValue('icon', (item?.data?.icon as string) ?? null)
          setValue('routePath', (item?.data?.routePath as string) ?? '/')
          setValue('isActive', item?.data?.isActive as boolean)
          WriteLogTable({
            data: item,
            groupTitle: 'Response from API getModuleById',
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getModuleById',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onCreateAsync = async (formData: ModuleFormData) => {
    onLoading(true)
    await CreateModuleAsync<ApiResponseBasic>(formData)
      .then(async res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateAsync',
        })
        if (res?.status) {
          resetForm()
          await getModules()
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          setEditMode(false)
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

  const onUpdateAsync = async (formData: ModuleFormData) => {
    onLoading(true)
    await UpdateModuleAsync<ApiResponseBasic>(formData)
      .then(async res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onUpdateAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
          resetForm()
          await getModules()
          setEditMode(false)
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onUpdateAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onDeleteAsync = async () => {
    if (moduleValue) {
      onLoading(true)
      await DeleteModuleAsync<ApiResponseBasic>({ id: moduleValue?.id as number })
        .then(async res => {
          WriteLogTable({
            data: res,
            groupTitle: 'Response from API onCreateAsync',
          })
          if (res?.status) {
            setOpenDeleteAlertDialog({ open: true, content: res?.message as string, isConfirm: false })
            await getModules()
            setModuleValue(null)
            setEditMode(false)
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
    } else {
      setOpenDeleteAlertDialog({ open: true, content: 'moduleValue is null', isConfirm: false })
      WriteLog({
        data: 'moduleValue is null',
        logType: 'error',
        groupTitle: 'Error',
      })
    }
  }
  // #endregion

  // #region [User-Account]
  const renderUserAccount = () => {
    if (authState.isAuthenticated) {
      return (
        <Box>
          <Tooltip title={t('common:accountSettings')}>
            <IconButton onClick={handleOpenAccount} size='small' sx={{ ml: 2 }}>
              <Avatar sx={{ width: 32, height: 32 }}>P</Avatar>
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorElAccount} open={openAccount} onClose={handleCloseAccount} onClick={handleCloseAccount}>
            <MenuItem onClick={handleCloseAccount}>
              <ListItemIcon>
                <Avatar />
              </ListItemIcon>
              <Typography sx={{ mr: 8, pl: 2 }}>Your name</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={onLogoutAsync}>
              <ListItemIcon>
                <Logout fontSize='small' />
              </ListItemIcon>
              <ListItemText>{t('common:logout')}</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      )
    }
    return (
      <Button onClick={() => navigate(RouteName.Login)} sx={{ display: { xs: 'none', sm: 'block' } }} color='inherit'>
        {t('common:menuTop.login')}
      </Button>
    )
  }
  // #endregion

  // #region [User-Account-For-Mobile]
  const renderUserAccountForMobile = () => {
    if (authState.isAuthenticated) {
      return (
        <Accordion sx={{ display: { xs: 'block', sm: 'none' } }} slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Avatar sx={{ width: 32, height: 32 }}>P</Avatar>
            <Typography sx={{ ml: 1, pr: 2 }}>Your Name</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Button color='inherit' onClick={onLogoutAsync}>
              <Logout fontSize='small' sx={{ mr: 1 }} />
              <Typography variant='subtitle1'>{t('common:logout')}</Typography>
            </Button>
          </AccordionDetails>
        </Accordion>
      )
    } else {
      return (
        <Accordion sx={{ display: { xs: 'block', sm: 'none' } }} slotProps={{ transition: { unmountOnExit: true } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AccountCircle fontSize='small' sx={{ mr: 1 }} />
            <Typography>{t('common:loginSystem')}</Typography>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Button color='inherit' onClick={() => navigate(RouteName.Login)}>
              <LoginIcon fontSize='small' sx={{ mr: 1 }} />
              <Typography variant='subtitle1'>{t('common:menuTop.login')}</Typography>
            </Button>
          </AccordionDetails>
        </Accordion>
      )
    }
  }
  // #endregion

  // #region [Tree-View]
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

            {showToolbar && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyItems: 'flex-end', ml: 2 }}>
                <IconButtonCreateSubItem size='small' onClick={() => handleCreateSubModule(item)}>
                  <AddIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonCreateSubItem>

                <IconButtonUpdate size='small' onClick={() => handleEditModule(item)}>
                  <EditIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonUpdate>

                <IconButtonDelete size='small' onClick={() => handleDeleteModule(item)}>
                  <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonDelete>
              </Box>
            )}
          </Box>
        </Box>
      )
    } else {
      return (
        <Box onClick={() => handleDrawerToggle(item)} sx={{ display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box flex={1} sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center' }}>
              <FormatListBulletedIcon fontSize='small' sx={{ mr: 1 }} />
              <Typography variant='caption' fontSize={13}>
                {item?.label}
              </Typography>
            </Box>
            {showToolbar && (
              <Box flex={1} sx={{ display: 'flex', justifyContent: 'center', justifyItems: 'center', ml: 2 }}>
                <IconButtonCreateSubItem size='small' onClick={() => handleCreateSubModule(item)}>
                  <AddIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonCreateSubItem>

                <IconButtonUpdate size='small' onClick={() => handleEditModule(item)}>
                  <EditIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonUpdate>

                <IconButtonDelete size='small' onClick={() => handleDeleteModule(item)}>
                  <DeleteIcon fontSize='small' sx={{ mr: 1 }} />
                </IconButtonDelete>
              </Box>
            )}
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
    return (
      <Box>
        <MenuList>
          <MenuItem>
            <ListItemIcon>
              <HomeIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText
              onClick={() => {
                navigate(RouteName.Home)
                setOpenDrawerLeft(false)
              }}
              sx={{ fontSize: 13 }}
            >
              {t('common:menuTop.home')}
            </ListItemText>
          </MenuItem>
        </MenuList>
        <Divider />
        <SimpleTreeView>{renderTreeViewMenu(modules)}</SimpleTreeView>
      </Box>
    )
  }
  // #endregion Tree View

  // #region [Toolbar-Bottom-Tree-View]
  const renderToolbar = () => {
    return (
      <Box sx={{ padding: 1 }}>
        <Stack direction='row' divider={<Divider orientation='vertical' flexItem />} spacing={1}>
          <ButtonCreate onClick={handleShowToolbar} variant='outlined' size='small'>
            {showToolbar ? <RemoveRedEyeIcon fontSize='small' sx={{ mr: 1 }} /> : <EditIcon fontSize='small' sx={{ mr: 1 }} />}
            <Typography variant='subtitle1' sx={{ textTransform: 'none' }}>
              {showToolbar ? t('common:buttons.viewMode') : t('common:buttons.editMode')}
            </Typography>
          </ButtonCreate>

          {showToolbar && (
            <ButtonCreate onClick={handleCreateModule} variant='outlined' size='small'>
              <CreateNewFolderIcon fontSize='small' sx={{ mr: 1 }} />
              <Typography variant='subtitle1' sx={{ textTransform: 'none' }}>
                {t('module:toolbar.addNewTitle')}
              </Typography>
            </ButtonCreate>
          )}
        </Stack>
      </Box>
    )
  }
  // #endregion

  // #region [Form]
  const renderForm = () => {
    return (
      <Box>
        {moduleValue && (
          <Box mb={1} flexDirection={'row'} display={'flex'}>
            <Box>{t('module:category')}:</Box>
            <Box ml={1}>
              <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
                {moduleValue?.id}-{moduleValue?.label}
              </Typography>
            </Box>
            <Divider />
          </Box>
        )}

        {editMode && (
          <Box sx={{ mt: 1 }}>
            <Controller
              control={control}
              name='parentId'
              render={({ field }) => (
                <DropdownTree
                  {...field}
                  placeholder={t('forms:modules.selectParent')}
                  dataSource={modules}
                  onChange={(item: DropdownTreeProps) => {
                    setSelectedItemTree(item)
                  }}
                />
              )}
            />
          </Box>
        )}

        <Box sx={{ mt: 1 }}>
          <Controller
            control={control}
            name='serviceId'
            render={({ field }) => (
              <TextField
                fullWidth
                {...field}
                size='small'
                select
                variant='standard'
                label={t('forms:modules.service')}
                error={!!errors.serviceId}
                helperText={errors.serviceId && `${errors.serviceId.message}`}
              >
                <MenuItem value=''>
                  <em>{t('forms:modules.service')}</em>
                </MenuItem>
                {services &&
                  services?.map(item => (
                    <MenuItem key={item?.id} value={item?.id}>
                      {item?.name}
                    </MenuItem>
                  ))}
              </TextField>
            )}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Controller
            control={control}
            name='code'
            render={({ field }) => (
              <TextField fullWidth {...field} size='small' label={t('forms:modules.code')} variant='standard' error={!!errors.code} helperText={errors.code && `${errors.code.message}`} />
            )}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <TextField fullWidth {...field} size='small' variant='standard' label={t('forms:modules.name')} error={!!errors.name} helperText={errors.name && `${errors.name.message}`} />
            )}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Controller control={control} name='routePath' render={({ field }) => <TextField fullWidth {...field} size='small' variant='standard' label={t('forms:modules.routePath')} />} />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Controller control={control} name='icon' render={({ field }) => <TextField fullWidth {...field} size='small' variant='standard' label={t('forms:modules.icon')} />} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <Controller
            control={control}
            name='lang'
            render={({ field }) => (
              <SelectLanguage
                {...field}
                dataSource={languagesOption}
                size='small'
                defaultValue={'vi-VN'}
                textFieldProps={{
                  label: t('common:language'),
                  fullWidth: true,
                  variant: 'standard',
                  onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                    setValue('lang', event.target.value)
                  },
                }}
              />
            )}
          />
        </Box>

        <Box sx={{ mt: 1 }}>
          <Controller control={control} name='isActive' render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked />} label={t('forms:modules.isActive')} />} />
        </Box>
      </Box>
    )
  }
  // #endregion

  const onSubmit: SubmitHandler<ModuleFormData> = async (data: ModuleFormData) => {
    const moduleDataParentId = moduleValue ? moduleValue?.parentId : undefined
    const formData: ModuleFormData = {
      id: moduleValue ? moduleValue?.id : 0,
      parentId: !editMode ? (moduleValue ? moduleValue?.id : 0) : selectedItemTree ? selectedItemTree?.id : moduleDataParentId,
      serviceId: data?.serviceId,
      code: data.code,
      name: data.name,
      lang: data.lang ?? 'vi-VN',
      routePath: data.routePath,
      icon: data.icon,
      isActive: data.isActive,
    }
    if (!editMode) {
      await onCreateAsync(formData)
    } else {
      await onUpdateAsync(formData)
    }

    WriteLog({
      data: formData,
      groupTitle: 'FormData',
    })
  }

  useEffect(() => {
    setDefaultLanguage()
  }, [selectedIndex])

  useEffect(() => {
    const authorize = process.env.REACT_APP_AUTHORIZE
    if (authorize !== 'NONE') {
      void onCheckAuthorize()
    }
  }, [authState.isAuthenticated])

  useEffect(() => {
    setDrawerWidth(showToolbar ? drawerMaxWidth : drawerMinWidth)
  }, [showToolbar])

  useEffect(() => {
    if (authState.isAuthenticated) {
      void getServices()
      void getModules()
    } else {
      setModules([])
      setServices([])
    }
  }, [authState.isAuthenticated])

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position='fixed'>
        <Toolbar>
          {/* Menu Left */}
          <IconButton onClick={() => handleDrawerToggle()} size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            Logo
          </Typography>

          {/* Menu */}
          <Stack direction='row' spacing={0}>
            {/* Login For web and Desktop */}
            {renderUserAccount()}

            {/* Menu Right For web and Desktop */}
            <Button color='inherit' sx={{ display: { xs: 'none', sm: 'block' } }} onClick={handleOpenMenuRight}>
              {t('common:language')}
            </Button>

            {/* Swith theme */}
            <Tooltip title={t('common:themeUsed', { name: theme.palette.mode !== 'dark' ? t('common:themeDark') : t('common:themeLight') })}>
              <IconButton sx={{ ml: 1 }} color='inherit' onClick={handleToggleTheme}>
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* Menu Right Mobile */}
            <Tooltip title={t('common:showMore')}>
              <Button color='inherit' onClick={handleOpenMenuRight} sx={{ display: { xs: 'block', sm: 'none' } }}>
                <MoreVertIcon />
              </Button>
            </Tooltip>
            <Menu
              anchorEl={anchorElMenuRight}
              open={openMenuRight}
              onClose={() => setAnchorElMenuRight(null)}
              MenuListProps={{
                'aria-labelledby': 'lock-button',
                role: 'listbox',
              }}
            >
              {/* Menu Language */}
              <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <LanguageIcon fontSize='small' sx={{ mr: 1 }} />
                  <Typography>{t('common:language')}</Typography>
                </AccordionSummary>
                <Divider />
                <AccordionDetails>
                  <MenuList>
                    {getLanguages() &&
                      getLanguages().map((option: LanguageOptions, index: number) => (
                        <MenuItem key={option.value} selected={index === selectedIndex} onClick={() => handleChangeLanguage(option, index)} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                  </MenuList>
                </AccordionDetails>
              </Accordion>

              <Divider sx={{ display: { xs: 'block', sm: 'none' } }} />

              {/* Menu User Profile */}
              {renderUserAccountForMobile()}
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menu Left */}
      <DrawerMenuLeft
        drawerWidth={drawerWidth}
        renderTreeView={renderTreeView()}
        logoTitle='Logo'
        isOpen={openDrawerLeft}
        handleDrawerToggle={() => handleDrawerToggle()}
        externalDrawer={{
          position: 'bottom',
          isShowExternalDrawer: true,
          externalMenu: renderToolbar(),
        }}
      />

      {/* Main */}
      <Box sx={{ border: '1px dashed grey', mr: 1, ml: 1, mt: 10, p: 2 }}>
        <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 10000 }} open={loadingState.isLoading}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <Outlet />
      </Box>

      {/* Form Dialog */}
      <FormDialog ref={formDialogRef} isUsePermission onConfirm={handleSubmit(onSubmit)} dialogTitle={titleModal} isShowCancelButton>
        {renderForm()}
      </FormDialog>

      {/* Alert Dialog */}
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        isConfirm={openDeleteAlertDialog.isConfirm}
        content={openDeleteAlertDialog.content}
        onConfirm={handleConfirm}
        onCancel={handleConfirmCancel}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '', isConfirm: false })
          if (formDialogRef.current) {
            formDialogRef.current?.onCloseDialog?.()
          }
        }}
      />
    </Box>
  )
}
export default AdminLayout
