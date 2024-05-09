import { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync, uploadFileAsync } from '../../app/api/axiosClient'
import { ApiPagingRequest, PermissionFormData, PermissionReqRoleAndModuleProps } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { GetToken } from '../../utils/helper'

const GetPermissions = async () => {
  return await getDataAsync(endPoint?.Permissions.getPermissions as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetPermissionsPaging = async (params: ApiPagingRequest) => {
  return await getDataAsync(endPoint?.Permissions.getPermissionsPaging as string, params, {
    'redis-token-key': GetToken(),
  })
}
const GetPermissionByIdAsync = async (params: { id: number }) => {
  return await getDataAsync(endPoint?.Permissions.getPermissionsById as string, params, {
    'redis-token-key': GetToken(),
  })
}

const GetPermissionNotInGroupPermissionByModuleIdAsync = async (params: PermissionReqRoleAndModuleProps) => {
  return await getDataAsync(endPoint?.Permissions.getPermissionNotInGroupPermissionByModuleId as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreatePermissionsAsync = async <T>(data: PermissionFormData) => {
  return await postDataAsync<T>(
    endPoint?.Permissions.create as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const UpdatePermissionsAsync = async <T>(data: PermissionFormData) => {
  return await putDataAsync<T>(
    endPoint?.Permissions.update as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const DeletePermissionsAsync = async <T>(data: { Ids: number[] }) => {
  const { Ids } = data
  return await deleteDataAsync<T>(
    endPoint?.Permissions.delete as string,
    Ids,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const ImportExcelAsync = async <T>(file: File) => {
  return await uploadFileAsync<T>(endPoint?.Permissions.importExcel as string, file, [], {
    'redis-token-key': GetToken(),
  })
}
export {
  GetPermissions,
  GetPermissionsPaging,
  GetPermissionByIdAsync,
  GetPermissionNotInGroupPermissionByModuleIdAsync,
  CreatePermissionsAsync,
  UpdatePermissionsAsync,
  DeletePermissionsAsync,
  ImportExcelAsync,
}
