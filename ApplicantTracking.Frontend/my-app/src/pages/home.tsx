import { Box, Button } from '@mui/material'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withComponentPermissionModule } from '../hocs/withComponentPermissionModule'
//import { GoogleDriveManagement } from './components'

const Home = () => {
  const { t } = useTranslation()
  const ButtonAdd = withComponentPermissionModule(Button, 'ROLES', ['BtnCreate'])
  useEffect(() => {
    document.title = t('common:title')
  }, [])

  return (
    <Fragment>
      <Box component='section'>
        {t('common:title')}
        {/* <GoogleDriveManagement /> */}
      </Box>

      <Box component='section'>
        <ButtonAdd variant='outlined'>Button Add</ButtonAdd>
      </Box>
    </Fragment>
  )
}
export default Home
