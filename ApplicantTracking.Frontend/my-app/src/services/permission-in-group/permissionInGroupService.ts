import { deleteDataAsync, getDataAsync, postDataAsync } from '../../app/api/axiosClient'
import { ApiPagingRequest, PermissionInGroupFormData, PermissionReqRoleAndModuleWithSearchProps } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { GetToken } from '../../utils/helper'
const GetPermissionInGroupPagingAsync = async (params: ApiPagingRequest) => {
  return await getDataAsync(endPoint?.PermissionInGroup.getPermissionInGroupPaging as string, params, {
    'redis-token-key': GetToken(),
  })
}

const GetPermissionInGroupsAsync = async (params: PermissionReqRoleAndModuleWithSearchProps) => {
  return await getDataAsync(endPoint?.PermissionInGroup.getPermissionInGroups as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreatePermissionInGroupAsync = async <T>(data: PermissionInGroupFormData) => {
  return await postDataAsync<T>(
    endPoint?.PermissionInGroup.create as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const DeletePermissionInGroupAsync = async <T>(data: { Ids: number[] }) => {
  const { Ids } = data
  return await deleteDataAsync<T>(
    endPoint?.PermissionInGroup.delete as string,
    Ids,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}
export { GetPermissionInGroupPagingAsync, GetPermissionInGroupsAsync, CreatePermissionInGroupAsync, DeletePermissionInGroupAsync }
