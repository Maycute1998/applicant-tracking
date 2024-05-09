import { AuthAction } from '../../app/stores/systems/reducers/actions/auth/authAction'

export type AuthContextType = {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
  onAuthenticated: () => void
  onUnauthenticated: () => void
}

export type AuthState = {
  isAuthenticated: boolean
}
