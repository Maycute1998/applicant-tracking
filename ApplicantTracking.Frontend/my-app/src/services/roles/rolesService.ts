import { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync } from '../../app/api/axiosClient'
import { ApiPagingRequest } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../../services/api/endPoint'
import { FormData } from '../../data-type'
import { GetToken } from '../../utils/helper'

const GetRoles = async () => {
  return await getDataAsync(endPoint?.Roles.getRoles as string, {
    'redis-token-key': GetToken(),
  })
}

const GetRolesPaging = async (params: ApiPagingRequest) => {
  return await getDataAsync(endPoint?.Roles.getRolesPaging as string, params, {
    'redis-token-key': GetToken(),
  })
}

const GetRoleById = async (params: { id: number }) => {
  return await getDataAsync(endPoint?.Roles.getRoleById as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreateRoleAsync = async <T>(data: FormData) => {
  return await postDataAsync<T>(
    endPoint?.Roles.create as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const UpdateRoleAsync = async <T>(data: FormData) => {
  return await putDataAsync<T>(
    endPoint?.Roles.update as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const DeleteRoleAsync = async <T>(data: { Ids: number[] }) => {
  const { Ids } = data
  return await deleteDataAsync<T>(
    endPoint?.Roles.delete as string,
    Ids,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}
export { GetRoles, GetRolesPaging, GetRoleById, CreateRoleAsync, UpdateRoleAsync, DeleteRoleAsync }
