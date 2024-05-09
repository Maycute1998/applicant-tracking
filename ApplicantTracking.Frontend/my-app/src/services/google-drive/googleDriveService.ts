import { deleteDataAsync, getDataAsync, postDataAsync, uploadFileAsync } from '../../app/api/axiosClient'
import { GoogleDriveFoldersContainsFolderReq, GoogleDriveFormData, GoogleDriveSubFolderFormData, GoogleDriveUploadFileIntoFolder } from '../../data-type'
import { endPoint } from '../api/endPoint'
import { GetToken } from '../../utils/helper'
import { RequestContentType } from '../../enum'

const GetFolders = async () => {
  return await getDataAsync(endPoint?.GoogleDrives.getFolders as string, null, {
    'redis-token-key': GetToken(),
  })
}
const GetFoldersContainFolders = async (params: GoogleDriveFoldersContainsFolderReq) => {
  return await getDataAsync(endPoint?.GoogleDrives.getFolderContainsInFolders as string, params, {
    'redis-token-key': GetToken(),
  })
}

const CreateFolderAsync = async <T>(data: GoogleDriveFormData) => {
  return await postDataAsync<T>(
    endPoint?.GoogleDrives.createFolders as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const CreateSubFolderAsync = async <T>(data: GoogleDriveSubFolderFormData) => {
  return await postDataAsync<T>(
    endPoint?.GoogleDrives.createSubFolders as string,
    data,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const DeleteFileOrFolderAsync = async <T>(data: { folderId: string }) => {
  const { folderId } = data
  return await deleteDataAsync<T>(
    endPoint?.GoogleDrives.deleteFileOrFolder as string,
    folderId,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const RevokeTokenAsync = async <T>() => {
  return await postDataAsync<T>(
    endPoint?.GoogleDrives.revokeToken as string,
    null,
    {
      'redis-token-key': GetToken(),
    },
    RequestContentType.Json
  )
}

const UploadFileIntoFolderAsync = async <T>(file: File, data: GoogleDriveUploadFileIntoFolder[]) => {
  return await uploadFileAsync<T>(endPoint?.GoogleDrives.uploadIntoFolder as string, file, data, {
    'redis-token-key': GetToken(),
  })
}

export { GetFolders, GetFoldersContainFolders, CreateFolderAsync, CreateSubFolderAsync, DeleteFileOrFolderAsync, RevokeTokenAsync, UploadFileIntoFolderAsync }
