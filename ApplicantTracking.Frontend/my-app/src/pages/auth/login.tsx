import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Container, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { RouteName } from '../../app/routes/routerConfig'
import { useAuth, useLoadingOverlay } from '../../app/stores/systems'
import { AlertDialog } from '../../components/core'
import { LocalStorageConfig } from '../../constant'
import { ApiResponseAuth, ApiResponseAuthorize, AuthForm, DialogProps } from '../../data-type'
import { AuthorizeAsync, SiginServiceAsync } from '../../services'
import { WriteLogTable } from '../../utils/helper'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { onAuthenticated } = useAuth()
  const { onLoading } = useLoadingOverlay()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })
  const handleClickShowPassword = () => setShowPassword(show => !show)

  const validationLocales = {
    userName: {
      required: t('login:validations.required.userName'),
    },
    password: {
      required: t('login:validations.required.password'),
    },
  }

  const schema = Yup.object().shape({
    userName: Yup.string().label('userName').trim().required(validationLocales.userName.required),
    password: Yup.string().label('password').trim().required(validationLocales.password.required),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<AuthForm>({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      password: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<AuthForm> = async (data: AuthForm) => {
    const formData: AuthForm = {
      userName: data.userName,
      password: data.password,
    }
    void onLoginAsync(formData)
  }

  const onLoginAsync = async (formData: AuthForm) => {
    onLoading(true)
    await SiginServiceAsync<ApiResponseAuth>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onLoginAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
          localStorage.setItem(LocalStorageConfig.userTokenKey, res?.redisKey as string)
          localStorage.setItem(LocalStorageConfig.userNameKey, res?.userName as string)
          onAuthenticated()
          navigate('/')
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
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

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
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
          navigate('/')
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

  useEffect(() => {
    document.title = t('login:title')
    const authorize = process.env.REACT_APP_AUTHORIZE
    if (authorize !== 'NONE') {
      void onCheckAuthorize()
    }
  }, [])

  return (
    <Container maxWidth='sm'>
      <Box component='section'>
        <Card sx={{ minWidth: 275 }}>
          <CardHeader title={<Typography variant='h5'>{t('forms:login.title')}</Typography>}></CardHeader>

          <CardContent sx={{ p: 0, pl: 1, pr: 1 }}>
            <Box component={'form'} autoComplete='off'>
              <Box>
                <Controller
                  control={control}
                  name='userName'
                  render={({ field }) => (
                    <TextField fullWidth {...field} size='small' placeholder={t('forms:login.username')} error={!!errors.userName} helperText={errors.userName && `${errors.userName.message}`} />
                  )}
                />
              </Box>

              <Box sx={{ mt: 1 }}>
                <Controller
                  control={control}
                  name='password'
                  render={({ field }) => (
                    <OutlinedInput
                      error={!!errors.password}
                      type={showPassword ? 'text' : 'password'}
                      size='small'
                      placeholder={t('forms:login.password')}
                      fullWidth
                      {...field}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton aria-label='toggle password visibility' onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge='end'>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ ml: 2 }} error>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </CardContent>

          <CardActions>
            <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate(RouteName.Register)} variant='outlined' size='small'>
                {t('forms:login.buttonRegister')}
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' size='small' onClick={handleSubmit(onSubmit)}>
                {t('forms:login.buttonLogin')}
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Box>
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={false}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '' })
        }}
      />
    </Container>
  )
}

export default Login
