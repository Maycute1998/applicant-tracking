import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useLoadingOverlay } from '../../../app/stores/systems'
import { AlertDialog, DropdownList, DropdownTree, SelectLanguage } from '../../../components/core'
import { ApiResponseBasic, ApiResponseProps, DialogProps, DropdownOptions, DropdownTreeProps, ModulesProps, PermissionFormData, PermissionsProps, ServicesProps } from '../../../data-type'
import { WriteLog, WriteLogTable } from '../../../utils/helper'
import { useLanguage } from '../../../hooks'
import { CreatePermissionsAsync, GetModuleByServiceId, GetPermissionByIdAsync, GetServices, UpdatePermissionsAsync } from '../../../services'
import { ModuleConfig, PermissionConfig } from '../../../constant'
import { withComponentPermissionModule } from '../../../hocs/withComponentPermissionModule'

const FormPermissions = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const languages = useLanguage()
  const { onLoading } = useLoadingOverlay()
  const [services, setServices] = useState<DropdownOptions[]>([])
  const [serviceDefaultValue, setServiceDefaultValue] = useState<number>()
  const [moduleDefaultValue, setModuleDefaultValue] = useState<number>()
  const [modules, setModules] = useState<ModulesProps[]>([])
  const [openDeleteAlertDialog, setOpenDeleteAlertDialog] = useState<DialogProps>({ open: false, content: '' })

  const ButtonCreateOrUpdate = withComponentPermissionModule(Button, ModuleConfig.PERMISSION, [PermissionConfig.Create, PermissionConfig.Update])

  const validationLocales = {
    code: {
      required: t('permission:validations.required.code'),
    },
    name: {
      required: t('permission:validations.required.name'),
    },
    moduleId: {
      required: t('permission:validations.required.moduleId'),
    },
  }

  const schema = Yup.object().shape({
    code: Yup.string().label('Code').trim().required(validationLocales.code.required),
    name: Yup.string().label('Name').trim().required(validationLocales.name.required),
    moduleId: Yup.number().label('Module').required(validationLocales.moduleId.required),
  })

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<PermissionFormData>({
    mode: 'onChange',
    defaultValues: {
      code: '',
      name: '',
      moduleId: undefined,
      buttonId: '',
      lang: 'vi-VN',
      isActive: true,
    },
    resolver: yupResolver(schema),
  })

  const getServices = async () => {
    onLoading(true)
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
            setServices(rows)
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
      .finally(() => {
        onLoading(false)
      })
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

  const getPermissionById = async () => {
    const params = {
      id: location.state.id ?? 0,
    }
    onLoading(true)
    await GetPermissionByIdAsync(params)
      .then(async res => {
        const item: ApiResponseProps<PermissionsProps> = res as ApiResponseProps<PermissionsProps>
        if (item?.status) {
          setValue('code', item?.data?.code as string)
          setValue('name', item?.data?.name as string)
          setValue('moduleId', item?.data?.moduleId as number)
          setValue('lang', item?.data?.lang as string)
          setValue('buttonId', item?.data?.buttonId as string)
          setValue('isActive', item?.data?.isActive as boolean)
          setServiceDefaultValue(item?.data?.serviceId as number)
          setModuleDefaultValue(item?.data?.moduleId as number)
          await getModuleByService(item?.data?.serviceId as number)
          WriteLogTable({
            data: item,
            groupTitle: 'Response from API getPermissionById',
          })
        }
      })
      .catch(err => {
        WriteLogTable({
          data: err,
          groupTitle: 'Response from API getPermissionById',
        })
      })
      .finally(() => {
        onLoading(false)
      })
  }

  const onSubmit: SubmitHandler<PermissionFormData> = async (data: PermissionFormData) => {
    const formData: PermissionFormData = {
      id: location.state ? location.state.id : 0,
      code: data.code,
      name: data.name,
      moduleId: data.moduleId ?? undefined,
      buttonId: data.buttonId,
      isActive: data.isActive,
      lang: data?.lang ?? 'vi-VN',
    }
    WriteLog({
      data: formData,
      logType: 'info',
      groupTitle: 'Form data',
    })
    if (location.state && location.state.id) {
      void onUpdateAsync(formData)
    } else {
      void onCreateAsync(formData)
    }
  }

  const onCreateAsync = async (formData: PermissionFormData) => {
    onLoading(true)
    await CreatePermissionsAsync<ApiResponseBasic>(formData)
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

  const onUpdateAsync = async (formData: PermissionFormData) => {
    onLoading(true)
    await UpdatePermissionsAsync<ApiResponseBasic>(formData)
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

  const renderServiceDropdownlist = () => {
    if (location.state && location.state.id) {
      if (serviceDefaultValue) {
        return (
          <DropdownList
            size='small'
            dataSource={services}
            textFieldProps={{
              label: t('common:services'),
              sx: { width: '100%' },
              value: serviceDefaultValue,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
                const { value }: any = event.target
                setServiceDefaultValue(value)
              },
            }}
          />
        )
      }
    } else {
      return (
        <DropdownList
          size='small'
          dataSource={services}
          textFieldProps={{
            label: t('common:services'),
            sx: { width: '100%' },
            value: serviceDefaultValue,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
              const { value }: any = event.target
              void getModuleByService(value)
            },
          }}
        />
      )
    }
  }

  useEffect(() => {
    document.title = t('permission:addNewTitle')
    void getServices()
    if (location.state && location.state.id) {
      document.title = t('permission:editNewTitle')
      void getPermissionById()
    }
  }, [])

  return (
    <Box component='section'>
      <Card sx={{ minWidth: 275 }}>
        <CardContent sx={{ p: 0, pl: 1, pr: 1, mt: 1 }}>
          <Box component={'form'} autoComplete='off'>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'start', flexDirection: 'row' }}>
                <Box sx={{ width: '15%', mr: 2 }}>{renderServiceDropdownlist()}</Box>
                <Box sx={{ width: '15%', mr: 2 }}>
                  <Controller
                    control={control}
                    name='moduleId'
                    render={({ field }) => (
                      <DropdownTree
                        {...field}
                        width={'100%'}
                        placeholder={t('forms:modules.selectParent')}
                        dataSource={modules}
                        itemSelectedIds={moduleDefaultValue?.toString()}
                        onChange={(item: DropdownTreeProps) => {
                          if (item) {
                            setValue('moduleId', item?.id as number)
                          }
                        }}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                name='code'
                render={({ field }) => <TextField fullWidth {...field} size='small' label={t('forms:permission.code')} error={!!errors.code} helperText={errors.code && `${errors.code.message}`} />}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller
                control={control}
                name='name'
                render={({ field }) => <TextField fullWidth {...field} size='small' label={t('forms:permission.name')} error={!!errors.name} helperText={errors.name && `${errors.name.message}`} />}
              />
            </Box>

            <Box sx={{ mt: 2 }}>
              <Controller control={control} name='buttonId' render={({ field }) => <TextField fullWidth {...field} size='small' label={t('forms:permission.buttonID')} />} />
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
              <Controller control={control} name='isActive' render={({ field }) => <FormControlLabel control={<Checkbox {...field} defaultChecked />} label={t('forms:permission.isActive')} />} />
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

export default FormPermissions
