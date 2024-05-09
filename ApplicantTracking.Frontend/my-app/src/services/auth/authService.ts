import { getDataAsync, postDataAsync } from '../../app/api/axiosClient'
import { RequestContentType } from '../../enum'
import { endPoint } from '../api/endPoint'
import { AuthForm } from '../../data-type'
import { GetToken } from '../../utils/helper'

const SiginServiceAsync = async <T>(data: AuthForm) => {
  return await postDataAsync<T>(endPoint?.Auth.sigin as string, data, null, RequestContentType.UrlEncoded)
}

const LogoutServiceAsync = async <T>() => {
  return await postDataAsync<T>(
    endPoint?.Auth.sigout as string,
    null,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.UrlEncoded
  )
}

const AuthorizeAsync = async <T>() => {
  return await getDataAsync<T>(endPoint?.Authorize.authorize as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetUserRolesAsync = async <T>() => {
  return await getDataAsync<T>(endPoint?.Authorize.userRoles as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetUserRoleByModuleAsync = async <T>(params: { moduleCode: string }) => {
  return await getDataAsync<T>(endPoint?.Authorize.userRoleByModule as string, params, {
    'redis-token-key': GetToken(),
  })
}
export { SiginServiceAsync, LogoutServiceAsync, AuthorizeAsync, GetUserRolesAsync, GetUserRoleByModuleAsync }
