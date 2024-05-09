import { ComponentType } from 'react'

type PermissionProps = {
  permission: string[]
}

const Permissions: PermissionProps = {
  permission: ['admin'],
}

export const withComponentPermission = <T extends object>(WrappedComponent: ComponentType<T>, requiredPermission: string[]) => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component'
  const ComponentWithPermission = (props: T) => {
    if (!requiredPermission) return null
    const { permission } = Permissions
    const hasPermission = requiredPermission.every(perm => permission.includes(perm))
    return hasPermission ? <WrappedComponent {...props} /> : null
  }
  ComponentWithPermission.displayName = `withComponentPermission(${displayName})`
  return ComponentWithPermission
}
