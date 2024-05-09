import { AppBar, Toolbar, IconButton, Typography, Box, Button, FormControl, Select, MenuItem, Menu, useTheme, SelectChangeEvent } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { ApiResponseAuth, DialogProps, LanguageOptions, MenuProps } from '../../../data-type'
import { useNavigate } from 'react-router-dom'
import React, { useMemo, useState } from 'react'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useAuth, useCustomTheme, useLoadingOverlay } from '../../../app/stores/systems'
import { useTranslation } from 'react-i18next'
import { RouteName } from '../../../app/routes/routerConfig'
import { LocalStorageConfig } from '../../../constant'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { LogoutServiceAsync } from '../../../services'
import { WriteLogTable } from '../../../utils/helper'
import AlertDialog from '../dialog/alertDialog'

type HeaderBarProps = {
  handleDrawerToggle: (isOpen: boolean) => void
  logoTitle?: string
  menuItem?: MenuProps[]
  isOpen: boolean
}
const HeaderBar = (props: HeaderBarProps) => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const theme = useTheme()
  const { onLoading } = useLoadingOverlay()
  const { state: authState, onUnauthenticated } = useAuth()
  const { onToggleTheme } = useCustomTheme()
  const { handleDrawerToggle, isOpen, logoTitle, menuItem } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [language, setLanguage] = useState<string>('vi')
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleLogout = async () => {
    await onLogoutAsync()
    handleClose()
    navigate(RouteName.Login)
  }

  const getLanguages = () =>
    useMemo(() => {
      {
        const langOptions: LanguageOptions[] = []
        langOptions.push(
          {
            value: 'vi',
            label: 'Tiếng Việt',
          },
          {
            value: 'en',
            label: 'English',
          }
        )
        return langOptions
      }
    }, [])

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    setLanguage(event.target.value)
    i18n.changeLanguage(event.target.value)
    localStorage.setItem(LocalStorageConfig.languageKey, event.target.value)
  }

  const handleToggleTheme = () => {
    onToggleTheme()
  }

  const renderUserAccount = () => {
    if (authState.isAuthenticated) {
      return (
        <React.Fragment>
          <IconButton size='large' aria-label='account of current user' aria-controls='menu-appbar' aria-haspopup='true' onClick={handleMenu} color='inherit'>
            <AccountCircle />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </React.Fragment>
      )
    }
    return (
      <Button onClick={() => navigate(RouteName.Login)} color='inherit'>
        {t('common:menuTop.login')}
      </Button>
    )
  }

  const onLogoutAsync = async () => {
    onLoading(true)
    await LogoutServiceAsync<ApiResponseAuth>()
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onLogoutAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
          localStorage.removeItem(LocalStorageConfig.userTokenKey)
          localStorage.removeItem(LocalStorageConfig.userNameKey)
          onUnauthenticated()
          handleClose()
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onLogoutAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  return (
    <AppBar position='fixed' component='nav'>
      <Toolbar>
        {/* Icon Menu when responesive */}
        <IconButton color='inherit' aria-label='open drawer' edge='start' onClick={() => handleDrawerToggle(!isOpen)} sx={{ mr: 2, display: { sm: 'block' } }}>
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Typography variant='h6' component='div' sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
          {logoTitle}
        </Typography>

        {/* Menu */}
        <Box sx={{ ml: 3, flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
          {menuItem &&
            menuItem.length !== 0 &&
            menuItem.map((item: MenuProps) => {
              if (item.path && item.path !== '') {
                return (
                  <Button key={item.id} sx={{ color: '#fff' }} onClick={() => navigate(item.path as string)}>
                    {item.title}
                  </Button>
                )
              } else {
                return (
                  <Button key={item.id} sx={{ color: '#fff' }} onClick={() => navigate(item.path as string)}>
                    {item.title}
                  </Button>
                )
              }
            })}
        </Box>

        {/* Login */}
        <Box sx={{ ml: 0, flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>{renderUserAccount()}</Box>

        {/* Languages */}
        <Box sx={{ ml: 0, flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
          <FormControl sx={{ m: 1, minWidth: 120 }} size='small'>
            <Select value={language} onChange={handleChangeLanguage} displayEmpty inputProps={{ 'aria-label': 'Without label' }}>
              {getLanguages() &&
                getLanguages().map((option: LanguageOptions) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>

        {/* Theme */}
        <Box sx={{ ml: 0, flexGrow: 0, display: { xs: 'none', sm: 'block' } }}>
          <IconButton sx={{ ml: 1 }} color='inherit' onClick={handleToggleTheme}>
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={false}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '' })
        }}
      />
    </AppBar>
  )
}
export default HeaderBar
