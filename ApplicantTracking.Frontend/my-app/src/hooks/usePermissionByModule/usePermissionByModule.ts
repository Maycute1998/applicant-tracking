import { useEffect, useState } from 'react'
import { ApiResponseProps, UserRoleProps } from '../../data-type'
import { GetUserRoleByModuleAsync } from '../../services'
import { WriteLogTable } from '../../utils/helper'

const usePermissionByModule = (moduleCode: string) => {
  const [permissions, setPermissions] = useState<UserRoleProps[]>([])
  const [isPending, setIsPending] = useState<boolean>(false)

  const getPermissionsAsync = async () => {
    const userRole: UserRoleProps[] = []
    const params = {
      moduleCode: moduleCode,
    }
    setIsPending(true)
    await GetUserRoleByModuleAsync(params)
      .then(res => {
        const items: ApiResponseProps<UserRoleProps[]> = res as ApiResponseProps<UserRoleProps[]>
        if (items?.status) {
          if (items?.data) {
            items?.data?.map(item => {
              userRole.push({
                id: item?.id,
                permissionCode: item?.permissionCode,
                permissionName: item?.permissionName,
                buttonId: item?.buttonId,
              })
            })
            setPermissions(userRole)
          }
          WriteLogTable({
            groupTitle: 'Response from API permissions hook',
            data: items.data,
          })
        }
        return userRole
      })
      .catch(err => {
        WriteLogTable({
          groupTitle: 'Response from API permissions hook',
          data: err,
        })
      })
      .finally(() => {
        setIsPending(false)
      })
  }

  useEffect(() => {
    void getPermissionsAsync()
  }, [])
  return {
    permissions,
    isPending,
  }
}
export default usePermissionByModule
