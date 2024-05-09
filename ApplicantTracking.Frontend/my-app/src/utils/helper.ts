import { LocalStorageConfig } from '../constant'

type LogProps = {
  data: unknown
  groupTitle?: string
  logType?: 'info' | 'warn' | 'error'
}

type LogTableProps = {
  data: unknown
  groupTitle?: string
}

const WriteLog = (props: LogProps) => {
  const { data, groupTitle, logType } = props
  console.groupCollapsed(groupTitle)
  switch (logType) {
    case 'info':
      console.info(JSON.stringify(data))
      break
    case 'warn':
      console.warn(JSON.stringify(data))
      break
    case 'error':
      console.error(JSON.stringify(data))
      break
    default:
      console.log(JSON.stringify(data))
      break
  }
  console.groupEnd()
}

const WriteLogTable = (props: LogTableProps) => {
  const { data, groupTitle } = props
  console.groupCollapsed(groupTitle)
  console.table(data)
  console.groupEnd()
}

const GetToken = () => {
  const tokenKey = localStorage.getItem(LocalStorageConfig.userTokenKey)
  if (tokenKey) return tokenKey
  return null
}
const GetLanguage = () => {
  const language = localStorage.getItem(LocalStorageConfig.languageKey)
  if (language === 'vi') return 'vi-VN'
  return 'en-US'
}

const FormatFileSize = (sizeInBytes: number | null): string => {
  if (sizeInBytes === null || isNaN(sizeInBytes)) {
    return 'Unknown'
  }

  const units = ['bytes', 'KB', 'MB', 'GB', 'TB']

  let unitIndex = 0
  let fileSize = sizeInBytes

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }

  return `${fileSize.toFixed(2)} ${units[unitIndex]}`
}
export { WriteLog, GetToken, GetLanguage, WriteLogTable, FormatFileSize }
