import { Env } from '../../enum'
import { BaseUrlByEnvironment } from './apiConfig'
const env = process.env.REACT_APP_ENVIROMENT
const ver = process.env.REACT_APP_VER
const BASE_CLOUD_URL = 'http://localhost:5153'
const BaseUrl = BaseUrlByEnvironment()
const BaseAPI = {
  Roles: {
    getRoles: `${BaseUrl}/identity-service/api/get-all-roles-async`,
    getRolesPaging: `${BaseUrl}/identity-service/api/get-roles-with-paging-async`,
    getRoleById: `${BaseUrl}/identity-service/api/get-roles-by-id-async`,
    create: `${BaseUrl}/identity-service/api/create-async`,
    update: `${BaseUrl}/identity-service/api/update-async`,
    delete: `${BaseUrl}/identity-service/api/delete-async`,
  },
  Services: {
    getServices: `${BaseUrl}/identity-service/services/api/get-all-services-async`,
    getServicesPaging: `${BaseUrl}/identity-service/services/api/get-services-with-paging-async`,
    getServicesById: `${BaseUrl}/identity-service/services/api/get-services-by-id-async`,
    create: `${BaseUrl}/identity-service/services/api/create-async`,
    update: `${BaseUrl}/identity-service/services/api/update-async`,
    delete: `${BaseUrl}/identity-service/services/api/delete-async`,
  },
  Auth: {
    sigin: `${BaseUrl}/identity-service/api/sigin-async`,
    siginWithGoogle: `${BaseUrl}/identity-service/api/sigin-with-google`,
    register: `${BaseUrl}/identity-service/api/register-async`,
    sigout: `${BaseUrl}/identity-service/api/sigout-async`,
  },
  Authorize: {
    authorize: `${BaseUrl}/identity-service/authorize/api/check`,
    userRoles: `${BaseUrl}/identity-service/api/get-user-roles-async`,
    userRoleByModule: `${BaseUrl}/identity-service/api/get-user-roles-by-module-async`,
  },
  Users: {
    getUsers: `${BaseUrl}/identity-service/users/get-all-users-async`,
    getUserById: `${BaseUrl}/identity-service/users/get-users-by-id-async`,
    getUserPaging: `${BaseUrl}/identity-service/users/get-users-with-paging-async`,
    createUser: `${BaseUrl}/identity-service/users/create-async`,
    updateUser: `${BaseUrl}/identity-service/users/update-async`,
    deleteUser: `${BaseUrl}/identity-service/users/delete-async`,
  },
  Modules: {
    getModules: `${BaseUrl}/identity-modules/modules/api/get-all-modules-async`,
    getModuleByServiceId: `${BaseUrl}/identity-modules/modules/api/get-module-by-serviceId-async`,
    getModuleById: `${BaseUrl}/identity-modules/modules/api/get-modules-by-id-async`,
    create: `${BaseUrl}/identity-modules/modules/api/create-async`,
    update: `${BaseUrl}/identity-modules/modules/api/update-async`,
    delete: `${BaseUrl}/identity-modules/modules/api/delete-async`,
  },
  Permissions: {
    getPermissions: `${BaseUrl}/identity-permission/permission/api/get-all-permission-async`,
    getPermissionsPaging: `${BaseUrl}/identity-permission/permission/api/get-permission-with-paging-async`,
    getPermissionsById: `${BaseUrl}/identity-permission/permission/api/get-permission-by-id-async`,
    getPermissionNotInGroupPermissionByModuleId: `${BaseUrl}/identity-permission/permission/api/get-permission-not-in-group-permission-by-moduleId-async`,
    importExcel: `${BaseUrl}/identity-permission/permission/api/import-async`,
    create: `${BaseUrl}/identity-permission/permission/api/create-async`,
    update: `${BaseUrl}/identity-permission/permission/api/update-async`,
    delete: `${BaseUrl}/identity-permission/permission/api/delete-async`,
  },
  PermissionInGroup: {
    getPermissionInGroupPaging: `${BaseUrl}/identity-permission-in-group/permission-in-group/api/get-permission-in-group-with-paging-async`,
    getPermissionInGroups: `${BaseUrl}/identity-permission-in-group/permission-in-group/api/get-permission-in-group-async`,
    create: `${BaseUrl}/identity-permission-in-group/permission-in-group/api/create-async`,
    delete: `${BaseUrl}/identity-permission-in-group/permission-in-group/api/delete-async`,
  },
  GoogleDrives: {
    getFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/get-folder-async`,
    getFolderContainsInFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/get-contains-folder-async`,
    revokeToken: `${BASE_CLOUD_URL}/api/${ver}/google-drive/revoke-token-async`,
    createFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/create-folder-async`,
    createSubFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/create-sub-folder-async`,
    deleteFileOrFolder: `${BASE_CLOUD_URL}/api/${ver}/google-drive/delete-file-folder-async`,
    uploadIntoFolder: `${BASE_CLOUD_URL}/api/${ver}/google-drive/upload-file-into-folder-async`,
  },
}
const NativeAPI = {
  Roles: {
    getRoles: `${BaseUrl}/api/${ver}/roles/get-all-roles-async`,
    getRolesPaging: `${BaseUrl}/api/${ver}/roles/get-roles-with-paging-async`,
    getRoleById: `${BaseUrl}/api/${ver}/roles/get-roles-by-id-async`,
    create: `${BaseUrl}/api/${ver}/roles/create-async`,
    update: `${BaseUrl}/api/${ver}/roles/update-async`,
    delete: `${BaseUrl}/api/${ver}/roles/delete-async`,
  },
  Services: {
    getServices: `${BaseUrl}/api/${ver}/services/get-all-services-async`,
    getServicesPaging: `${BaseUrl}/api/${ver}/services/get-services-with-paging-async`,
    getServicesById: `${BaseUrl}/api/${ver}/services/get-services-by-id-async`,
    create: `${BaseUrl}/api/${ver}/services/create-async`,
    update: `${BaseUrl}/api/${ver}/services/update-async`,
    delete: `${BaseUrl}/api/${ver}/services/delete-async`,
  },
  Auth: {
    sigin: `${BaseUrl}/api/${ver}/auth/sigin-async`,
    siginWithGoogle: `${BaseUrl}/api/${ver}/auth/sigin-with-google`,
    register: `${BaseUrl}/api/${ver}/auth/register-async`,
    sigout: `${BaseUrl}/api/${ver}/auth/sigout-async`,
  },
  Authorize: {
    authorize: `${BaseUrl}/api/${ver}/authorize/check`,
    userRoles: `${BaseUrl}/api/${ver}/auth/get-user-roles-async`,
    userRoleByModule: `${BaseUrl}/api/${ver}/auth/get-user-roles-by-module-async`,
  },
  Users: {
    getUsers: `${BaseUrl}/api/${ver}/get-all-users-async`,
    getUserById: `${BaseUrl}/api/${ver}/users/get-users-by-id-async`,
    getUserPaging: `${BaseUrl}/api/${ver}/users/get-users-with-paging-async`,
    createUser: `${BaseUrl}/api/${ver}/users/create-async`,
    updateUser: `${BaseUrl}/api/${ver}/users/update-async`,
    deleteUser: `${BaseUrl}/api/${ver}/users/delete-async`,
  },
  Modules: {
    getModules: `${BaseUrl}/api/${ver}/modules/get-all-modules-async`,
    getModuleByServiceId: `${BaseUrl}/api/${ver}/modules/get-module-by-serviceId-async`,
    getModuleById: `${BaseUrl}/api/${ver}/modules/get-modules-by-id-async`,
    create: `${BaseUrl}/api/${ver}/modules/create-async`,
    update: `${BaseUrl}/api/${ver}/modules/update-async`,
    delete: `${BaseUrl}/api/${ver}/modules/delete-async`,
  },
  Permissions: {
    getPermissions: `${BaseUrl}/api/${ver}/permission/get-all-permission-async`,
    getPermissionsPaging: `${BaseUrl}/api/${ver}/permission/get-permission-with-paging-async`,
    getPermissionsById: `${BaseUrl}/api/${ver}/permission/get-permission-by-id-async`,
    getPermissionNotInGroupPermissionByModuleId: `${BaseUrl}/api/${ver}/permission/get-permission-not-in-group-permission-by-moduleId-async`,
    importExcel: `${BaseUrl}/api/${ver}/permission/import-async`,
    create: `${BaseUrl}/api/${ver}/permission/create-async`,
    update: `${BaseUrl}/api/${ver}/permission/update-async`,
    delete: `${BaseUrl}/api/${ver}/permission/delete-async`,
  },
  PermissionInGroup: {
    getPermissionInGroupPaging: `${BaseUrl}/api/${ver}/permissionInGroup/get-permission-in-group-with-paging-async`,
    getPermissionInGroups: `${BaseUrl}/api/${ver}/permissionInGroup/get-permission-in-group-async`,
    create: `${BaseUrl}/api/${ver}/permissionInGroup/create-async`,
    delete: `${BaseUrl}/api/${ver}/permissionInGroup/delete-async`,
  },
  GoogleDrives: {
    getFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/get-folder-async`,
    getFolderContainsInFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/get-contains-folder-async`,
    revokeToken: `${BASE_CLOUD_URL}/api/${ver}/google-drive/revoke-token-async`,
    createFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/create-folder-async`,
    createSubFolders: `${BASE_CLOUD_URL}/api/${ver}/google-drive/create-sub-folder-async`,
    deleteFileOrFolder: `${BASE_CLOUD_URL}/api/${ver}/google-drive/delete-file-folder-async`,
    uploadIntoFolder: `${BASE_CLOUD_URL}/api/${ver}/google-drive/upload-file-into-folder-async`,
  },
}
const SwitchEndPoint = () => {
  switch (env) {
    case Env.Prod:
      return BaseAPI
    case Env.Native:
      return NativeAPI
    case Env.Dev:
      return BaseAPI
  }
}

const endPoint = SwitchEndPoint()
export { endPoint }
