import PropTypes from 'prop-types'
import { useCallback, useReducer } from 'react'
import { AuthContext, authReducer } from '../..'
import { InitAuthState } from '../../state-init/stateInit'

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, InitAuthState)

  const onAuthenticated = useCallback(() => {
    dispatch({
      type: 'login',
      payload: {
        isAuthenticated: true,
      },
    })
  }, [])

  const onUnauthenticated = useCallback(() => {
    dispatch({
      type: 'logout',
      payload: {
        isAuthenticated: false,
      },
    })
  }, [])

  return <AuthContext.Provider value={{ state, dispatch, onAuthenticated, onUnauthenticated }}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { AuthProvider }
