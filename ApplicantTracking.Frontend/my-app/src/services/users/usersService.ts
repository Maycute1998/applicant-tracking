import { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync } from '../../app/api/axiosClient'
import { ApiPagingRequest, UserForm } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { GetToken } from '../../utils/helper'

const GetUsers = async () => {
  return await getDataAsync(endPoint?.Users.getUsers as string, {
    'redis-token-key': GetToken(),
  })
}

const GetUsersPaging = async (params: ApiPagingRequest) => {
  return await getDataAsync(endPoint?.Users.getUserPaging as string, params, {
    'redis-token-key': GetToken(),
  })
}

const GetUserById = async (params: { id: number }) => {
  return await getDataAsync(endPoint?.Users.getUserById as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreateUserAsync = async <T>(data: UserForm) => {
  return await postDataAsync<T>(
    endPoint?.Users.createUser as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const UpdateUserAsync = async <T>(data: UserForm) => {
  return await putDataAsync<T>(
    endPoint?.Users.updateUser as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const DeleteUserAsync = async <T>(data: { Ids: number[] }) => {
  const { Ids } = data
  return await deleteDataAsync<T>(
    endPoint?.Users.deleteUser as string,
    Ids,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}
export { GetUsers, GetUsersPaging, GetUserById, CreateUserAsync, UpdateUserAsync, DeleteUserAsync }
