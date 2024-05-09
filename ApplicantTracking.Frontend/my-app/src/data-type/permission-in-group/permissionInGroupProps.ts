export type PermissionReqRoleAndModuleProps = {
  moduleId?: number
  roleId?: number
}
export type PermissionReqRoleAndModuleWithSearchProps = PermissionReqRoleAndModuleProps & {
  keyword?: string
}
export type PermissionInGroupProps = {
  id?: number
  name?: string
}
export type PermissionInGroupFormData = {
  permissionIds: number[]
  roleId: number
  lang?: string
}
