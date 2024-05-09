export type ApiResponseProps<T> = {
  data?: T
  message?: string
  status?: boolean
  statusCode?: number
}
export type ApiResponsePagingProps<T> = {
  data?: DataOption<T>
  message?: string
  status?: boolean
  statusCode?: number
}
export type ApiResponseBasic = {
  message?: string
  status?: boolean
}
export type ApiResponseAuth = ApiResponseBasic & {
  redisKey?: string
  userName?: string
}
export type ApiResponseAuthorize = ApiResponseBasic & {
  data?: any
  statusCode?: number
}
type DataOption<T> = {
  totalCounts?: number
  totalPages?: number
  records?: T
}
