import { postDataAsync } from '../../app/api/axiosClient'
import { RegisterForm } from '../../data-type'
import { RequestContentType } from '../../enum'
import { endPoint } from '../../services/api/endPoint'

const RegisterServiceAsync = async <T>(data: RegisterForm) => {
  return await postDataAsync<T>(endPoint?.Auth.register as string, data, null, RequestContentType.UrlEncoded)
}
export { RegisterServiceAsync }
