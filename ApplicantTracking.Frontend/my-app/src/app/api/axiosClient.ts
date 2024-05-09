import axios, { AxiosRequestConfig } from 'axios'
import queryString from 'query-string'
import { RequestContentType } from '../../enum'
import { GetLanguage } from '../../utils/helper'

const defaultHeaders = {
  'Accept-Language': GetLanguage(),
  'Content-Type': RequestContentType.Json,
}

const defaultUrlencodedHeaders = {
  'Accept-Language': GetLanguage(),
  'Content-Type': RequestContentType.UrlEncoded,
}

/**
 * Function to GET data from an API endpoint
 * @param url Endpoint URL
 * @param params Query parameters, default is empty object
 * @param customHeaders Custom headers to merge with default headers
 * @param contentType Content-Type of request, default is JSON
 * @returns Data from API endpoint
 */
const getDataAsync = async <T>(url: string, params: any = {}, customHeaders: any = {}, contentType: RequestContentType = RequestContentType.Json): Promise<T> => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const headers = { ...defaultHeaders, ...customHeaders }
  const headerEncodedHeaders = { ...defaultUrlencodedHeaders, ...customHeaders }
  const queryParam = queryString.stringify(params)
  const axiosConfig: AxiosRequestConfig = {
    params: contentType === RequestContentType.UrlEncoded ? queryParam : params,
    headers: contentType === RequestContentType.UrlEncoded ? headerEncodedHeaders : headers,
    cancelToken: source.token,
  }
  const response = await axios.get<T>(url, axiosConfig)
  source.cancel('Operation canceled by the user.')
  return response.data
}

/**
 * Function to POST data to an API endpoint
 * @param url Endpoint URL
 * @param data Data to POST
 * @param customHeaders Custom headers to merge with default headers
 * @param contentType Content-Type of request, default is JSON
 * @returns Data from API endpoint
 */
const postDataAsync = async <T>(url: string, data?: any, customHeaders?: any, contentType?: RequestContentType): Promise<T> => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const headers = { ...defaultHeaders, ...customHeaders }
  const headerEncodedHeaders = { ...defaultUrlencodedHeaders, ...customHeaders }
  const param = contentType === RequestContentType.UrlEncoded ? queryString.stringify(data) : data

  const axiosConfig: AxiosRequestConfig = {
    headers: contentType === RequestContentType.UrlEncoded ? headerEncodedHeaders : headers,
    cancelToken: source.token,
  }
  const response = await axios.post<T>(url, param, axiosConfig)
  source.cancel('Operation canceled by the user.')
  return response.data
}

/**
 * Function to PUT data to an API endpoint
 * @param url Endpoint URL
 * @param data Data to PUT
 * @param customHeaders Custom headers to merge with default headers
 * @param contentType Content-Type of request, default is JSON
 * @returns Data from API endpoint
 */
const putDataAsync = async <T>(url: string, data?: any, customHeaders?: any, contentType?: RequestContentType): Promise<T> => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const headers = { ...defaultHeaders, ...customHeaders }
  const headerEncodedHeaders = { ...defaultUrlencodedHeaders, ...customHeaders }
  const param = contentType === RequestContentType.UrlEncoded ? queryString.stringify(data) : data

  const axiosConfig: AxiosRequestConfig = {
    headers: contentType === RequestContentType.UrlEncoded ? headerEncodedHeaders : headers,
    cancelToken: source.token,
  }
  const response = await axios.put<T>(url, param, axiosConfig)
  source.cancel('Operation canceled by the user.')
  return response.data
}

/**
 * Function to DELETE data from an API endpoint
 * @param url Endpoint URL
 * @param data Data to DELETE
 * @param customHeaders Custom headers to merge with default headers
 * @param contentType Content-Type of request, default is JSON
 * @returns Data from API endpoint
 */
const deleteDataAsync = async <T>(url: string, data?: any, customHeaders?: any, contentType?: RequestContentType): Promise<T> => {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  const headers = { ...defaultHeaders, ...customHeaders }
  const headerEncodedHeaders = { ...defaultUrlencodedHeaders, ...customHeaders }
  const param = contentType === RequestContentType.UrlEncoded ? queryString.stringify(data) : data

  const axiosConfig: AxiosRequestConfig = {
    headers: contentType === RequestContentType.UrlEncoded ? headerEncodedHeaders : headers,
    data: param,
    cancelToken: source.token,
  }
  const response = await axios.delete<T>(url, axiosConfig)
  source.cancel('Operation canceled by the user.')
  return response.data
}

/**
 * Function to upload file to an API endpoint
 * @param url Endpoint URL
 * @param file File to upload
 * @param data Data to post, default is empty object
 * @param customHeaders Custom headers to merge with default headers
 * @returns Data from API endpoint
 */
const uploadFileAsync = async <T>(url: string, file: any, data: any[] = [], customHeaders: any = {}): Promise<T> => {
  const formData = new FormData()

  formData.append('file', file)

  for (const item of data) {
    for (const key in item) {
      formData.append(key, item[key])
    }
  }

  const axiosConfig: AxiosRequestConfig = {
    headers: {
      ...defaultHeaders,
      ...customHeaders,
      'Content-Type': 'multipart/form-data',
    },
  }

  const response = await axios.post<T>(url, formData, axiosConfig)

  return response.data
}

export { deleteDataAsync, getDataAsync, postDataAsync, putDataAsync, uploadFileAsync }
