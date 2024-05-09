import { useContext } from 'react'
import { AuthContextType } from '../../../../../data-type/auth/authType'
import { AuthContext } from '../../contexts/auth-context/authContext'

const useAuth = () => {
  const { state, dispatch, onAuthenticated, onUnauthenticated } = useContext(AuthContext) as AuthContextType
  return {
    state,
    dispatch,
    onAuthenticated,
    onUnauthenticated,
  }
}
export { useAuth }
