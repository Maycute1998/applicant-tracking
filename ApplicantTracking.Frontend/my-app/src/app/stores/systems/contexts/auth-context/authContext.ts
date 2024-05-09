import { createContext } from 'react'
import { AuthContextType } from '../../../../../data-type/auth/authType'
import { InitAuthState } from '../../state-init/stateInit'

const AuthContext = createContext<AuthContextType | null>({
  state: InitAuthState,
  dispatch: () => {},
  onAuthenticated: () => {},
  onUnauthenticated: () => {},
})
export { AuthContext }
