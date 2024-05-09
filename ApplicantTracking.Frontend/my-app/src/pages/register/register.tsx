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
import { useLoadingOverlay } from '../../app/stores/systems'
import { AlertDialog } from '../../components/core'
import { ApiResponseBasic, DialogProps, RegisterForm } from '../../data-type'
import { RegisterServiceAsync } from '../../services'
import { WriteLogTable } from '../../utils/helper'

const Register = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { onLoading } = useLoadingOverlay()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })
  const handleClickShowPassword = () => setShowPassword(show => !show)

  const validationLocales = {
    userName: {
      required: t('register:validations.required.userName'),
    },
    password: {
      required: t('register:validations.required.password'),
    },
    email: {
      required: t('register:validations.required.email'),
    },
    emailFormat: {
      emailFormat: t('register:validations.format.emailNotCorrectFormant'),
    },
  }

  const schema = Yup.object().shape({
    userName: Yup.string().label('userName').trim().required(validationLocales.userName.required),
    password: Yup.string().label('password').trim().required(validationLocales.password.required),
    email: Yup.string().label('email').trim().required(validationLocales.email.required).email(validationLocales.emailFormat.emailFormat),
  })

  const {
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterForm>({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      password: '',
      email: '',
    },
    resolver: yupResolver(schema),
  })

  const onSubmit: SubmitHandler<RegisterForm> = async (data: RegisterForm) => {
    const formData: RegisterForm = {
      userName: data.userName,
      password: data.password,
      email: data.email,
      type: 1,
    }
    void onRegisterAsync(formData)
  }

  const onRegisterAsync = async (formData: RegisterForm) => {
    onLoading(true)
    await RegisterServiceAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onRegisterAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
          reset({
            email: '',
            password: '',
            userName: '',
            type: 1,
          })
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API onRegisterAsync',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  useEffect(() => {
    document.title = t('register:title')
  }, [])

  return (
    <Container maxWidth='sm'>
      <Box component='section'>
        <Card sx={{ minWidth: 275 }}>
          <CardHeader title={<Typography variant='h5'>{t('forms:register.title')}</Typography>}></CardHeader>

          <CardContent sx={{ p: 0, pl: 1, pr: 1 }}>
            <Box component={'form'} autoComplete='off'>
              <Box>
                <Controller
                  control={control}
                  name='userName'
                  render={({ field }) => (
                    <TextField fullWidth {...field} size='small' placeholder={t('forms:register.username')} error={!!errors.userName} helperText={errors.userName && `${errors.userName.message}`} />
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
                      placeholder={t('forms:register.password')}
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

              <Box sx={{ mt: 1 }}>
                <Controller
                  control={control}
                  name='email'
                  render={({ field }) => (
                    <TextField fullWidth {...field} size='small' placeholder={t('forms:register.email')} error={!!errors.email} helperText={errors.email && `${errors.email.message}`} />
                  )}
                />
              </Box>
            </Box>
          </CardContent>

          <CardActions>
            <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleSubmit(onSubmit)} variant='outlined' size='small'>
                {t('forms:register.buttonRegister')}
              </Button>
            </Box>

            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant='outlined' size='small' onClick={() => navigate(RouteName.Login)}>
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

export default Register
