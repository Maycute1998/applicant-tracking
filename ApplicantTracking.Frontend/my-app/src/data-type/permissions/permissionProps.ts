export type PermissionFormData = {
  id?: number
  code: string
  moduleId: number
  buttonId?: string
  name: string
  lang?: string
  isActive?: boolean
}
export type PermissionSortProps = {
  field: string
  sort: string | 'asc'
}

export type PermissionsProps = {
  id?: number
  code: string
  moduleId?: number
  serviceId?: number
  buttonId?: string
  moduleName?: string
  name: string
  lang?: string
  isActive?: boolean
  description?: string
}

export type PermissionsDataGirdProps = {
  id?: number
  code: string
  moduleId?: number
  buttonId?: string
  moduleName?: string
  serviceName?: string
  name: string
  lang?: string
  isActive?: boolean
  description?: string
}