export type GoogleDriveFileProps = {
  id?: string
  name?: string
  size?: number
  thumbnailLink?: string
  webContentLink?: string
  webViewLink?: string
  trashed?: boolean
  fileExtension?: string
  createdTime?: any
  parents?: string[]
  mimeType?: string
}

export type GoogleDriveFoldersProps = {
  id?: string
  name?: string
  size?: number
  createdTime?: any
  parents?: string[]
  mimeType?: string
  thumbnailLink?: string
  webContentLink?: string
  webViewLink?: string
  trashed?: boolean
  fileExtension?: string
}

export type GoogleDriveFoldersContainsFolderReq = {
  folderId: string
}

export type GoogleDriveBreadcrumbs = {
  id?: string
  name?: string
  isActive?: boolean
}

export type GoogleDriveFormData = {
  folderName: string
}

export type GoogleDriveSubFolderFormData = GoogleDriveFormData & {
  folderId: string
}

export type GoogleDriveUploadFileIntoFolder = {
  folderId: string
}
