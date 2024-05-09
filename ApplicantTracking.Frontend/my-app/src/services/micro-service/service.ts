import { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync } from '../../app/api/axiosClient'
import { ApiPagingRequest } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { FormData } from '../../data-type'
import { GetToken } from '../../utils/helper'

const GetServices = async () => {
  return await getDataAsync(endPoint?.Services.getServices as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetServicesPaging = async (params: ApiPagingRequest) => {
  return await getDataAsync(endPoint?.Services.getServicesPaging as string, params, {
    'redis-token-key': GetToken(),
  })
}
const GetServiceById = async (params: { id: number }) => {
  return await getDataAsync(endPoint?.Services.getServicesById as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreateServiceAsync = async <T>(data: FormData) => {
  return await postDataAsync<T>(
    endPoint?.Services.create as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const UpdateServiceAsync = async <T>(data: FormData) => {
  return await putDataAsync<T>(
    endPoint?.Services.update as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const DeleteServiceAsync = async <T>(data: { Ids: number[] }) => {
  const { Ids } = data
  return await deleteDataAsync<T>(
    endPoint?.Services.delete as string,
    Ids,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}
export { GetServices, GetServicesPaging, GetServiceById, CreateServiceAsync, UpdateServiceAsync, DeleteServiceAsync }
