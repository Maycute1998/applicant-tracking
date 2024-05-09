import { AuthState } from '../../../../../../data-type'

export type AuthAction =
  | {
      type: 'login'
      payload: AuthState
    }
  | {
      type: 'logout'
      payload: AuthState
    }
