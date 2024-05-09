import { ComponentType } from 'react'
import { usePermissionByModule } from '../hooks'
import { useAuth } from '../app/stores/systems'

type PermissionProps = {
  permission: string[]
}

export const withComponentPermissionModule = <T extends object>(WrappedComponent: ComponentType<T>, requiredModuleCode: string, requiredPermission: string[]) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const { permissions: permissionByModule } = usePermissionByModule(requiredModuleCode)
  const { state: authState } = useAuth()
  const ComponentWithPermission = (props: T) => {
    if (!requiredPermission && !requiredModuleCode) return null
    const listPermission: PermissionProps = { permission: [] }
    if (permissionByModule && permissionByModule.length !== 0) {
      permissionByModule.map(item => listPermission.permission.push(item.buttonId))
    }
    const { permission } = listPermission
    const hasPermission = requiredPermission.every(perm => permission.includes(perm))
    return (hasPermission && authState.isAuthenticated) ? <WrappedComponent {...props} /> : null
  }
  ComponentWithPermission.displayName = `withComponentPermissionModule(${displayName})`
  return ComponentWithPermission
}
