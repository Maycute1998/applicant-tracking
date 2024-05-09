import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { AlertDialog, SelectLanguage } from '../../../components/core'
import { ApiResponseBasic, ApiResponseProps, DialogProps, FormData, ServicesProps } from '../../../data-type'
import { CreateServiceAsync, GetServiceById, UpdateServiceAsync } from '../../../services'
import { WriteLogTable } from '../../../utils/helper'
import { useLanguage } from '../../../hooks'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const FormServices = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const languages = useLanguage()
  const { onLoading } = useLoadingOverlay()
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })
  const ButtonCreateOrUpdate = withComponentPermissionModule(Button, ModuleConfig.SERVICE, [PermissionConfig.Create, PermissionConfig.Update])
  const validationLocales = {
    code: {
      required: t('services:validations.required.code'),
      min: t('services:validations.stringLength.codeMinLength'),
      max: t('services:validations.stringLength.codeMaxLength'),
    },
    name: {
      required: t('services:validations.required.name'),
      min: t('services:validations.stringLength.nameMinLength'),
      max: t('services:validations.stringLength.nameMaxLength'),
    },
  }

  const schema = Yup.object().shape({
    code: Yup.string().label('Code').trim().required(validationLocales.code.required).min(1, validationLocales.code.min).max(255, validationLocales.code.max),
    name: Yup.string().label('Name').trim().required(validationLocales.name.required).min(1, validationLocales.name.min).max(255, validationLocales.name.max),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      isActive: true,
    },
    resolver: yupResolver(schema),
  })

  const getServiceById = async () => {
    const params = {
      id: location.state.id ?? 0,
    }
    onLoading(true)
    await GetServiceById(params)
      .then(res => {
        const item: ApiResponseProps<ServicesProps> = res as ApiResponseProps<ServicesProps>
        if (item?.status) {
          setValue('code', item?.data?.code as string)
          setValue('name', item?.data?.name as string)
          setValue('lang', item?.data?.lang as string)
          setValue('isActive', item?.data?.isActive as boolean)
          WriteLogTable({
            data: item,
            groupTitle: 'Response from API getServiceById',
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getServiceById',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    const formData: FormData = {
      id: location.state ? location.state.id : 0,
      code: data.code,
      name: data.name,
      isActive: data.isActive,
      lang: data?.lang ?? 'vi-VN',
    }
    if (location.state && location.state.id) {
      void onUpdateAsync(formData)
    } else {
      void onCreateAsync(formData)
    }
  }

  const onCreateAsync = async (formData: FormData) => {
    onLoading(true)
    await CreateServiceAsync<ApiResponseBasic>(formData)
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

  const onUpdateAsync = async (formData: FormData) => {
    onLoading(true)
    await UpdateServiceAsync<ApiResponseBasic>(formData)
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
    document.title = t('services:addNewTitle')
    if (location.state && location.state.id) {
      document.title = t('services:editNewTitle')
      void getServiceById()
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
                name='code'
                render={({ field }) => <TextField fullWidth {...field} size='small' label={t('forms:services.code')} error={!!errors.code} helperText={errors.code && `${errors.code.message}`} />}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                name='name'
                render={({ field }) => <TextField fullWidth {...field} size='small' label={t('forms:services.name')} error={!!errors.name} helperText={errors.name && `${errors.name.message}`} />}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                name='lang'
                render={({ field }) => (
                  <SelectLanguage
                    {...field}
                    dataSource={languages}
                    size='small'
                    defaultValue={'vi-VN'}
                    textFieldProps={{
                      label: t('common:language'),
                      sx: { width: '25%' },
                      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                        setValue('lang', event.target.value)
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ mt: 1 }}>
              <Controller control={control} name='isActive' render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked />} label={t('forms:services.isActive')} />} />
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

export default FormServices
