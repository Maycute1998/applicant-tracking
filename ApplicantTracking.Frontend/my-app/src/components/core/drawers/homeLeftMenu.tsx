import { Box, Divider, Drawer, Typography } from '@mui/material'
import { ReactNode } from 'react'

type DrawerMenuLeftProps = {
  handleDrawerToggle: (isOpen: boolean) => void
  logoTitle?: string
  renderTreeView: ReactNode | JSX.Element
  isOpen: boolean
  drawerWidth: number | 240
  anchor?: 'left' | 'top' | 'right' | 'bottom'
  externalDrawer?: DrawerMenuRightProps
}
type DrawerMenuRightProps = {
  position?: 'normal' | 'bottom'
  isShowExternalDrawer?: boolean
  externalMenu?: JSX.Element | React.ReactNode
}
const DrawerMenuLeft = (props: DrawerMenuLeftProps) => {
  const { handleDrawerToggle, renderTreeView, isOpen, logoTitle, drawerWidth, anchor } = props

  const renderMenu = () => {
    return (
      <Box>
        {/* Logo */}
        <Typography variant='h6' sx={{ my: 2, textAlign: 'center' }}>
          {logoTitle}
        </Typography>
        <Divider />
        {renderTreeView}

        {props.externalDrawer && props.externalDrawer.isShowExternalDrawer ? (
          <Box sx={{ position: props.externalDrawer.position === 'bottom' ? 'absolute' : 'unset', bottom: 0, width: '100%' }}>
            {/* External Menu */}
            {props.externalDrawer.externalMenu}
          </Box>
        ) : null}
      </Box>
    )
  }

  return (
    <Drawer
      variant='temporary'
      anchor={anchor}
      open={isOpen}
      onClose={handleDrawerToggle}
      ModalProps={{
        keepMounted: true,
      }}
      sx={{
        display: { xs: 'block', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
      }}
    >
      {renderMenu()}
    </Drawer>
  )
}
export default DrawerMenuLeft
