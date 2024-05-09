import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout, FormRoles, FormService, FormUsers, Home, Login, Register, Roles, Services, Users, Permissions, FormPermissions, PermissionInGroup } from '../../pages/index'
import { RouteName } from './routerConfig'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: RouteName.Home,
        element: <Home />,
      },
      {
        path: RouteName.Login,
        element: <Login />,
      },
      {
        path: RouteName.Register,
        element: <Register />,
      },
      {
        path: RouteName.Roles,
        element: <Roles />,
      },
      {
        path: RouteName.FormRoles,
        element: <FormRoles />,
      },
      {
        path: RouteName.Services,
        element: <Services />,
      },
      {
        path: RouteName.FormServices,
        element: <FormService />,
      },
      {
        path: RouteName.Users,
        element: <Users />,
      },
      {
        path: RouteName.FormUsers,
        element: <FormUsers />,
      },
      {
        path: RouteName.Permissions,
        element: <Permissions />,
      },
      {
        path: RouteName.FormPermissions,
        element: <FormPermissions />,
      },
      {
        path: RouteName.PermissionInGroup,
        element: <PermissionInGroup />,
      },
    ],
  },
])
export { router }
