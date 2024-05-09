import { yupResolver } from '@hookform/resolvers/yup'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, FormHelperText, IconButton, InputAdornment, OutlinedInput, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { AlertDialog } from '../../../components/core'
import { ApiResponseBasic, ApiResponseProps, DialogProps, UserForm, UsersProps } from '../../../data-type'
import { CreateUserAsync, UpdateUserAsync } from '../../../services'
import { GetUserById } from '../../../services/users/usersService'
import { WriteLogTable } from '../../../utils/helper'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const FormUsers = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { onLoading } = useLoadingOverlay()
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const handleClickShowPassword = () => setShowPassword(show => !show)
  const ButtonCreateOrUpdate = withComponentPermissionModule(Button, ModuleConfig.USER, [PermissionConfig.Create, PermissionConfig.Update])

  const validationLocales = {
    userName: {
      required: t('users:validations.required.userName'),
    },
    password: {
      required: t('users:validations.required.password'),
    },
    email: {
      required: t('users:validations.required.email'),
    },
    emailFormat: {
      emailFortmat: t('users:validations.format.emailNotCorrectFormant'),
    },
  }

  const schema = Yup.object().shape({
    userName: Yup.string().label('userName').trim().required(validationLocales.userName.required),
    password: Yup.string().label('password').trim().required(validationLocales.password.required),
    email: Yup.string().label('email').trim().required(validationLocales.email.required).email(validationLocales.emailFormat.emailFortmat),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<UserForm>({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      password: '',
      email: '',
      isActive: true,
    },
    resolver: yupResolver(schema),
  })

  const getUserById = async () => {
    const params = {
      id: location.state.id ?? 0,
    }
    onLoading(true)
    await GetUserById(params)
      .then(res => {
        const item: ApiResponseProps<UsersProps> = res as ApiResponseProps<UsersProps>
        if (item?.status) {
          setValue('userName', item?.data?.userName as string)
          setValue('password', item?.data?.password as string)
          setValue('email', item?.data?.email as string)
          setValue('isActive', item?.data?.isActive as boolean)
          WriteLogTable({
            data: item,
            groupTitle: 'Response from API getUserById',
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getUserById',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit: SubmitHandler<UserForm> = async (data: UserForm) => {
    const formData: UserForm = {
      id: location.state ? location.state.id : 0,
      userName: data.userName,
      password: data.password,
      email: data.email,
      isActive: data.isActive,
      type: 0,
    }
    if (location.state && location.state.id) {
      void onUpdateAsync(formData)
    } else {
      void onCreateAsync(formData)
    }
  }

  const onCreateAsync = async (formData: UserForm) => {
    onLoading(true)
    await CreateUserAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onCreateAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
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

  const onUpdateAsync = async (formData: UserForm) => {
    onLoading(true)
    await UpdateUserAsync<ApiResponseBasic>(formData)
      .then(res => {
        WriteLogTable({
          data: res,
          groupTitle: 'Response from API onUpdateAsync',
        })
        if (res?.status) {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
        } else {
          setOpenDeleteAlertDialog({ open: true, content: res?.message as string })
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

  useEffect(() => {
    document.title = t('users:addNewTitle')
    if (location.state && location.state.id) {
      document.title = t('users:editNewTitle')
      void getUserById()
    }
  }, [])

  return (
    <Box component='section'>
      <Card sx={{ minWidth: 275 }}>
        <CardContent sx={{ p: 0, pl: 1, pr: 1, mt: 1 }}>
          <Box component={'form'} autoComplete='off'>
            <Box>
              <Controller
                control={control}
                name='userName'
                render={({ field }) => (
                  <TextField fullWidth {...field} size='small' placeholder={t('forms:users.username')} error={!!errors.userName} helperText={errors.userName && `${errors.userName.message}`} />
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
                  <TextField fullWidth {...field} size='small' placeholder={t('forms:users.email')} error={!!errors.email} helperText={errors.email && `${errors.email.message}`} />
                )}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Controller control={control} name='isActive' render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked />} label={t('forms:users.isActive')} />} />
            </Box>
          </Box>
        </CardContent>

        <CardActions>
          <Box sx={{ flexGrow: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonCreateOrUpdate variant='outlined' size='small' onClick={handleSubmit(onSubmit)}>
              {t('common:actions.save')}
            </ButtonCreateOrUpdate>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => navigate(-1)} variant='outlined' size='small'>
              {t('common:actions.back')}
            </Button>
          </Box>
        </CardActions>
      </Card>
      <AlertDialog
        title={t('common:dialog.informationTitle')}
        open={openDeleteAlertDialog.open}
        content={openDeleteAlertDialog.content}
        isConfirm={false}
        onOk={() => {
          setOpenDeleteAlertDialog({ open: false, content: '' })
          navigate(-1)
        }}
      />
    </Box>
  )
}

export default FormUsers
