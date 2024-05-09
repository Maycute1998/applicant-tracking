import { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync } from '../../app/api/axiosClient'
import { ModuleFormData } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { GetToken } from '../../utils/helper'

const GetModules = async () => {
  return await getDataAsync(endPoint?.Modules.getModules as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetModuleByServiceId = async (params: { serviceId: number }) => {
  return await getDataAsync(endPoint?.Modules.getModuleByServiceId as string, params, {
    'redis-token-key': GetToken(),
  })
}
const GetModuleById = async (params: { id: number }) => {
  return await getDataAsync(endPoint?.Modules.getModuleById as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreateModuleAsync = async <T>(data: ModuleFormData) => {
  return await postDataAsync<T>(
    endPoint?.Modules.create as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const UpdateModuleAsync = async <T>(data: ModuleFormData) => {
  return await putDataAsync<T>(
    endPoint?.Modules.update as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const DeleteModuleAsync = async <T>(data: { id: number }) => {
  const { id } = data
  return await deleteDataAsync<T>(
    endPoint?.Modules.delete as string,
    id,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}
export { GetModules, GetModuleById, GetModuleByServiceId, CreateModuleAsync, UpdateModuleAsync, DeleteModuleAsync }
